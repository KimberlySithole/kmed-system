// Integrated Login System - Uses existing dashboard functions
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Authenticating...';
    loginBtn.disabled = true;
    
    tryBackendLogin(username, password, loginBtn, originalText);
}

async function tryBackendLogin(username, password, loginBtn, originalText) {
    try {
        const response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('kmed_user', JSON.stringify(currentUser));
            localStorage.setItem('kmed_token', data.access_token);
            
            loginBtn.textContent = 'Success!';
            loginBtn.style.background = 'green';
            
            setTimeout(function() {
                showDashboard();
            }, 500);
        } else {
            tryMockLogin(username, password, loginBtn, originalText);
        }
    } catch (error) {
        tryMockLogin(username, password, loginBtn, originalText);
    }
}

function tryMockLogin(username, password, loginBtn, originalText) {
    setTimeout(function() {
        const validUsers = {
            'analyst': { role: 'analyst', name: 'John Analyst' },
            'admin': { role: 'admin', name: 'Mike Admin' },
            'provider': { role: 'provider', name: 'Dr. Smith' },
            'patient': { role: 'patient', name: 'Jane Patient' },
            'investigator': { role: 'investigator', name: 'Sarah Investigator' },
            'regulator': { role: 'regulator', name: 'Robert Regulator' }
        };
        
        if (validUsers[username] && password === 'password') {
            currentUser = {
                id: 'USR001',
                username: username,
                role: validUsers[username].role,
                name: validUsers[username].name,
                email: username + '@kmed.com'
            };
            
            localStorage.setItem('kmed_user', JSON.stringify(currentUser));
            
            loginBtn.textContent = 'Success!';
            loginBtn.style.background = 'green';
            
            setTimeout(function() {
                showDashboard();
            }, 500);
        } else {
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
            loginBtn.style.background = '';
            alert('Invalid login. Try: analyst / password');
        }
    }, 1000);
}

// Use existing showDashboard function from script.js
// This will automatically use all the existing dashboard content functions

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Override any existing handleLogin function to prevent conflicts
    window.handleLogin = handleLogin;
});
