// KMED Backend Server with PostgreSQL Integration
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'kmed-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kmed_system',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('PostgreSQL connected successfully at:', res.rows[0].now);
    }
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Login endpoint
app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Query user from database
        const result = await pool.query(
            'SELECT id, username, password_hash, email, role, first_name, last_name FROM users WHERE username = $1 AND is_active = TRUE',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log login attempt
        await pool.query(
            'INSERT INTO system_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
            [user.id, 'LOGIN', req.ip, req.get('User-Agent')]
        );

        res.json({
            message: 'Login successful',
            access_token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                name: `${user.first_name} ${user.last_name}`
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user claims
app.get('/api/claims', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM v_active_claims ORDER BY submitted_date DESC LIMIT 50'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get claims error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get claim details
app.get('/api/claims/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT c.*, 
                    p.first_name as patient_first_name, 
                    p.last_name as patient_last_name, 
                    pr.first_name as provider_first_name, 
                    pr.last_name as provider_last_name, 
                    ic.name as insurance_company 
             FROM claims c 
             JOIN patients p ON c.patient_id = p.id 
             JOIN providers pr ON c.provider_id = pr.id 
             JOIN insurance_companies ic ON c.insurance_company_id = ic.id 
             WHERE c.claim_id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Claim not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get claim details error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get investigations
app.get('/api/investigations', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM investigations ORDER BY date_opened DESC LIMIT 50'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get investigations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new claim
app.post('/api/claims', authenticateToken, async (req, res) => {
    try {
        const claimData = req.body;
        const result = await pool.query(
            `INSERT INTO claims (claim_id, patient_id, provider_id, insurance_company_id, diagnosis_code, procedure_code, service_date, submitted_date, amount, notes) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             RETURNING id`,
            [
                claimData.claim_id,
                claimData.patient_id,
                claimData.provider_id,
                claimData.insurance_company_id,
                claimData.diagnosis_code,
                claimData.procedure_code,
                claimData.service_date,
                claimData.submitted_date,
                claimData.amount,
                claimData.notes
            ]
        );
        
        res.status(201).json({ id: result.rows[0].id, message: 'Claim created successfully' });
    } catch (error) {
        console.error('Create claim error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update claim status
app.patch('/api/claims/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await pool.query(
            'UPDATE claims SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE claim_id = $2',
            [status, id]
        );
        
        res.json({ message: 'Claim status updated successfully' });
    } catch (error) {
        console.error('Update claim status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get dashboard metrics
app.get('/api/dashboard/metrics', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT get_user_statistics($1) as stats', [userId]);
        res.json(result.rows[0].stats);
    } catch (error) {
        console.error('Get metrics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get high-risk investigations
app.get('/api/investigations/high-risk', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM v_high_risk_investigations ORDER BY risk_score DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get high-risk investigations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create investigation
app.post('/api/investigations', authenticateToken, async (req, res) => {
    try {
        const invData = req.body;
        const result = await pool.query(
            `INSERT INTO investigations (investigation_id, title, description, status, priority, assigned_to, created_by, date_opened, region, findings, risk_score, next_steps) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
             RETURNING id`,
            [
                invData.investigation_id,
                invData.title,
                invData.description,
                invData.status || 'open',
                invData.priority || 'medium',
                invData.assigned_to,
                req.user.id,
                invData.date_opened,
                invData.region,
                invData.findings,
                invData.risk_score || 0,
                invData.next_steps
            ]
        );
        
        res.status(201).json({ id: result.rows[0].id, message: 'Investigation created successfully' });
    } catch (error) {
        console.error('Create investigation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get audit logs
app.get('/api/audit-logs', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        res.json({ 
            status: 'healthy', 
            database: 'connected',
            timestamp: result.rows[0].current_time
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy', 
            database: 'disconnected',
            error: error.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`KMED Backend Server with PostgreSQL running on port ${PORT}`);
    console.log('PostgreSQL database connected and ready');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await pool.end();
    process.exit(0);
});

module.exports = app;
