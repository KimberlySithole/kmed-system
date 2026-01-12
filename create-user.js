// KMED User Creation Script for PostgreSQL
// This script helps you create new user accounts with proper password hashing

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kmed_system',
    port: process.env.DB_PORT || 5432,
});

// Available roles in the system
const ROLES = {
    admin: 'System Administrator - Full access to all features',
    analyst: 'Data Analyst - Can analyze claims and view reports',
    provider: 'Healthcare Provider - Can submit and manage claims',
    patient: 'Patient - Can view own claims and submit appeals',
    investigator: 'Fraud Investigator - Can investigate flagged claims',
    regulator: 'Compliance Regulator - Can audit and enforce compliance'
};

async function createUser(userData) {
    const {
        username,
        password,
        email,
        role,
        firstName,
        lastName,
        phone,
        department
    } = userData;

    // Validate role
    if (!ROLES[role]) {
        throw new Error(`Invalid role. Available roles: ${Object.keys(ROLES).join(', ')}`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    try {
        const result = await pool.query(
            `INSERT INTO users (username, password_hash, email, role, first_name, last_name, phone, department) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING id, username, email, role, first_name, last_name, created_at`,
            [username, passwordHash, email, role, firstName, lastName, phone, department]
        );

        console.log('✅ User created successfully:');
        console.log(`   ID: ${result.rows[0].id}`);
        console.log(`   Username: ${result.rows[0].username}`);
        console.log(`   Email: ${result.rows[0].email}`);
        console.log(`   Role: ${result.rows[0].role}`);
        console.log(`   Name: ${result.rows[0].first_name} ${result.rows[0].last_name}`);
        console.log(`   Created: ${result.rows[0].created_at}`);
        
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            throw new Error('Username or email already exists');
        }
        throw error;
    }
}

async function listUsers() {
    try {
        const result = await pool.query(
            'SELECT id, username, email, role, first_name, last_name, is_active, created_at FROM users ORDER BY created_at DESC'
        );
        
        console.log('\n📋 Current Users:');
        console.log('─'.repeat(80));
        result.rows.forEach(user => {
            console.log(`ID: ${user.id}`);
            console.log(`Username: ${user.username}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role} (${ROLES[user.role]})`);
            console.log(`Name: ${user.first_name} ${user.last_name}`);
            console.log(`Active: ${user.is_active ? '✅' : '❌'}`);
            console.log(`Created: ${user.created_at}`);
            console.log('─'.repeat(40));
        });
    } catch (error) {
        console.error('Error listing users:', error.message);
    }
}

async function deactivateUser(username) {
    try {
        const result = await pool.query(
            'UPDATE users SET is_active = FALSE WHERE username = $1 RETURNING username',
            [username]
        );
        
        if (result.rows.length === 0) {
            console.log('❌ User not found');
        } else {
            console.log(`✅ User ${username} deactivated`);
        }
    } catch (error) {
        console.error('Error deactivating user:', error.message);
    }
}

async function resetPassword(username, newPassword) {
    try {
        const passwordHash = await bcrypt.hash(newPassword, 12);
        const result = await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2 RETURNING username',
            [passwordHash, username]
        );
        
        if (result.rows.length === 0) {
            console.log('❌ User not found');
        } else {
            console.log(`✅ Password reset for user ${username}`);
        }
    } catch (error) {
        console.error('Error resetting password:', error.message);
    }
}

// Interactive user creation
async function interactiveCreateUser() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    console.log('\n👤 Create New User Account');
    console.log('='.repeat(30));

    try {
        console.log('\nAvailable Roles:');
        Object.entries(ROLES).forEach(([role, description]) => {
            console.log(`  ${role}: ${description}`);
        });

        const userData = {
            username: await question('Username: '),
            password: await question('Password: '),
            email: '', // Will be auto-generated
            role: await question('Role (admin/analyst/provider/patient/investigator/regulator): '),
            firstName: await question('First Name: '),
            lastName: await question('Last Name: '),
            phone: await question('Phone (optional): '),
            department: await question('Department (optional): ')
        };

        // Auto-generate email with @kmed.com
        userData.email = `${userData.username.toLowerCase()}@kmed.com`;
        
        console.log(`\n📧 Auto-generated email: ${userData.email}`);
        
        const confirm = await question('Use this email? (Y/n): ');
        if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes' && confirm !== '') {
            userData.email = await question('Custom email: ');
        }

        await createUser(userData);
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
    } finally {
        rl.close();
    }
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    try {
        switch (command) {
            case 'create':
                if (args.length === 2 && args[1] === 'interactive') {
                    await interactiveCreateUser();
                } else if (args.length >= 8) {
                    await createUser({
                        username: args[1],
                        password: args[2],
                        email: args[3],
                        role: args[4],
                        firstName: args[5],
                        lastName: args[6],
                        phone: args[7] || null,
                        department: args[8] || null
                    });
                } else {
                    console.log('Usage:');
                    console.log('  node create-user.js create <username> <password> <email> <role> <firstName> <lastName> [phone] [department]');
                    console.log('  node create-user.js create interactive');
                }
                break;

            case 'list':
                await listUsers();
                break;

            case 'deactivate':
                if (args.length === 2) {
                    await deactivateUser(args[1]);
                } else {
                    console.log('Usage: node create-user.js deactivate <username>');
                }
                break;

            case 'reset-password':
                if (args.length === 3) {
                    await resetPassword(args[1], args[2]);
                } else {
                    console.log('Usage: node create-user.js reset-password <username> <newPassword>');
                }
                break;

            default:
                console.log('KMED User Management System');
                console.log('\nCommands:');
                console.log('  create <username> <password> <email> <role> <firstName> <lastName> [phone] [department]');
                console.log('  create interactive - Interactive user creation');
                console.log('  list - List all users');
                console.log('  deactivate <username> - Deactivate user');
                console.log('  reset-password <username> <newPassword> - Reset user password');
                console.log('\nRoles:', Object.keys(ROLES).join(', '));
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

// Export functions for use in other modules
module.exports = {
    createUser,
    listUsers,
    deactivateUser,
    resetPassword,
    ROLES
};

// Run if called directly
if (require.main === module) {
    main();
}
