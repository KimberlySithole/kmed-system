# KMED User Account Creation Guide

## 🔐 Creating Login Accounts for PostgreSQL Integration

This guide shows you how to create user accounts that integrate with your PostgreSQL database.

## 📋 Available User Roles

| Role | Description | Permissions |
|------|-------------|--------------|
| **admin** | System Administrator | Full access to all features and user management |
| **analyst** | Data Analyst | Can analyze claims, view reports, and access analytics |
| **provider** | Healthcare Provider | Can submit claims, view own claims, and manage patients |
| **patient** | Patient | Can view own claims, submit appeals, and track status |
| **investigator** | Fraud Investigator | Can investigate flagged claims and manage cases |
| **regulator** | Compliance Regulator | Can audit system, enforce compliance, and view reports |

## 🚀 Quick Setup Methods

### Method 1: Interactive User Creation (Recommended)

```bash
node create-user.js create interactive
```

This will prompt you for:
- Username
- Password
- Email
- Role
- First Name
- Last Name
- Phone (optional)
- Department (optional)

### Method 2: Command Line Creation

```bash
node create-user.js create <username> <password> <email> <role> <firstName> <lastName> [phone] [department]
```

**Example:**
```bash
node create-user.js create johnsmith password123 john@kmed.com provider John Smith "555-0123" "Cardiology"
```

### Method 3: Use Existing Seed Users

The seed script already created these users:

| Username | Password | Role | Name |
|----------|-----------|-------|------|
| admin | password123 | admin | System Administrator |
| analyst | password123 | analyst | John Analyst |
| provider | password123 | provider | Sarah Johnson |
| patient | password123 | patient | Jane Doe |
| investigator | password123 | investigator | Michael Chen |
| regulator | password123 | regulator | Robert Williams |

## 🛠️ User Management Commands

### List All Users
```bash
node create-user.js list
```

### Deactivate a User
```bash
node create-user.js deactivate <username>
```

### Reset User Password
```bash
node create-user.js reset-password <username> <newPassword>
```

## 📝 Step-by-Step Setup

### Step 1: Setup Database (if not done)
```bash
# Create database
psql -U postgres -d kmed_system -f database-setup.sql

# Seed with initial data
npm run seed
```

### Step 2: Create Your First Admin User
```bash
node create-user.js create interactive
```
- Choose role: `admin`
- Set a strong password
- Use your actual email

### Step 3: Create Additional Users
Create users for each role you need:

```bash
# Create a provider
node create-user.js create drjohnson drpass123 johnson@clinic.com provider John Johnson "555-0123" "Family Medicine"

# Create an analyst
node create-user.js create asmith aspass123 asmith@kmed.com analyst Alice Smith "555-0456" "Analytics"

# Create an investigator
node create-user.js create mchen mpass123 mchen@kmed.com investigator Michael Chen "555-0789" "Fraud Investigation"
```

### Step 4: Test Login
1. Start the backend server:
   ```bash
   npm start
   ```

2. Start the frontend:
   ```bash
   npm run frontend
   ```

3. Open `http://localhost:3000`

4. Login with any created user

## 🔒 Security Best Practices

### Password Requirements
- Minimum 8 characters
- Include uppercase and lowercase letters
- Include numbers
- Include special characters

### User Management
- Use unique usernames and emails
- Deactivate users instead of deleting
- Regular password resets for security
- Assign minimum required roles

### Database Security
- Change default PostgreSQL password
- Use environment variables for credentials
- Enable SSL in production
- Regular database backups

## 📊 Role-Based Access Examples

### Provider Dashboard Access
```javascript
// Provider can only see their own claims
SELECT * FROM claims WHERE provider_id = (SELECT id FROM providers WHERE user_id = $1);
```

### Analyst Dashboard Access
```javascript
// Analyst can see all claims for analysis
SELECT * FROM claims ORDER BY risk_score DESC;
```

### Investigator Dashboard Access
```javascript
// Investigator can see flagged claims and investigations
SELECT * FROM claims WHERE status = 'flagged' OR status = 'under_review';
```

## 🚨 Troubleshooting

### Common Issues

**"User already exists"**
- Username or email is already in use
- Try a different username or email

**"Invalid role"**
- Check spelling of role
- Available roles: admin, analyst, provider, patient, investigator, regulator

**"Database connection failed"**
- Check PostgreSQL is running
- Verify .env file settings
- Check database name and credentials

### Reset Admin Access
If you lose admin access:
```bash
# Create new admin user
node create-user.js create newadmin newpass123 admin@kmed.com admin New Admin

# Or reset existing admin password
node create-user.js reset-password admin newpassword123
```

## 📱 Testing Different Roles

### Test Provider Account
1. Login as provider user
2. Navigate to "Claim Submission"
3. Submit a test claim
4. Check "Claim Status" to see your claim

### Test Analyst Account
1. Login as analyst user
2. Navigate to "Claims Stream"
3. View all claims in system
4. Check "Feature Insights" for analytics

### Test Investigator Account
1. Login as investigator user
2. Navigate to "Fraud Alerts Queue"
3. View flagged claims
4. Open "Case Files" to investigate

## 🔄 Production Deployment

### Environment Variables
```bash
# .env file
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=kmed_system
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
```

### Security Checklist
- [ ] Change all default passwords
- [ ] Enable SSL on PostgreSQL
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable audit logging
- [ ] Set up monitoring

---

## 🎯 Quick Start Summary

1. **Setup Database:** `psql -U postgres -d kmed_system -f database-setup.sql`
2. **Seed Data:** `npm run seed`
3. **Create Admin:** `node create-user.js create interactive`
4. **Start Backend:** `npm start`
5. **Start Frontend:** `npm run frontend`
6. **Login:** Use your created admin account
7. **Create Users:** Add more users as needed

**🎉 Your KMED system is now ready with proper PostgreSQL user authentication!**
