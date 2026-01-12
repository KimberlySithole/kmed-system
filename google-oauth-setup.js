// Google OAuth Setup Script for KMED System
// This script helps you set up Google OAuth authentication

const readline = require('readline');
const { Pool } = require('pg');
require('dotenv').config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function setupGoogleOAuth() {
    console.log('🔐 Google OAuth Setup for KMED System');
    console.log('='.repeat(50));
    
    console.log('\n📋 What You\'ll Need:');
    console.log('1. Google Cloud Console account');
    console.log('2. Project created in Google Cloud');
    console.log('3. OAuth 2.0 credentials');
    console.log('4. Authorized redirect URI');
    
    console.log('\n🌐 Google Cloud Console Setup:');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Create new project or select existing');
    console.log('3. Go to "APIs & Services" > "Credentials"');
    console.log('4. Click "Create Credentials" > "OAuth 2.0 Client IDs"');
    console.log('5. Select "Web application"');
    console.log('6. Add redirect URI: http://localhost:3000/auth/google/callback');
    console.log('7. Copy Client ID and Client Secret');
    
    console.log('\n⚙️  Required Information:');
    
    try {
        const clientId = await question('Google Client ID: ');
        const clientSecret = await question('Google Client Secret: ');
        const redirectUri = await question('Redirect URI (default: http://localhost:3000/auth/google/callback): ') || 'http://localhost:3000/auth/google/callback';
        
        // Update .env file
        const envContent = `# KMED PostgreSQL Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password123
DB_NAME=kmed_system
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=8000
NODE_ENV=development

# Google OAuth Configuration
GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_SECRET=${clientSecret}
GOOGLE_REDIRECT_URI=${redirectUri}
SESSION_SECRET=your-session-secret-change-this-in-production

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# PostgreSQL SSL (optional)
# DB_SSL=true
# DB_SSL_CERT=path/to/cert.pem
# DB_SSL_KEY=path/to/key.pem
# DB_SSL_CA=path/to/ca.pem
`;
        
        const fs = require('fs');
        fs.writeFileSync('.env', envContent);
        
        console.log('\n✅ .env file updated with Google OAuth credentials!');
        console.log('\n📝 Next Steps:');
        console.log('1. Restart your backend server');
        console.log('2. Test Google OAuth login');
        console.log('3. Users can now login with Google accounts');
        
        console.log('\n🔗 Test URLs:');
        console.log('Frontend: http://localhost:3000');
        console.log('Backend: http://localhost:8000');
        console.log('Google Auth: http://localhost:8000/auth/google');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

async function createGoogleUserTable() {
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'kmed_system',
        port: process.env.DB_PORT || 5432,
    });

    try {
        // Add Google OAuth fields to users table
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS google_id VARCHAR(50),
            ADD COLUMN IF NOT EXISTS google_email VARCHAR(255),
            ADD COLUMN IF NOT EXISTS google_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS google_picture TEXT,
            ADD COLUMN IF NOT EXISTS auth_method VARCHAR(20) DEFAULT 'local' CHECK (auth_method IN ('local', 'google'));
        `);
        
        console.log('✅ Users table updated for Google OAuth');
        
        // Create user Google mappings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_google_mappings (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                google_id VARCHAR(50) UNIQUE NOT NULL,
                google_email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('✅ Google OAuth mappings table created');
        
    } catch (error) {
        console.error('❌ Database setup error:', error.message);
    } finally {
        await pool.end();
    }
}

async function main() {
    const command = process.argv[2];
    
    switch (command) {
        case 'setup':
            await setupGoogleOAuth();
            break;
        case 'database':
            await createGoogleUserTable();
            break;
        default:
            console.log('Google OAuth Setup Tool');
            console.log('\nCommands:');
            console.log('  node google-oauth-setup.js setup - Interactive OAuth setup');
            console.log('  node google-oauth-setup.js database - Update database schema');
            console.log('\nUsage:');
            console.log('  1. Run "node google-oauth-setup.js database" first');
            console.log('  2. Run "node google-oauth-setup.js setup" second');
            console.log('  3. Restart backend server');
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    setupGoogleOAuth,
    createGoogleUserTable
};
