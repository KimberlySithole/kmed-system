// Admin Role Management for Google OAuth Users
// This script allows admins to upgrade Google users to different roles

const { Pool } = require('pg');
const readline = require('readline');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kmed_system',
    port: process.env.DB_PORT || 5432,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

const ROLES = {
    admin: 'System Administrator - Full access to all features',
    analyst: 'Data Analyst - Can analyze claims and view reports',
    provider: 'Healthcare Provider - Can submit and manage claims',
    patient: 'Patient - Can view own claims and submit appeals',
    investigator: 'Fraud Investigator - Can investigate flagged claims',
    regulator: 'Compliance Regulator - Can audit and enforce compliance'
};

async function listGoogleUsers() {
    try {
        const result = await pool.query(`
            SELECT u.id, u.username, u.email, u.role, u.first_name, u.last_name, u.auth_method, u.created_at,
                   g.google_id, g.google_email
            FROM users u
            LEFT JOIN user_google_mappings g ON u.id = g.user_id
            WHERE u.auth_method = 'google'
            ORDER BY u.created_at DESC
        `);
        
        console.log('\n👥 Google Users:');
        console.log('─'.repeat(80));
        result.rows.forEach((user, index) => {
            console.log(`${index + 1}. ${user.first_name} ${user.last_name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Username: ${user.username}`);
            console.log(`   Role: ${user.role} (${ROLES[user.role]})`);
            console.log(`   Google ID: ${user.google_id}`);
            console.log(`   Created: ${user.created_at}`);
            console.log('─'.repeat(40));
        });
    } catch (error) {
        console.error('Error listing Google users:', error.message);
    }
}

async function upgradeUserRole() {
    try {
        console.log('\n🔐 Upgrade User Role');
        console.log('='.repeat(30));
        
        const email = await question('Enter user email to upgrade: ');
        const newRole = await question('Enter new role (admin/analyst/provider/patient/investigator/regulator): ');
        
        // Validate role
        if (!ROLES[newRole]) {
            console.log('❌ Invalid role. Available roles:', Object.keys(ROLES).join(', '));
            return;
        }
        
        // Update user role
        const result = await pool.query(
            'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 AND auth_method = \'google\' RETURNING *',
            [newRole, email]
        );
        
        if (result.rows.length === 0) {
            console.log('❌ User not found or not a Google user');
        } else {
            const user = result.rows[0];
            console.log('✅ User role updated successfully:');
            console.log(`   Email: ${user.email}`);
            console.log(`   Name: ${user.first_name} ${user.last_name}`);
            console.log(`   New Role: ${user.role} (${ROLES[user.role]})`);
            console.log(`   Updated: ${user.updated_at}`);
            
            // Log the role change
            await pool.query(
                'INSERT INTO system_logs (user_id, action, details) VALUES ($1, $2, $3)',
                [user.id, 'ROLE_UPGRADE', JSON.stringify({ 
                    old_role: 'patient', 
                    new_role: newRole, 
                    upgraded_by: 'admin',
                    timestamp: new Date().toISOString()
                })]
            );
        }
    } catch (error) {
        console.error('Error upgrading user role:', error.message);
    }
}

async function bulkUpgradeRoles() {
    try {
        console.log('\n📋 Bulk Role Upgrade');
        console.log('='.repeat(30));
        
        const newRole = await question('Enter role to assign to all Google users (admin/analyst/provider/investigator/regulator): ');
        
        if (!ROLES[newRole] || newRole === 'patient') {
            console.log('❌ Invalid role or no change needed');
            return;
        }
        
        const result = await pool.query(
            'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE auth_method = \'google\' RETURNING COUNT(*)',
            [newRole]
        );
        
        console.log(`✅ Updated ${result.rows[0].count} Google users to role: ${newRole}`);
        
        // Log the bulk change
        await pool.query(
            'INSERT INTO system_logs (user_id, action, details) VALUES ($1, $2, $3)',
            [null, 'BULK_ROLE_UPGRADE', JSON.stringify({ 
                new_role: newRole, 
                users_updated: result.rows[0].count,
                upgraded_by: 'admin',
                timestamp: new Date().toISOString()
            })]
        );
    } catch (error) {
        console.error('Error in bulk upgrade:', error.message);
    }
}

async function showRoleStats() {
    try {
        const result = await pool.query(`
            SELECT role, COUNT(*) as count, 
                   ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users WHERE auth_method = 'google'), 2) as percentage
            FROM users 
            WHERE auth_method = 'google'
            GROUP BY role
            ORDER BY count DESC
        `);
        
        console.log('\n📊 Google User Role Distribution:');
        console.log('─'.repeat(50));
        result.rows.forEach(row => {
            console.log(`${row.role}: ${row.count} users (${row.percentage}%)`);
        });
        
        const totalResult = await pool.query(
            'SELECT COUNT(*) as total FROM users WHERE auth_method = \'google\''
        );
        console.log(`\nTotal Google Users: ${totalResult.rows[0].total}`);
    } catch (error) {
        console.error('Error showing role stats:', error.message);
    }
}

async function main() {
    const command = process.argv[2];
    
    switch (command) {
        case 'list':
            await listGoogleUsers();
            break;
        case 'upgrade':
            await upgradeUserRole();
            break;
        case 'bulk-upgrade':
            await bulkUpgradeRoles();
            break;
        case 'stats':
            await showRoleStats();
            break;
        default:
            console.log('🔐 Admin Role Management for Google OAuth Users');
            console.log('\nCommands:');
            console.log('  node admin-role-management.js list - List all Google users');
            console.log('  node admin-role-management.js upgrade - Upgrade individual user role');
            console.log('  node admin-role-management.js bulk-upgrade - Upgrade all Google users');
            console.log('  node admin-role-management.js stats - Show role distribution');
            console.log('\nAvailable Roles:');
            Object.entries(ROLES).forEach(([role, description]) => {
                console.log(`  ${role}: ${description}`);
            });
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    listGoogleUsers,
    upgradeUserRole,
    bulkUpgradeRoles,
    showRoleStats
};
