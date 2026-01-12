// Google OAuth Login Integration for KMED Frontend
class GoogleOAuthLogin {
    constructor() {
        this.backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        this.init();
    }

    init() {
        this.addGoogleLoginButton();
        this.handleAuthCallback();
        this.handleAuthError();
    }

    addGoogleLoginButton() {
        // Find login form and add Google login button
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        // Create Google login button
        const googleButton = document.createElement('button');
        googleButton.type = 'button';
        googleButton.className = 'google-login-btn';
        googleButton.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1.74-.91 3.25-2.23 4.22l1.62 1.27c1.34-1.67 2.23-3.9 2.23-6.49C17 3.58 13.41 0 9 0 5.91 0 2.61 1.59 0 4.09l1.66 1.28C3.16 3.36 3.61 4.14 4.14 4.86H8.98V8z"/>
                <path fill="#34A853" d="M8.98 8v3h4.3c-.38 1.39-1.23 2.58-2.46 3.45l1.62 1.27c1.34-1.67 2.23-3.9 2.23-6.49H8.98z"/>
                <path fill="#FBBC05" d="M4.14 4.86L2.48 3.58C1.59 4.86 1 6.5 1 8.36c0 1.86.59 3.5 1.48 4.78l1.66-1.28C3.61 4.14 3.16 3.36 4.14 4.86z"/>
                <path fill="#EA4335" d="M8.98 17c2.16 0 4.02-.73 5.52-1.94l-1.62-1.27c-.74.52-1.59.83-2.5.83-1.91 0-3.52-.63-4.88-1.69l-1.66 1.28c1.34 1.67 3.42 2.74 5.66 2.74z"/>
            </svg>
            Continue with Google
        `;
        googleButton.onclick = () => this.initiateGoogleLogin();

        // Add button to login form
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'google-login-container';
        buttonContainer.innerHTML = '<div class="divider">OR</div>';
        buttonContainer.appendChild(googleButton);

        loginForm.appendChild(buttonContainer);

        // Add styles
        this.addGoogleButtonStyles();
    }

    addGoogleButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .google-login-container {
                margin-top: 1.5rem;
                text-align: center;
            }

            .divider {
                position: relative;
                text-align: center;
                margin: 1rem 0;
                color: #666;
                font-size: 0.9rem;
            }

            .divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #ddd;
            }

            .google-login-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                width: 100%;
                max-width: 300px;
                padding: 0.75rem 1rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                color: #3c4043;
                font-size: 0.9rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .google-login-btn:hover {
                background: #f8f9fa;
                border-color: #bbb;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            .google-login-btn:active {
                transform: translateY(1px);
            }

            .google-login-btn svg {
                width: 18px;
                height: 18px;
            }
        `;
        document.head.appendChild(style);
    }

    async initiateGoogleLogin() {
        try {
            console.log('Initiating Google OAuth login...');
            
            // Get Google auth URL from backend
            const response = await fetch(`${this.backendUrl}/auth/google`);
            const data = await response.json();
            
            if (data.authUrl) {
                // Redirect to Google OAuth
                window.location.href = data.authUrl;
            } else {
                throw new Error('Failed to get Google auth URL');
            }
        } catch (error) {
            console.error('Google login error:', error);
            this.showError('Failed to initiate Google login. Please try again.');
        }
    }

    handleAuthCallback() {
        // Check if we're returning from Google OAuth
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            console.log('Google OAuth successful, received token');
            
            // Save token and user info
            localStorage.setItem('kmed_token', token);
            
            // Parse token to get user info
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const user = {
                    id: payload.id,
                    username: payload.username,
                    email: payload.email,
                    role: payload.role,
                    name: payload.name || payload.username,
                    auth_method: payload.auth_method
                };
                
                localStorage.setItem('kmed_user', JSON.stringify(user));
                
                // Show success message
                this.showSuccess('Successfully logged in with Google!');
                
                // Redirect to dashboard after delay
                setTimeout(() => {
                    window.location.href = this.frontendUrl;
                }, 1500);
                
            } catch (error) {
                console.error('Error parsing token:', error);
                this.showError('Login successful but failed to save user data.');
            }
        }
    }

    handleAuthError() {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('message');
        
        if (error) {
            console.error('Google OAuth error:', error);
            this.showError(`Authentication failed: ${error}`);
            
            // Clean URL
            window.history.replaceState({}, document.title, this.frontendUrl);
        }
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existing = document.querySelector('.auth-message');
        if (existing) existing.remove();

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `auth-message ${type}`;
        messageEl.textContent = message;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .auth-message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 4px;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 300px;
            }

            .auth-message.success {
                background: #10b981;
                color: white;
                border: 1px solid #059669;
            }

            .auth-message.error {
                background: #ef4444;
                color: white;
                border: 1px solid #dc2626;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(messageEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    // Method to check if user is logged in via Google
    static isLoggedIn() {
        const user = localStorage.getItem('kmed_user');
        if (!user) return false;
        
        try {
            const userData = JSON.parse(user);
            return userData.auth_method === 'google';
        } catch {
            return false;
        }
    }

    // Method to get current Google user
    static getCurrentUser() {
        const user = localStorage.getItem('kmed_user');
        if (!user) return null;
        
        try {
            const userData = JSON.parse(user);
            return userData.auth_method === 'google' ? userData : null;
        } catch {
            return null;
        }
    }

    // Method to logout Google user
    static logout() {
        localStorage.removeItem('kmed_token');
        localStorage.removeItem('kmed_user');
        window.location.href = window.location.origin;
    }
}

// Initialize Google OAuth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GoogleOAuthLogin();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleOAuthLogin;
} else {
    window.GoogleOAuthLogin = GoogleOAuthLogin;
}
