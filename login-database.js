// Database-integrated login system
// Replaces the mock login with real database authentication

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
            
            // Store token for future API calls
            localStorage.setItem('kmed_user', JSON.stringify(currentUser));
            localStorage.setItem('kmed_token', data.access_token);
            
            loginBtn.textContent = 'Success!';
            loginBtn.style.background = 'green';
            
            setTimeout(function() {
                showDashboard();
            }, 500);
        } else {
            const errorData = await response.json();
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
            loginBtn.style.background = '';
            alert(`Login failed: ${errorData.error || 'Invalid credentials'}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
        loginBtn.style.background = '';
        alert('Unable to connect to server. Please ensure the backend is running on localhost:8000');
    }
}

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

// API helper function for authenticated requests
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('kmed_token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(`http://localhost:8000/api${endpoint}`, mergedOptions);
        
        if (response.status === 401) {
            // Token expired, redirect to login
            localStorage.removeItem('kmed_user');
            localStorage.removeItem('kmed_token');
            window.location.reload();
            return null;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Enhanced dashboard functions with database integration
async function loadClaimsFromDatabase() {
    try {
        const claims = await apiRequest('/claims');
        return claims || [];
    } catch (error) {
        console.error('Error loading claims:', error);
        return [];
    }
}

async function loadClaimDetailsFromDatabase(claimId) {
    try {
        const claim = await apiRequest(`/claims/${claimId}`);
        return claim;
    } catch (error) {
        console.error('Error loading claim details:', error);
        return null;
    }
}

async function loadInvestigationsFromDatabase() {
    try {
        const investigations = await apiRequest('/investigations');
        return investigations || [];
    } catch (error) {
        console.error('Error loading investigations:', error);
        return [];
    }
}

async function loadDashboardMetricsFromDatabase() {
    try {
        const metrics = await apiRequest('/dashboard/metrics');
        return metrics || {};
    } catch (error) {
        console.error('Error loading metrics:', error);
        return {};
    }
}

// Update existing view functions to use database
window.viewClaim = async function(claimId) {
    console.log('Viewing claim from database:', claimId);
    
    // Try to get from database first
    const claim = await loadClaimDetailsFromDatabase(claimId);
    
    if (claim) {
        const content = `
            <div class="detail-section">
                <h4>Patient Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Patient Name</div>
                        <div class="detail-value">${claim.patient_first_name} ${claim.patient_last_name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Claim ID</div>
                        <div class="detail-value">${claim.claim_id}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date of Service</div>
                        <div class="detail-value">${claim.service_date}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Insurance Provider</div>
                        <div class="detail-value">${claim.insurance_company}</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Claim Details</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Amount</div>
                        <div class="detail-value">$${claim.amount.toFixed(2)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status</div>
                        <div class="detail-value"><span class="detail-status ${claim.status}">${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}</span></div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Risk Score</div>
                        <div class="detail-value">${claim.risk_score}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Provider</div>
                        <div class="detail-value">${claim.provider_first_name} ${claim.provider_last_name}</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Medical Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Diagnosis Code</div>
                        <div class="detail-value">${claim.diagnosis_code}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Procedure Code</div>
                        <div class="detail-value">${claim.procedure_code}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Submitted Date</div>
                        <div class="detail-value">${claim.submitted_date}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Priority</div>
                        <div class="detail-value"><span class="detail-status ${claim.priority}">${claim.priority.charAt(0).toUpperCase() + claim.priority.slice(1)}</span></div>
                    </div>
                </div>
            </div>
            
            ${claim.notes ? `
            <div class="detail-section">
                <h4>Notes</h4>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <div class="detail-value">${claim.notes}</div>
                </div>
            </div>
            ` : ''}
            
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="downloadClaim('${claimId}')">📥 Download Documents</button>
                <button class="btn btn-secondary" onclick="printClaim('${claimId}')">🖨️ Print</button>
                ${claim.status === 'pending' ? `<button class="btn btn-secondary" onclick="editClaim('${claimId}')">✏️ Edit Claim</button>` : ''}
                ${claim.status === 'denied' ? `<button class="btn btn-primary" onclick="resubmitClaim('${claimId}')">🔄 Resubmit</button>` : ''}
                ${claim.status === 'flagged' ? `<button class="btn btn-primary" onclick="resolveFlag('${claimId}')">✅ Resolve Flag</button>` : ''}
            </div>
        `;
        
        showModal(`Claim Details - ${claimId}`, content);
    } else {
        // Fallback to mock data if database fails
        alert('Unable to load claim details from database. Please check your connection.');
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Override any existing handleLogin function to prevent conflicts
    window.handleLogin = handleLogin;
});

// Export functions for use in other files
window.apiRequest = apiRequest;
window.loadClaimsFromDatabase = loadClaimsFromDatabase;
window.loadInvestigationsFromDatabase = loadInvestigationsFromDatabase;
window.loadDashboardMetricsFromDatabase = loadDashboardMetricsFromDatabase;
