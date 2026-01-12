// KMED Database Setup Script
// This script properly creates the database schema for PostgreSQL

const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'kmed_system',
    port: process.env.DB_PORT || 5432,
});

async function setupDatabase() {
    console.log('🔧 Setting up KMED database...');
    
    try {
        // Enable UUID extension
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        console.log('✅ UUID extension enabled');

        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                email VARCHAR(100) UNIQUE NOT NULL,
                role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'analyst', 'provider', 'patient', 'investigator', 'regulator')),
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                phone VARCHAR(20),
                department VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE,
                auth_method VARCHAR(20) DEFAULT 'local' CHECK (auth_method IN ('local', 'google', 'linked')),
                google_id VARCHAR(50),
                google_email VARCHAR(255),
                google_name VARCHAR(255),
                google_picture TEXT
            );
        `);
        console.log('✅ Users table created');

        // Create claims table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS claims (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                claim_number VARCHAR(50) UNIQUE NOT NULL,
                patient_id VARCHAR(50) NOT NULL,
                provider_id VARCHAR(50) NOT NULL,
                patient_name VARCHAR(100) NOT NULL,
                provider_name VARCHAR(100) NOT NULL,
                diagnosis_code VARCHAR(20),
                procedure_code VARCHAR(20),
                amount DECIMAL(10,2) NOT NULL,
                date_of_service DATE NOT NULL,
                submission_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'flagged', 'in_review')),
                risk_level VARCHAR(10) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Claims table created');

        // Create fraud_alerts table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS fraud_alerts (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
                alert_type VARCHAR(50) NOT NULL,
                severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
                description TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
                assigned_to VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Fraud alerts table created');

        // Create user_google_mappings table for OAuth
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_google_mappings (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                google_id VARCHAR(50) UNIQUE NOT NULL,
                google_email VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Google mappings table created');

        // Create audit_logs table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                action VARCHAR(100) NOT NULL,
                table_name VARCHAR(50),
                record_id UUID,
                old_values JSONB,
                new_values JSONB,
                ip_address INET,
                user_agent TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Audit logs table created');

        // Create indexes for better performance
        await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_claims_risk_level ON claims(risk_level);');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_fraud_alerts_severity ON fraud_alerts(severity);');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);');
        console.log('✅ Database indexes created');

        console.log('🎉 Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run the setup
if (require.main === module) {
    setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };
