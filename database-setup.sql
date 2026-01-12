-- KMED Healthcare Fraud Detection System - PostgreSQL Setup
-- This script creates database structure and initial data for PostgreSQL

-- Create database
CREATE DATABASE kmed_system;
\c kmed_system;

-- Enable UUID extension for better primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Can be null for Google-only users
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
    google_id VARCHAR(50), -- Google OAuth ID
    google_email VARCHAR(255), -- Google email
    google_name VARCHAR(255), -- Google display name
    google_picture TEXT -- Google profile picture
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Providers table
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    npi_number VARCHAR(20) UNIQUE NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    specialty VARCHAR(100),
    practice_name VARCHAR(200),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    phone VARCHAR(20),
    fax VARCHAR(20),
    email VARCHAR(100),
    years_experience INTEGER,
    education_background TEXT,
    certifications TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    ssn VARCHAR(11) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    primary_insurance VARCHAR(100),
    secondary_insurance VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insurance companies table
CREATE TABLE insurance_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    phone VARCHAR(20),
    fax VARCHAR(20),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_insurance_companies_updated_at BEFORE UPDATE ON insurance_companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Claims table
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id VARCHAR(20) UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    insurance_company_id UUID NOT NULL REFERENCES insurance_companies(id),
    diagnosis_code VARCHAR(20) NOT NULL,
    procedure_code VARCHAR(20) NOT NULL,
    service_date DATE NOT NULL,
    submitted_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'pending', 'approved', 'denied', 'flagged', 'under_review')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    risk_score DECIMAL(5,2) DEFAULT 0.00,
    notes TEXT,
    supporting_documents JSONB,
    prior_authorization VARCHAR(50),
    place_of_service VARCHAR(2),
    modifiers VARCHAR(50),
    approved_date DATE,
    approved_amount DECIMAL(10,2),
    denial_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Investigations table
CREATE TABLE investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'active', 'closed', 'suspended')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assigned_to UUID REFERENCES users(id),
    created_by UUID NOT NULL REFERENCES users(id),
    date_opened DATE NOT NULL,
    date_closed DATE,
    region VARCHAR(100),
    findings TEXT,
    risk_score DECIMAL(5,2) DEFAULT 0.00,
    next_steps TEXT,
    evidence JSONB,
    related_claims JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_investigations_updated_at BEFORE UPDATE ON investigations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('compliance', 'bias', 'security', 'performance', 'quarterly', 'investigation')),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'cancelled')),
    auditor_id UUID NOT NULL REFERENCES users(id),
    scope TEXT NOT NULL,
    findings TEXT,
    recommendations TEXT,
    compliance_score DECIMAL(5,2),
    next_audit_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_audit_logs_updated_at BEFORE UPDATE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Risk assessments table
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL REFERENCES claims(id),
    assessment_date DATE NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL,
    risk_factors JSONB,
    assessment_type VARCHAR(20) NOT NULL CHECK (assessment_type IN ('automated', 'manual', 'peer_review')),
    assessed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System logs table
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

-- Insert initial insurance companies
INSERT INTO insurance_companies (name, code, phone, email) VALUES
('Blue Cross Blue Shield', 'BCBS', '1-800-222-7278', 'info@bcbs.com'),
('Aetna', 'AET', '1-800-872-3862', 'info@aetna.com'),
('United Healthcare', 'UHC', '1-800-837-2921', 'info@uhc.com'),
('Medicare', 'MED', '1-800-633-4227', 'info@medicare.gov'),
('Medicaid', 'MCD', '1-800-331-0760', 'info@medicaid.gov'),
('Cigna', 'CIG', '1-800-244-6224', 'info@cigna.com'),
('Humana', 'HUM', '1-800-448-6262', 'info@humana.com'),
('Kaiser Permanente', 'KAI', '1-800-464-4000', 'info@kp.org');

-- Insert sample users (passwords will be hashed in backend)
INSERT INTO users (username, password_hash, email, role, first_name, last_name) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAUu7RYKQZv9P8QK5Y.Vpqc9Lw8Qj8Q5e', 'admin@kmed.com', 'admin', 'System', 'Administrator'),
('analyst', '$2b$12$LQv3c1yqBWVHxkd0LHAUu7RYKQZv9P8QK5Y.Vpqc9Lw8Qj8Q5e', 'analyst@kmed.com', 'analyst', 'John', 'Analyst'),
('provider', '$2b$12$LQv3c1yqBWVHxkd0LHAUu7RYKQZv9P8QK5Y.Vpqc9Lw8Qj8Q5e', 'provider@kmed.com', 'provider', 'Sarah', 'Johnson'),
('patient', '$2b$12$LQv3c1yqBWVHxkd0LHAUu7RYKQZv9P8QK5Y.Vpqc9Lw8Qj8Q5e', 'patient@kmed.com', 'patient', 'Jane', 'Doe'),
('investigator', '$2b$12$LQv3c1yqBWVHxkd0LHAUu7RYKQZv9P8QK5Y.Vpqc9Lw8Qj8Q5e', 'investigator@kmed.com', 'investigator', 'Michael', 'Chen'),
('regulator', '$2b$12$LQv3c1yqBWVHxkd0LHAUu7RYKQZv9P8QK5Y.Vpqc9Lw8Qj8Q5e', 'regulator@kmed.com', 'regulator', 'Robert', 'Williams');

-- Get user IDs for foreign key references
DO $$
DECLARE
    admin_user UUID;
    analyst_user UUID;
    provider_user UUID;
    patient_user UUID;
    investigator_user UUID;
    regulator_user UUID;
BEGIN
    SELECT id INTO admin_user FROM users WHERE username = 'admin';
    SELECT id INTO analyst_user FROM users WHERE username = 'analyst';
    SELECT id INTO provider_user FROM users WHERE username = 'provider';
    SELECT id INTO patient_user FROM users WHERE username = 'patient';
    SELECT id INTO investigator_user FROM users WHERE username = 'investigator';
    SELECT id INTO regulator_user FROM users WHERE username = 'regulator';

    -- Insert sample providers
    INSERT INTO providers (user_id, npi_number, license_number, specialty, practice_name, city, state, phone, email) VALUES
    (provider_user, '1234567890', 'MD-12345', 'Internal Medicine', 'Johnson Medical Group', 'Boston', 'MA', '617-555-0123', 'provider@kmed.com'),
    (investigator_user, '0987654321', 'MD-54321', 'Family Medicine', 'Williams Family Practice', 'New York', 'NY', '212-555-0456', 'investigator@kmed.com');

    -- Insert sample patients
    INSERT INTO patients (user_id, patient_id, first_name, last_name, date_of_birth, gender, phone, email, primary_insurance) VALUES
    (patient_user, 'P001', 'John', 'Smith', '1985-05-15', 'M', '617-555-0789', 'patient@kmed.com', 'Blue Cross Blue Shield'),
    (patient_user, 'P002', 'Jane', 'Doe', '1990-08-22', 'F', '617-555-0890', 'jane.doe@email.com', 'Aetna');
END $$;

-- Create indexes for better performance
CREATE INDEX idx_claims_patient_id ON claims(patient_id);
CREATE INDEX idx_claims_provider_id ON claims(provider_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_risk_score ON claims(risk_score);
CREATE INDEX idx_claims_claim_id ON claims(claim_id);
CREATE INDEX idx_investigations_status ON investigations(status);
CREATE INDEX idx_investigations_priority ON investigations(priority);
CREATE INDEX idx_investigations_investigation_id ON investigations(investigation_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);

-- Create GIN indexes for JSONB columns
CREATE INDEX idx_claims_supporting_documents ON claims USING GIN (supporting_documents);
CREATE INDEX idx_investigations_evidence ON investigations USING GIN (evidence);
CREATE INDEX idx_investigations_related_claims ON investigations USING GIN (related_claims);
CREATE INDEX idx_risk_assessments_risk_factors ON risk_assessments USING GIN (risk_factors);
CREATE INDEX idx_system_logs_details ON system_logs USING GIN (details);

-- Create view for active claims with risk scores
CREATE VIEW v_active_claims AS
SELECT 
    c.id,
    c.claim_id,
    p.first_name AS patient_first_name,
    p.last_name AS patient_last_name,
    pr.first_name AS provider_first_name,
    pr.last_name AS provider_last_name,
    ic.name AS insurance_company,
    c.diagnosis_code,
    c.procedure_code,
    c.service_date,
    c.amount,
    c.status,
    c.risk_score,
    c.priority,
    c.submitted_date
FROM claims c
JOIN patients p ON c.patient_id = p.id
JOIN providers pr ON c.provider_id = pr.id
JOIN insurance_companies ic ON c.insurance_company_id = ic.id
WHERE c.status IN ('submitted', 'pending', 'flagged', 'under_review');

-- Create view for high-risk investigations
CREATE VIEW v_high_risk_investigations AS
SELECT 
    i.id,
    i.investigation_id,
    i.title,
    i.status,
    i.priority,
    i.risk_score,
    i.date_opened,
    u.first_name AS assigned_first_name,
    u.last_name AS assigned_last_name,
    i.region
FROM investigations i
LEFT JOIN users u ON i.assigned_to = u.id
WHERE i.risk_score >= 7.0 OR i.priority IN ('high', 'critical');

-- Create function for risk assessment
CREATE OR REPLACE FUNCTION sp_assess_claim_risk(
    claim_id_param UUID,
    risk_factors_param JSONB,
    assessed_by_param UUID
) RETURNS VOID AS $$
DECLARE
    calculated_risk DECIMAL(5,2) := 0.0;
    claim_amount DECIMAL(10,2);
    service_days INTEGER;
BEGIN
    -- Get claim data
    SELECT amount, DATEDIFF(CURRENT_DATE, service_date) INTO claim_amount, service_days
    FROM claims
    WHERE id = claim_id_param;
    
    -- Calculate risk based on various factors
    calculated_risk := 
        CASE 
            WHEN claim_amount > 5000 THEN 8.5
            WHEN claim_amount > 2000 THEN 6.0
            WHEN claim_amount > 1000 THEN 4.0
            ELSE 2.0
        END +
        CASE 
            WHEN service_days > 90 THEN 3.0
            WHEN service_days > 60 THEN 2.0
            ELSE 0.0
        END;
    
    -- Insert risk assessment
    INSERT INTO risk_assessments (
        claim_id, 
        assessment_date, 
        risk_score, 
        risk_factors, 
        assessment_type, 
        assessed_by
    ) VALUES (
        claim_id_param,
        CURRENT_DATE,
        calculated_risk,
        risk_factors_param,
        'manual',
        assessed_by_param
    );
    
    -- Update claim risk score
    UPDATE claims 
    SET risk_score = calculated_risk,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = claim_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for audit logging
CREATE OR REPLACE FUNCTION tr_claims_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO system_logs (action, resource_type, resource_id, details)
    VALUES (
        'CREATE',
        'claim',
        NEW.claim_id,
        jsonb_build_object(
            'patient_id', NEW.patient_id,
            'provider_id', NEW.provider_id,
            'amount', NEW.amount,
            'diagnosis_code', NEW.diagnosis_code
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_claims_audit
    AFTER INSERT ON claims
    FOR EACH ROW EXECUTE FUNCTION tr_claims_audit();

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    user_role VARCHAR(20);
BEGIN
    SELECT role INTO user_role FROM users WHERE id = user_uuid;
    
    CASE user_role
        WHEN 'provider' THEN
            SELECT jsonb_build_object(
                'total_claims', COUNT(c.id),
                'approved_claims', COUNT(CASE WHEN c.status = 'approved' THEN 1 END),
                'pending_claims', COUNT(CASE WHEN c.status = 'pending' THEN 1 END),
                'total_amount', COALESCE(SUM(c.amount), 0)
            ) INTO result
            FROM claims c
            WHERE c.provider_id = (SELECT id FROM providers WHERE user_id = user_uuid);
            
        WHEN 'analyst' THEN
            SELECT jsonb_build_object(
                'total_claims', COUNT(c.id),
                'high_risk_claims', COUNT(CASE WHEN c.risk_score > 7 THEN 1 END),
                'avg_risk_score', COALESCE(AVG(c.risk_score), 0),
                'flagged_claims', COUNT(CASE WHEN c.status = 'flagged' THEN 1 END)
            ) INTO result
            FROM claims c;
            
        ELSE
            result := jsonb_build_object('message', 'No statistics available for this role');
    END CASE;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
