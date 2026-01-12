// Google OAuth Authentication Routes for KMED System
const express = require('express');
const { google } = require('googleapis');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kmed_system',
    port: process.env.DB_PORT || 5432,
});

// Google OAuth configuration
const oauth2Client = new google.auth.OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
);

// Get Google auth URL
router.get('/google', (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];
    
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
    
    res.json({ authUrl: url });
});

// Google OAuth callback
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        // Get tokens from Google
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        
        // Get user info from Google
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();
        
        const googleUser = {
            id: data.id,
            email: data.email,
            name: data.name,
            picture: data.picture,
            verified: data.verified_email
        };
        
        // Check if user exists in database
        let user = await findUserByGoogleId(googleUser.id);
        
        if (!user) {
            // Check if user exists with same email (local account)
            user = await findUserByEmail(googleUser.email);
            
            if (user) {
                // Link Google account to existing local account
                await linkGoogleAccount(user.id, googleUser);
                user.auth_method = 'linked'; // Both local and Google
                console.log('Google account linked to existing local account:', googleUser.email);
            } else {
                // Create new user from Google data
                user = await createGoogleUser(googleUser);
                user.auth_method = 'google'; // Google only
                console.log('New user created from Google account:', googleUser.email);
            }
        } else {
            // Update existing Google user info
            await updateGoogleUser(user.id, googleUser);
            user.auth_method = 'google'; // Google only
            console.log('Existing Google user updated:', googleUser.email);
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username || googleUser.email,
                email: user.email || googleUser.email,
                role: user.role || 'patient',
                auth_method: user.auth_method
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Log login
        await logUserLogin(user.id, user.auth_method);
        
        // Redirect to frontend with token
        const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`;
        res.redirect(redirectUrl);
        
    } catch (error) {
        console.error('Google OAuth error:', error);
        const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/error?message=${encodeURIComponent('Authentication failed')}`;
        res.redirect(errorUrl);
    }
});

// Helper functions
async function findUserByGoogleId(googleId) {
    try {
        const result = await pool.query(
            'SELECT u.* FROM users u JOIN user_google_mappings g ON u.id = g.user_id WHERE g.google_id = $1',
            [googleId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error finding user by Google ID:', error);
        return null;
    }
}

async function findUserByEmail(email) {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        return null;
    }
}

async function linkGoogleAccount(userId, googleUser) {
    try {
        await pool.query(
            'INSERT INTO user_google_mappings (user_id, google_id, google_email) VALUES ($1, $2, $3)',
            [userId, googleUser.id, googleUser.email]
        );
        
        await pool.query(
            'UPDATE users SET auth_method = \'linked\', google_id = $1, google_email = $2, google_name = $3, google_picture = $4 WHERE id = $5',
            [googleUser.id, googleUser.email, googleUser.name, googleUser.picture, userId]
        );
        
        console.log('✅ Google account linked to existing local account:', googleUser.email);
        console.log('📧 User can now login with either method');
    } catch (error) {
        console.error('Error linking Google account:', error);
    }
}

async function createGoogleUser(googleUser) {
    try {
        // Default role to patient for all Google users
        // They can be upgraded later by admin
        const role = 'patient';
        
        // Create username from email
        const username = googleUser.email.split('@')[0];
        
        const result = await pool.query(
            `INSERT INTO users (username, email, role, first_name, last_name, google_id, google_email, google_name, google_picture, auth_method) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'google') 
             RETURNING *`,
            [
                username,
                googleUser.email,
                role,
                googleUser.name.split(' ')[0] || 'User',
                googleUser.name.split(' ')[1] || 'Name',
                googleUser.id,
                googleUser.email,
                googleUser.name,
                googleUser.picture
            ]
        );
        
        // Create mapping
        await pool.query(
            'INSERT INTO user_google_mappings (user_id, google_id, google_email) VALUES ($1, $2, $3)',
            [result.rows[0].id, googleUser.id, googleUser.email]
        );
        
        console.log('New patient user created from Google account:', googleUser.email);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating Google user:', error);
        return null;
    }
}

async function updateGoogleUser(userId, googleUser) {
    try {
        await pool.query(
            'UPDATE users SET google_email = $1, google_name = $2, google_picture = $3, last_login = CURRENT_TIMESTAMP WHERE id = $4',
            [googleUser.email, googleUser.name, googleUser.picture, userId]
        );
        
        console.log('Google user info updated:', googleUser.email);
    } catch (error) {
        console.error('Error updating Google user:', error);
    }
}

async function logUserLogin(userId, method) {
    try {
        await pool.query(
            'INSERT INTO system_logs (user_id, action, details) VALUES ($1, $2, $3)',
            [userId, 'LOGIN', JSON.stringify({ method, timestamp: new Date().toISOString() })]
        );
    } catch (error) {
        console.error('Error logging user login:', error);
    }
}

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, role, first_name, last_name, auth_method, google_picture FROM users WHERE id = $1',
            [req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error getting user info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unlink Google account
router.post('/unlink-google', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM user_google_mappings WHERE user_id = $1', [req.user.id]);
        await pool.query(
            'UPDATE users SET auth_method = \'local\', google_id = NULL, google_email = NULL, google_name = NULL, google_picture = NULL WHERE id = $1',
            [req.user.id]
        );
        
        res.json({ message: 'Google account unlinked successfully' });
    } catch (error) {
        console.error('Error unlinking Google account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

module.exports = router;
