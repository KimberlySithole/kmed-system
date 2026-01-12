# Google OAuth Integration Guide for KMED System

## 🔐 Complete Google OAuth Setup

This guide will help you set up Google OAuth authentication so users can login with their actual Google accounts.

## 📋 Prerequisites

- Google Cloud Console account
- KMED system with PostgreSQL database
- Node.js and npm installed

---

## 🚀 Step-by-Step Setup

### Step 1: Update Database Schema

First, add Google OAuth fields to your database:

```bash
npm run setup-google-db
```

This will:
- Add Google OAuth columns to users table
- Create user_google_mappings table
- Update database structure for OAuth integration

### Step 2: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com/

2. **Create New Project:**
   - Click project dropdown → "NEW PROJECT"
   - Enter project name: "KMED Healthcare System"
   - Click "CREATE"

3. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Search and enable "Google+ API" (or "People API")
   - Search and enable "OAuth2 API"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Application name: "KMED Healthcare System"
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
   - Click "CREATE"

5. **Copy Credentials:**
   - Copy **Client ID**
   - Copy **Client Secret**

### Step 3: Configure KMED System

Run the interactive setup:

```bash
npm run setup-google
```

Enter your Google credentials when prompted:
```
Google Client ID: 123456789-abcdef.apps.googleusercontent.com
Google Client Secret: GOCSPX-abcdef123456
Redirect URI (default: http://localhost:3000/auth/google/callback): [Press Enter]
```

### Step 4: Install Dependencies

```bash
npm install
```

This will install:
- googleapis (Google OAuth library)
- passport & passport-google-oauth20 (Authentication middleware)
- express-session (Session management)

### Step 5: Update Backend Server

Add Google OAuth routes to your backend:

```javascript
// In backend-server.js, add:
const authGoogleRoutes = require('./auth-google');
app.use('/auth', authGoogleRoutes);
```

### Step 6: Add Google Login to Frontend

Add this script to your HTML:

```html
<script src="login-google.js"></script>
```

The Google login button will automatically appear on your login page.

---

## 🎯 How It Works

### Authentication Flow:

1. **User clicks "Continue with Google"**
2. **Redirects to Google OAuth**
3. **User authenticates with Google**
4. **Google redirects back to your app**
5. **Backend exchanges code for tokens**
6. **Backend gets user info from Google**
7. **Backend creates/updates user in database**
8. **Backend generates JWT token**
9. **Frontend receives token and logs in user**

### User Account Handling:

#### **New Google Users:**
- Creates new user account automatically
- Role determined by email domain:
  - `admin@kmed.com` → admin role
  - `analyst@kmed.com` → analyst role
  - `provider@kmed.com` → provider role
  - `investigator@kmed.com` → investigator role
  - `regulator@kmed.com` → regulator role
  - Other emails → patient role

#### **Existing Users:**
- Links Google account to existing local account
- Users can login with either method
- Maintains existing role and permissions

---

## 🧪 Testing Google OAuth

### Step 1: Start Backend

```bash
npm start
```

### Step 2: Start Frontend

```bash
npm run frontend
```

### Step 3: Test Login

1. Open `http://localhost:3000`
2. Click "Continue with Google"
3. Login with your Google account
4. Approve permissions
5. Should redirect to dashboard

---

## 🔧 Configuration Options

### Environment Variables:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
SESSION_SECRET=your-session-secret

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

### Custom Redirect URI:

For production, update:
```bash
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

And add this URL to Google Cloud Console:
- Go to Credentials → OAuth 2.0 Client IDs
- Add your production URL to authorized redirect URIs

---

## 🛠️ Advanced Features

### Link Existing Accounts:

Users with local accounts can link Google accounts:
- Login with local credentials
- Go to profile settings
- Click "Link Google Account"
- Authenticate with Google
- Accounts are now linked

### Unlink Google Accounts:

Users can unlink Google accounts:
```javascript
// API endpoint
POST /auth/unlink-google
```

### Role Detection:

Automatic role assignment based on email:
```javascript
// Email → Role mapping
admin@kmed.com → admin
analyst@kmed.com → analyst
provider@kmed.com → provider
investigator@kmed.com → investigator
regulator@kmed.com → regulator
other@gmail.com → patient
```

---

## 🚨 Troubleshooting

### Common Issues:

#### **"redirect_uri_mismatch" Error:**
- Check redirect URI in Google Cloud Console
- Must exactly match: `http://localhost:3000/auth/google/callback`
- No trailing slashes

#### **"invalid_client" Error:**
- Check Client ID and Client Secret
- Make sure .env file is updated
- Restart backend server

#### **"access_denied" Error:**
- User denied permission
- User needs to try again and approve

#### **Backend not receiving callback:**
- Check backend is running on port 8000
- Check firewall settings
- Verify CORS configuration

### Debug Mode:

Enable debug logging:
```bash
DEBUG=* npm start
```

---

## 🔒 Security Considerations

### ✅ Security Features:
- **State parameter** prevents CSRF attacks
- **PKCE** for public clients
- **HTTPS** required in production
- **Token validation** and expiration
- **Session management** with secure cookies

### 🛡️ Best Practices:
- Use HTTPS in production
- Validate redirect URIs
- Implement token refresh
- Log authentication events
- Monitor for suspicious activity

---

## 🌐 Production Deployment

### Domain Setup:

1. **Update redirect URI:**
   ```
   https://yourdomain.com/auth/google/callback
   ```

2. **Update environment:**
   ```bash
   FRONTEND_URL=https://yourdomain.com
   BACKEND_URL=https://api.yourdomain.com
   GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
   ```

3. **Google Cloud Console:**
   - Add production domain to authorized domains
   - Add production redirect URI
   - Enable production APIs

### SSL Certificate:

Google OAuth requires HTTPS in production:
```bash
# Use Let's Encrypt or similar
# Configure nginx/Apache with SSL
# Update all URLs to https://
```

---

## 📊 User Management

### View Google Users:

```sql
-- View all Google-linked users
SELECT u.*, g.google_id, g.google_email 
FROM users u 
JOIN user_google_mappings g ON u.id = g.user_id;
```

### View Authentication Methods:

```sql
-- View login methods
SELECT auth_method, COUNT(*) as user_count 
FROM users 
GROUP BY auth_method;
```

---

## 🎉 Benefits of Google OAuth

### ✅ User Experience:
- **One-click login** with Google account
- **No password management** for users
- **Professional authentication** flow
- **Mobile-friendly** login process

### ✅ Security:
- **Google's security** infrastructure
- **Two-factor authentication** support
- **Account recovery** handled by Google
- **Reduced password** exposure

### ✅ Development:
- **Less authentication code** to maintain
- **Standard OAuth** implementation
- **Scalable** user management
- **Professional** login experience

---

## 🎯 Quick Start Summary:

1. **Database:** `npm run setup-google-db`
2. **Google Cloud:** Create OAuth credentials
3. **Configure:** `npm run setup-google`
4. **Install:** `npm install`
5. **Start:** `npm start` + `npm run frontend`
6. **Test:** Login with Google account

---

**🎉 Your KMED system now supports Google OAuth authentication! Users can login with their actual Google accounts!** 🔐✨
