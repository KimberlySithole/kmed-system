// PostgreSQL database seeding script for KMED system
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kmed_system',
    port: process.env.DB_PORT || 5432,
});

async function seedDatabase() {
    try {
        console.log('Connected to PostgreSQL database for seeding...');

        // Hash passwords for all users
        const passwordHash = await bcrypt.hash('password123', 12);

        // Update user passwords
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE username IN ($2, $3, $4, $5, $6, $7)',
            [passwordHash, 'admin', 'analyst', 'provider', 'patient', 'investigator', 'regulator']
        );

        // Get user IDs for foreign key references
        const userResult = await pool.query(
            'SELECT id, username FROM users WHERE username IN ($1, $2, $3, $4, $5, $6)',
            ['admin', 'analyst', 'provider', 'patient', 'investigator', 'regulator']
        );

        const users = {};
        userResult.rows.forEach(user => {
            users[user.username] = user.id;
        });

        // Get insurance company IDs
        const insuranceResult = await pool.query('SELECT id, code FROM insurance_companies');
        const insurance = {};
        insuranceResult.rows.forEach(comp => {
            insurance[comp.code] = comp.id;
        });

        // Get provider IDs
        const providerResult = await pool.query(
            'SELECT id, user_id FROM providers WHERE user_id IN ($1, $2)',
            [users.provider, users.investigator]
        );
        const providers = {};
        providerResult.rows.forEach(provider => {
            if (provider.user_id === users.provider) providers.provider1 = provider.id;
            if (provider.user_id === users.investigator) providers.provider2 = provider.id;
        });

        // Get patient IDs
        const patientResult = await pool.query(
            'SELECT id, patient_id FROM patients WHERE patient_id IN ($1, $2)',
            ['P001', 'P002']
        );
        const patients = {};
        patientResult.rows.forEach(patient => {
            if (patient.patient_id === 'P001') patients.patient1 = patient.id;
            if (patient.patient_id === 'P002') patients.patient2 = patient.id;
        });

        // Insert sample claims
        const sampleClaims = [
            ['CLM001', patients.patient1, providers.provider1, insurance.BCBS, 'A45.9', '99214', '2024-01-15', '2024-01-15', 1250.00, 'approved', 'medium', 2.3, 'Routine checkup with preventive care'],
            ['CLM002', patients.patient2, providers.provider1, insurance.AET, 'J02.9', '99213', '2024-01-14', '2024-01-14', 850.00, 'pending', 'medium', 4.1, 'Follow-up visit for acute pharyngitis'],
            ['CLM003', patients.patient1, providers.provider1, insurance.BCBS, 'I10', '99215', '2024-01-13', '2024-01-13', 2100.00, 'flagged', 'high', 8.7, 'High-value claim requiring review'],
            ['CLM004', patients.patient2, providers.provider1, insurance.UHC, 'R06.02', '99212', '2024-01-12', '2024-01-12', 650.00, 'denied', 'low', 1.8, 'Claim denied due to missing authorization'],
            ['CLM005', patients.patient1, providers.provider2, insurance.AET, 'M54.5', '99214', '2024-01-11', '2024-01-11', 980.00, 'approved', 'medium', 3.2, 'Low back pain evaluation'],
            ['CLM006', patients.patient2, providers.provider2, insurance.BCBS, 'J45.909', '99213', '2024-01-10', '2024-01-10', 750.00, 'under_review', 'medium', 5.9, 'Asthma exacerbation treatment']
        ];

        for (const claim of sampleClaims) {
            await pool.query(
                'INSERT INTO claims (claim_id, patient_id, provider_id, insurance_company_id, diagnosis_code, procedure_code, service_date, submitted_date, amount, status, priority, risk_score, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (claim_id) DO NOTHING',
                claim
            );
        }

        // Insert sample investigations
        const sampleInvestigations = [
            ['INV001', 'Billing Pattern Anomaly', 'Unusual billing patterns detected in provider claims', 'active', 'high', users.analyst, users.admin, '2024-01-10', 'Northeast', '15 claims flagged for review, total value $45,000', 8.2, 'Request additional documentation'],
            ['INV002', 'Duplicate Billing Investigation', 'Potential duplicate billing for same services', 'closed', 'medium', users.analyst, users.admin, '2024-01-08', 'Western', '3 duplicate claims identified, total $2,400 recovered', 5.5, 'Case closed with corrective action'],
            ['INV003', 'Provider Compliance Review', 'Routine compliance audit of provider practices', 'open', 'medium', users.regulator, users.admin, '2024-01-12', 'Central', 'Minor documentation issues identified', 4.2, 'Schedule follow-up audit']
        ];

        for (const investigation of sampleInvestigations) {
            await pool.query(
                'INSERT INTO investigations (investigation_id, title, description, status, priority, assigned_to, created_by, date_opened, region, findings, risk_score, next_steps) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (investigation_id) DO NOTHING',
                investigation
            );
        }

        // Insert sample audit logs
        const sampleAudits = [
            ['AUD001', 'Q4 2023 Compliance Audit', 'compliance', 'completed', users.regulator, 'All providers in Northeast region', '23 minor violations, 2 major violations identified', 94.2, '2024-04-05'],
            ['AUD002', 'Bias Analysis Report', 'bias', 'in_progress', users.regulator, 'All claims processed in Q4 2023', 'Statistical anomalies detected in approval rates', null, '2024-02-15']
        ];

        for (const audit of sampleAudits) {
            await pool.query(
                'INSERT INTO audit_logs (audit_id, title, type, status, auditor_id, scope, findings, compliance_score, next_audit_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (audit_id) DO NOTHING',
                audit
            );
        }

        // Insert risk assessments
        const riskAssessments = [
            ['CLM001', '2024-01-15', 2.3, {amount: 1250, service_age: 0}, 'automated', null],
            ['CLM002', '2024-01-14', 4.1, {amount: 850, service_age: 1}, 'automated', null],
            ['CLM003', '2024-01-13', 8.7, {amount: 2100, service_age: 2, high_value: true}, 'automated', null]
        ];

        for (const assessment of riskAssessments) {
            const claimResult = await pool.query('SELECT id FROM claims WHERE claim_id = $1', [assessment[0]]);
            if (claimResult.rows.length > 0) {
                await pool.query(
                    'INSERT INTO risk_assessments (claim_id, assessment_date, risk_score, risk_factors, assessment_type, assessed_by) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
                    [claimResult.rows[0].id, assessment[1], assessment[2], JSON.stringify(assessment[3]), assessment[4], assessment[5]]
                );
            }
        }

        console.log('PostgreSQL database seeded successfully!');
        console.log('Sample data created for testing.');
        console.log('\nLogin credentials:');
        console.log('Username: admin, Password: password123');
        console.log('Username: analyst, Password: password123');
        console.log('Username: provider, Password: password123');
        console.log('Username: patient, Password: password123');
        console.log('Username: investigator, Password: password123');
        console.log('Username: regulator, Password: password123');

    } catch (error) {
        console.error('Error seeding PostgreSQL database:', error);
    } finally {
        await pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
