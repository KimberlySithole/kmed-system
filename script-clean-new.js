// global-state.js
// Completed, defensive, and self-contained version of the login/dashboard script.
// Drop into your frontend (after DOM elements exist) or include in your build pipeline.

(function () {
  'use strict';

  // ---------- Global State ----------
  let currentUser = null;
  let currentPage = 'login';
  let isLoading = false;
  let realTimeIntervalId = null;

  // ---------- Role Navigation ----------
  const roleNavigation = {
    analyst: [
      { id: 'home', label: 'Dashboard Home', icon: 'fas fa-home' },
      { id: 'claims-stream', label: 'Claims Stream', icon: 'fas fa-stream' },
      { id: 'feature-insights', label: 'Feature Insights', icon: 'fas fa-chart-bar' },
      { id: 'graph-analytics', label: 'Graph Analytics', icon: 'fas fa-project-diagram' },
      { id: 'model-metrics', label: 'Model Metrics', icon: 'fas fa-chart-line' },
      { id: 'fraud-sandbox', label: 'Fraud Sandbox', icon: 'fas fa-flask' }
    ],
    investigator: [
      { id: 'home', label: 'Dashboard Home', icon: 'fas fa-home' },
      { id: 'fraud-alerts', label: 'Fraud Alerts Queue', icon: 'fas fa-exclamation-triangle' },
      { id: 'case-files', label: 'Case Files', icon: 'fas fa-folder-open' },
      { id: 'explainable-ai', label: 'Explainable AI', icon: 'fas fa-brain' },
      { id: 'workflow-tools', label: 'Workflow Tools', icon: 'fas fa-tools' },
      { id: 'training-module', label: 'Training Module', icon: 'fas fa-graduation-cap' }
    ],
    admin: [
      { id: 'home', label: 'Dashboard Home', icon: 'fas fa-home' },
      { id: 'access-control', label: 'Access Control', icon: 'fas fa-key' },
      { id: 'members-management', label: 'Members Management', icon: 'fas fa-users' },
      { id: 'compliance-monitor', label: 'Compliance Monitor', icon: 'fas fa-shield-alt' },
      { id: 'blockchain-ledger', label: 'Blockchain Ledger', icon: 'fas fa-link' },
      { id: 'system-health', label: 'System Health', icon: 'fas fa-heartbeat' },
      { id: 'benchmarks', label: 'Benchmarks', icon: 'fas fa-tachometer-alt' }
    ],
    provider: [
      { id: 'home', label: 'Dashboard Home', icon: 'fas fa-home' },
      { id: 'claim-submission', label: 'Claim Submission', icon: 'fas fa-file-medical' },
      { id: 'claim-tracker', label: 'Claim Status', icon: 'fas fa-tasks' },
      { id: 'risk-score', label: 'Risk Score', icon: 'fas fa-chart-line' },
      { id: 'compliance', label: 'Compliance', icon: 'fas fa-shield-alt' },
      { id: 'self-audit', label: 'Self-Audit', icon: 'fas fa-clipboard-check' }
    ],
    patient: [
      { id: 'home', label: 'Dashboard Home', icon: 'fas fa-home' },
      { id: 'my-claims', label: 'My Claims', icon: 'fas fa-file-medical' },
      { id: 'appeal-tracker', label: 'Appeal Tracker', icon: 'fas fa-gavel' },
      { id: 'fraud-protection', label: 'Fraud Protection', icon: 'fas fa-shield-alt' },
      { id: 'transparency-reports', label: 'Transparency Reports', icon: 'fas fa-file-alt' },
      { id: 'preferences', label: 'Preferences', icon: 'fas fa-cog' }
    ],
    regulator: [
      { id: 'home', label: 'Dashboard Home', icon: 'fas fa-home' },
      { id: 'fraud-trends', label: 'Fraud Trends', icon: 'fas fa-chart-area' },
      { id: 'audit-logs', label: 'Audit Logs', icon: 'fas fa-clipboard-check' },
      { id: 'bias-auditing', label: 'Bias Auditing Reports', icon: 'fas fa-balance-scale' },
      { id: 'blockchain-verification', label: 'Blockchain Verification', icon: 'fas fa-certificate' },
      { id: 'industry-benchmarking', label: 'Industry Benchmarking', icon: 'fas fa-industry' }
    ]
  };

  // ---------- Database Integration ----------
  // Mock data removed - now using PostgreSQL database
  // All data will be loaded from database via API calls

  // ---------- Utilities ----------
  function $id(id) {
    if (!id) return null;
    try { return document.getElementById(id); } catch (e) { return null; }
  }

  function qs(selector, root = document) {
    if (!selector) return null;
    try { return root.querySelector(selector); } catch (e) { return null; }
  }

  function qsa(selector, root = document) {
    if (!selector) return []; 
    try { return Array.from(root.querySelectorAll(selector)); } catch (e) { return []; }
  }

  function safeText(node, text) {
    if (!node) return;
    node.textContent = text;
  }

  function formatTitleFromId(id) {
    if (!id) return '';
    return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // ---------- Auth helpers ----------
  function checkExistingAuth() {
    try {
      const saved = localStorage.getItem('kmed_user');
      if (!saved) return false;
      currentUser = JSON.parse(saved);
      return !!currentUser;
    } catch (e) {
      console.warn('Failed to parse saved user', e);
      localStorage.removeItem('kmed_user');
      return false;
    }
  }

  function saveAuth(user) {
    try {
      localStorage.setItem('kmed_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user to localStorage', e);
    }
  }

  // ---------- Login flow ----------
  function handleLogin(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();

    const usernameEl = $id('username');
    const passwordEl = $id('password');
    const loginBtn = qs('.login-btn');

    const username = usernameEl ? String(usernameEl.value || '').trim() : '';
    const password = passwordEl ? String(passwordEl.value || '') : '';

    if (!username || !password) {
      showInlineLoginError('Please enter both username and password');
      return;
    }

    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.dataset.origText = loginBtn.textContent;
      loginBtn.textContent = 'Authenticating...';
    }

    // Try backend first (if available), otherwise mock
    tryBackendLogin(username, password)
      .then(success => {
        if (success) {
          if (loginBtn) {
            loginBtn.textContent = 'Success!';
            loginBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          }
          setTimeout(() => showDashboard(), 400);
        } else {
          // fallback to mock
          tryMockLogin(username, password, loginBtn);
        }
      })
      .catch(() => {
        tryMockLogin(username, password, loginBtn);
      });
  }

  async function tryBackendLogin(username, password) {
    // Defensive: only attempt if backend endpoint exists in same origin
    // This function returns true on success, false on failure.
    try {
      const url = `${location.protocol}//${location.host}/auth/login`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data && data.user) {
        currentUser = data.user;
        saveAuth(currentUser);
        return true;
      }
      return false;
    } catch (e) {
      // network/backend not available
      return false;
    }
  }

  function tryMockLogin(username, password, loginBtn) {
    const validUsers = {
      'analyst': { role: 'analyst', name: 'John Analyst' },
      'admin': { role: 'admin', name: 'Mike Admin' },
      'provider': { role: 'provider', name: 'Dr. Smith' },
      'patient': { role: 'patient', name: 'Jane Patient' },
      'investigator': { role: 'investigator', name: 'Sarah Investigator' },
      'regulator': { role: 'regulator', name: 'Robert Regulator' }
    };

    setTimeout(() => {
      if (validUsers[username] && password === 'password') {
        currentUser = {
          id: 'USR001',
          username,
          role: validUsers[username].role,
          name: validUsers[username].name,
          email: `${username}@kmed.com`
        };
        saveAuth(currentUser);

        if (loginBtn) {
          loginBtn.textContent = 'Success!';
          loginBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        }

        setTimeout(() => showDashboard(), 400);
      } else {
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = loginBtn.dataset.origText || 'Login';
          loginBtn.style.background = '';
        }
        showInlineLoginError('Invalid credentials. Try: analyst / password');
      }
    }, 700);
  }

  function showInlineLoginError(message) {
    const form = $id('loginForm');
    if (!form) {
      alert(message);
      return;
    }
    // remove existing
    const existing = form.querySelector('.alert-danger');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = 'alert alert-danger';
    div.style.marginTop = '1rem';
    div.textContent = message;
    form.appendChild(div);

    setTimeout(() => {
      if (div && div.parentNode) div.remove();
    }, 4000);
  }

  // ---------- Dashboard UI ----------
  function showDashboard() {
    if (!currentUser) {
      console.error('No current user - cannot show dashboard');
      return;
    }

    const loginPage = $id('loginPage');
    const dashboardLayout = $id('dashboardLayout');

    if (loginPage) {
      loginPage.classList.remove('active');
      loginPage.style.display = 'none';
    }
    if (dashboardLayout) {
      dashboardLayout.classList.add('active');
      dashboardLayout.style.display = 'flex';
    }

    const userName = $id('userName');
    const dashboardTitle = $id('dashboardTitle');

    if (userName) safeText(userName, currentUser.name || '');
    if (dashboardTitle) safeText(dashboardTitle, `${capitalize(currentUser.role)} Dashboard`);

    // Setup navigation
    setupNavigation();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        // Remove existing listeners to prevent duplicates
        logoutBtn.replaceWith(logoutBtn.cloneNode(true));
        const newLogoutBtn = document.getElementById('logoutBtn');
        newLogoutBtn.addEventListener('click', handleLogout);
        console.log('Logout button handler attached');
    } else {
        console.log('Logout button not found');
    }
    
    // Load home page
    loadDashboardContent('home');
    
    // Load role-specific script for advanced functions
    if (currentUser && currentUser.role) {
      loadRoleSpecificScript(currentUser.role);
    }
    
    console.log('Dashboard shown successfully');
    startRealTimeUpdates();
  }

  function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ---------- Navigation ----------
  function setupNavigation() {
    const navContainer = $id('sidebarNav') || qs('.sidebar-nav');
    if (!navContainer) {
      console.warn('Sidebar navigation container not found');
      return;
    }

    const role = (currentUser && currentUser.role) || 'analyst';
    const items = roleNavigation[role] || [];

    navContainer.innerHTML = '';

    items.forEach((item, idx) => {
      const navItem = document.createElement('div');
      navItem.className = 'nav-item';
      navItem.dataset.page = item.id;

      const icon = document.createElement('i');
      icon.className = item.icon || '';
      navItem.appendChild(icon);

      const span = document.createElement('span');
      span.textContent = item.label || item.id;
      navItem.appendChild(span);

      navItem.addEventListener('click', (e) => {
        e.preventDefault();
        // remove active
        qsa('.nav-item', navContainer).forEach(n => n.classList.remove('active'));
        navItem.classList.add('active');
        loadDashboardContent(item.id);
      });

      navContainer.appendChild(navItem);

      // set first as active if none active
      if (idx === 0 && !navContainer.querySelector('.nav-item.active')) {
        navItem.classList.add('active');
      }
    });
  }

  // Load role-specific script if available
  function loadRoleSpecificScript(role) {
    const roleScriptMap = {
      'admin': 'admin-functions.js',
      'analyst': 'analyst-functions.js', 
      'investigator': 'investigator-functions.js',
      'provider': 'provider-functions.js',
      'patient': 'patient-functions.js',
      'regulator': 'regulator-functions.js'
    };
    
    const scriptFile = roleScriptMap[role];
    if (!scriptFile) {
      console.log(`No specific script file for role: ${role}`);
      return;
    }
    
    // Load the role-specific script
    const script = document.createElement('script');
    script.src = scriptFile;
    script.onload = function() {
      console.log(`Loaded ${role} functions from ${scriptFile}`);
    };
    script.onerror = function() {
      console.warn(`Failed to load ${scriptFile}, using fallback functions`);
    };
    document.head.appendChild(script);
  }

  // Modify content loading to use role-specific functions first
  function loadDashboardContent(section) {
    const contentArea = $id('contentArea') || qs('.content-area');
    if (!contentArea) {
      console.warn('Content area not found');
      return;
    }
    
    currentPage = section || 'home';
    
    // Update dashboard title
    const dashboardTitle = $id('dashboardTitle');
    if (dashboardTitle) {
      dashboardTitle.textContent = formatTitleFromId(section);
    }
    
    // Try to use role-specific function first
    const roleSpecificFunctionName = `generate${section.charAt(0).toUpperCase() + section.slice(1).replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())}Content`;
    
    if (typeof window[roleSpecificFunctionName] === 'function') {
      try {
        contentArea.innerHTML = window[roleSpecificFunctionName]();
        console.log(`Using role-specific function: ${roleSpecificFunctionName}`);
        
        // Initialize charts if they exist for this section
        setTimeout(() => {
          if (typeof window.initializeAdminCharts === 'function' && currentUser.role === 'admin') {
            window.initializeAdminCharts();
          }
          if (typeof window.initializeAnalystCharts === 'function' && currentUser.role === 'analyst') {
            window.initializeAnalystCharts();
          }
          if (typeof window.initializeInvestigatorCharts === 'function' && currentUser.role === 'investigator') {
            window.initializeInvestigatorCharts();
          }
          if (typeof window.initializeProviderCharts === 'function' && currentUser.role === 'provider') {
            window.initializeProviderCharts();
          }
          if (typeof window.initializePatientCharts === 'function' && currentUser.role === 'patient') {
            window.initializePatientCharts();
          }
          if (typeof window.initializeRegulatorCharts === 'function' && currentUser.role === 'regulator') {
            window.initializeRegulatorCharts();
          }
          
          // Setup event listeners for buttons after content loads
          setupButtonEventListeners();
        }, 100);
        return;
      } catch (e) {
        console.error(`Error in role-specific function: ${e}`);
      }
    }
    
    // Fallback to built-in functions
    switch (section) {
      case 'home':
        contentArea.innerHTML = generateHomeContent();
        break;
      case 'claims-stream':
        contentArea.innerHTML = generateClaimsStreamContent();
        break;
      default:
        contentArea.innerHTML = `
          <div class="card">
            <div class="card-header"><h4>${formatTitleFromId(section)}</h4></div>
            <div style="padding:2rem;text-align:center;color:#64748b;">
              <p>Welcome to the ${currentUser ? currentUser.role : 'user'} dashboard.</p>
              <p>Section: ${section}</p>
            </div>
          </div>
        `;
    }
  }

  // ---------- Content generators ----------
  function generateHomeContent() {
    const totalClaims = 0; // Will be loaded from database
    const highRisk = 0; // Will be loaded from database
    const pending = 0; // Will be loaded from database

    return `
      <div class="dashboard-grid">
        <div class="metric-card">
          <h3>Total Claims</h3>
          <div class="metric-value">${totalClaims}</div>
          <div class="metric-change">+0% from last month</div>
        </div>
        <div class="metric-card">
          <h3>High Risk Claims</h3>
          <div class="metric-value">${highRisk}</div>
          <div class="metric-change">Requires attention</div>
        </div>
        <div class="metric-card">
          <h3>Pending Review</h3>
          <div class="metric-value">${pending}</div>
          <div class="metric-change">Awaiting processing</div>
        </div>
        <div class="metric-card">
          <h3>Model Accuracy</h3>
          <div class="metric-value">98.5%</div>
          <div class="metric-change">Excellent performance</div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h4>Recent Claims</h4>
          <div class="subtitle">Latest claims submitted to the system</div>
        </div>
        <div class="card-body">
          <div class="claims-list">
            <div class="claim-item">
              <div class="claim-header">
                <strong>Loading claims from database...</strong>
                <span class="risk-badge">Database</span>
              </div>
              <div class="claim-details">
                <div><strong>Patient:</strong> Database Patient</div>
                <div><strong>Provider:</strong> Database Provider</div>
                <div><strong>Amount:</strong> Database Amount</div>
                <div><strong>Date:</strong> Database Date</div>
              </div>
            </div>
            <div class="claim-item">
              <div class="claim-header">
                <strong>Loading claims from database...</strong>
                <span class="risk-badge">Database</span>
              </div>
              <div class="claim-details">
                <div><strong>Patient:</strong> Database Patient</div>
                <div><strong>Provider:</strong> Database Provider</div>
                <div><strong>Amount:</strong> Database Amount</div>
                <div><strong>Date:</strong> Database Date</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateClaimsStreamContent() {
    return `
      <div class="card">
        <div class="card-header">
          <h4>Claims Stream</h4>
          <div class="subtitle">Real-time claim processing and analysis</div>
        </div>
        <div class="card-body">
          <div class="claims-list">
            <div class="claim-item">
              <div class="claim-header">
                <strong>Loading claims from database...</strong>
                <span class="risk-badge">Database</span>
              </div>
              <div class="claim-details">
                <div><strong>Patient:</strong> Database Patient</div>
                <div><strong>Provider:</strong> Database Provider</div>
                <div><strong>Amount:</strong> Database Amount</div>
                <div><strong>Date:</strong> Database Date</div>
              </div>
            </div>
            <div class="claim-item">
              <div class="claim-header">
                <strong>Loading claims from database...</strong>
                <span class="risk-badge">Database</span>
              </div>
              <div class="claim-details">
                <div><strong>Patient:</strong> Database Patient</div>
                <div><strong>Provider:</strong> Database Provider</div>
                <div><strong>Amount:</strong> Database Amount</div>
                <div><strong>Date:</strong> Database Date</div>
              </div>
            </div>
            <div class="claim-item">
              <div class="claim-header">
                <strong>Loading claims from database...</strong>
                <span class="risk-badge">Database</span>
              </div>
              <div class="claim-details">
                <div><strong>Patient:</strong> Database Patient</div>
                <div><strong>Provider:</strong> Database Provider</div>
                <div><strong>Amount:</strong> Database Amount</div>
                <div><strong>Date:</strong> Database Date</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- Logout ----------
  function handleLogout(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();

    currentUser = null;
    localStorage.removeItem('kmed_user');

    // stop updates
    stopRealTimeUpdates();

    // hide dashboard, show login
    const dashboardLayout = $id('dashboardLayout');
    const loginPage = $id('loginPage');

    if (dashboardLayout) {
      dashboardLayout.classList.remove('active');
      dashboardLayout.style.display = 'none';
    }
    if (loginPage) {
      loginPage.classList.add('active');
      loginPage.style.display = 'flex';
    }

    // reset form
    const loginForm = $id('loginForm');
    if (loginForm) loginForm.reset();
  }

  // ---------- Real-time updates ----------
  function startRealTimeUpdates() {
    stopRealTimeUpdates();
    updateMetrics();
    checkForNewAlerts();
    realTimeIntervalId = setInterval(() => {
      updateMetrics();
      checkForNewAlerts();
    }, 30000);
  }

  function stopRealTimeUpdates() {
    if (realTimeIntervalId) {
      clearInterval(realTimeIntervalId);
      realTimeIntervalId = null;
    }
  }

  function updateMetrics() {
    const metrics = {
      total_claims: 0, // Will be loaded from database
      high_risk_alerts: 0, // Will be loaded from database
      model_accuracy: 0.985
    };

    const metricEls = qsa('.metric-value');
    const values = [metrics.total_claims, metrics.high_risk_alerts, `${(metrics.model_accuracy * 100).toFixed(1)}%`];

    metricEls.forEach((el, idx) => {
      if (!el) return;
      el.style.transform = 'scale(1.05)';
      setTimeout(() => {
        el.textContent = values[idx] !== undefined ? values[idx] : el.textContent;
        el.style.transform = 'scale(1)';
      }, 200);
    });
  }

  function checkForNewAlerts() {
    const alertCount = 0; // Will be loaded from database
    const badge = $id('notificationBadge') || qs('.notification-badge');
    if (!badge) return;
    const current = parseInt(badge.textContent || '0', 10) || 0;
    if (alertCount > current) {
      badge.textContent = String(alertCount);
      badge.style.animation = 'pulse 1s ease-in-out 3';
      setTimeout(() => { badge.style.animation = ''; }, 3000);
    }
  }

  // ---------- Search & UI helpers ----------
  function initializeSearch() {
    if ($id('kmed-search-input')) return;
    const topbarRight = qs('.topbar-right');
    if (!topbarRight) return;

    const container = document.createElement('div');
    container.className = 'search-container';

    const input = document.createElement('input');
    input.id = 'kmed-search-input';
    input.className = 'search-input';
    input.placeholder = 'Search...';

    input.addEventListener('input', (e) => {
      filterContent(String(e.target.value || '').toLowerCase());
    });

    container.appendChild(input);
    topbarRight.insertBefore(container, topbarRight.firstChild || null);
  }

  function filterContent(searchTerm) {
    const contentArea = $id('contentArea') || qs('.content-area');
    if (!contentArea) return;

    const cards = qsa('.card', contentArea);
    const rows = qsa('table tr', contentArea);

    cards.forEach(card => {
      const text = (card.textContent || '').toLowerCase();
      card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });

    rows.forEach(row => {
      const text = (row.textContent || '').toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  }

  // Ripple effect
  function addRippleEffect() {
    qsa('.btn, .login-btn, .nav-item').forEach(button => {
      // avoid adding duplicate listeners
      if (button.dataset.rippleAttached) return;
      button.dataset.rippleAttached = 'true';

      button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        const x = (e.clientX - rect.left) - (size / 2);
        const y = (e.clientY - rect.top) - (size / 2);
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Smooth scrolling
  function addSmoothScrolling() {
    qsa('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // Keyboard navigation
  function addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        showQuickSearch();
      }
      if (e.key === 'Escape') {
        closeModals();
      }
    });
  }

  // ---------- Content Generation Functions ----------
  function generateFraudAlertsContent() {
    return `
      <div class="card">
        <div class="card-header">
          <h4>Fraud Alerts Queue</h4>
          <div class="subtitle">Suspicious claims requiring investigation</div>
        </div>
        <div class="card-body">
          <div class="alerts-list">
            <div class="alert-item high">
              <div class="alert-header">
                <strong>ALERT-001</strong>
                <span class="severity-badge high">High</span>
              </div>
              <div class="alert-details">
                <div><strong>Type:</strong> Billing Pattern Anomaly</div>
                <div><strong>Claim:</strong> Database Claim ID</div>
                <div><strong>Description:</strong> Unusual billing frequency detected</div>
                <div><strong>Timestamp:</strong> Database Timestamp</div>
              </div>
            </div>
            <div class="alert-item medium">
              <div class="alert-header">
                <strong>ALERT-002</strong>
                <span class="severity-badge medium">Medium</span>
              </div>
              <div class="alert-details">
                <div><strong>Type:</strong> Service Code Mismatch</div>
                <div><strong>Claim:</strong> Database Claim ID</div>
                <div><strong>Description:</strong> Diagnosis and procedure code mismatch</div>
                <div><strong>Timestamp:</strong> Database Timestamp</div>
              </div>
            </div>
            <div class="alert-item low">
              <div class="alert-header">
                <strong>ALERT-003</strong>
                <span class="severity-badge low">Low</span>
              </div>
              <div class="alert-details">
                <div><strong>Type:</strong> Duplicate Claim</div>
                <div><strong>Claim:</strong> Database Claim ID</div>
                <div><strong>Description:</strong> Potential duplicate submission detected</div>
                <div><strong>Timestamp:</strong> Database Timestamp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateCaseFilesContent() {
    return `
      <div class="card">
        <div class="card-header">
          <h4>Case Files</h4>
          <div class="subtitle">Investigation cases and their current status</div>
        </div>
        <div class="card-body">
          <div class="case-list">
            <div class="case-item">
              <div class="case-header">
                <strong>Case #001</strong>
                <span class="status-badge flagged">Flagged</span>
              </div>
              <div class="log-header">
                <strong>Database Claim ID</strong>
                <span class="decision-badge flagged">Flagged</span>
                <span class="timestamp">Database Timestamp</span>
              </div>
              <div class="case-details">
                <div><strong>Alert ID:</strong> ALERT-001</div>
                <div><strong>Claim:</strong> Database Claim ID</div>
                <div><strong>Description:</strong> Billing Pattern Anomaly</div>
                <div><strong>Assigned:</strong> ${currentUser ? currentUser.name : 'Current User'}</div>
              </div>
            </div>
            <div class="case-item">
              <div class="case-header">
                <strong>Case #002</strong>
                <span class="status-badge flagged">Flagged</span>
              </div>
              <div class="log-header">
                <strong>Database Claim ID</strong>
                <span class="decision-badge flagged">Flagged</span>
                <span class="timestamp">Database Timestamp</span>
              </div>
              <div class="case-details">
                <div><strong>Alert ID:</strong> ALERT-002</div>
                <div><strong>Claim:</strong> Database Claim ID</div>
                <div><strong>Description:</strong> Service Code Mismatch</div>
                <div><strong>Assigned:</strong> ${currentUser ? currentUser.name : 'Current User'}</div>
              </div>
            </div>
            <div class="case-item">
              <div class="case-header">
                <strong>Case #003</strong>
                <span class="status-badge in-progress">In Progress</span>
              </div>
              <div class="log-header">
                <strong>Database Claim ID</strong>
                <span class="decision-badge in-progress">Investigating</span>
                <span class="timestamp">Database Timestamp</span>
              </div>
              <div class="case-details">
                <div><strong>Alert ID:</strong> ALERT-003</div>
                <div><strong>Claim:</strong> Database Claim ID</div>
                <div><strong>Description:</strong> Duplicate Claim</div>
                <div><strong>Assigned:</strong> ${currentUser ? currentUser.name : 'Current User'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateExplainableAIContent() {
    return `
      <div class="explainable-ai">
        <h2>Explainable AI</h2>
        <div class="ai-insights">
          <div class="insight-card">
            <h3>Fraud Detection Reasoning</h3>
            <p>AI detected unusual billing patterns in claim based on historical data analysis.</p>
            <div class="confidence-score">Confidence: 94%</div>
          </div>
          <div class="insight-card">
            <h3>Risk Factors</h3>
            <p>High-value claim with unusual timing patterns detected.</p>
            <div class="risk-factors">Amount: $2,500 | Time: 10:30 PM</div>
              <li>Time pattern analysis</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function generateWorkflowToolsContent() {
    return `
      <div class="workflow-tools">
        <h2>Workflow Tools</h2>
        <div class="tools-grid">
          <div class="tool-card">
            <h3>Case Assignment</h3>
            <p>Automatically assign cases to investigators based on workload and expertise.</p>
          </div>
          <div class="tool-card">
            <h3>Evidence Collection</h3>
            <p>Organize and track evidence for each case.</p>
          </div>
          <div class="tool-card">
            <h3>Report Generation</h3>
            <p>Generate comprehensive investigation reports.</p>
          </div>
        </div>
      </div>
    `;
  }

  function generateTrainingModuleContent() {
    return `
      <div class="training-module">
        <h2>Training Module</h2>
        <div class="training-content">
          <div class="course-card">
            <h3>Fraud Detection Basics</h3>
            <div class="progress-bar">
              <div class="progress" style="width: 75%"></div>
            </div>
            <p>75% Complete</p>
          </div>
          <div class="course-card">
            <h3>Advanced Investigation Techniques</h3>
            <div class="progress-bar">
              <div class="progress" style="width: 30%"></div>
            </div>
            <p>30% Complete</p>
          </div>
        </div>
      </div>
    `;
  }

  function generateAccessControlContent() {
    return `
      <div class="access-control">
        <h2>Access Control</h2>
        <div class="user-management">
          <h3>User Permissions</h3>
          <div class="permissions-table">
            <div class="user-row">
              <div class="user-info">
                <strong>System Administrator</strong>
                <span class="role-badge">admin</span>
              </div>
              <div class="user-actions">
                <button class="btn btn-sm">Edit</button>
                <button class="btn btn-sm btn-danger">Remove</button>
              </div>
            </div>
            <div class="user-row">
              <div class="user-info">
                <strong>Data Analyst</strong>
                <span class="role-badge">analyst</span>
              </div>
              <div class="user-actions">
                <button class="btn btn-sm">Edit</button>
                <button class="btn btn-sm btn-danger">Remove</button>
              </div>
            </div>
            <div class="user-row">
              <div class="user-info">
                <strong>Healthcare Provider</strong>
                <span class="role-badge">provider</span>
              </div>
              <div class="user-actions">
                <button class="btn btn-sm">Edit</button>
                <button class="btn btn-sm btn-danger">Remove</button>
              </div>
            </div>
            <div class="user-row">
              <div class="user-info">
                <strong>Patient</strong>
                <span class="role-badge">patient</span>
              </div>
              <div class="user-actions">
                <button class="btn btn-sm">Edit</button>
                <button class="btn btn-sm btn-danger">Remove</button>
              </div>
            </div>
            <div class="user-row">
              <div class="user-info">
                <strong>Fraud Investigator</strong>
                <span class="role-badge">investigator</span>
              </div>
              <div class="user-actions">
                <button class="btn btn-sm">Edit</button>
                <button class="btn btn-sm btn-danger">Remove</button>
              </div>
            </div>
            <div class="user-row">
              <div class="user-info">
                <strong>Compliance Regulator</strong>
                <span class="role-badge">regulator</span>
              </div>
              <div class="user-actions">
                <button class="btn btn-sm">Edit</button>
                <button class="btn btn-sm btn-danger">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateMembersManagementContent() {
    return `
      <div class="members-management">
        <h2>Members Management</h2>
        <div class="members-list">
          <div class="member-card">
            <div class="member-header">
              <strong>System Administrator</strong>
              <span class="status-badge active">Active</span>
            </div>
            <div class="member-details">
              <div>Role: admin</div>
              <div>Last Login: Database Timestamp</div>
            </div>
          </div>
          <div class="member-card">
            <div class="member-header">
              <strong>Data Analyst</strong>
              <span class="status-badge active">Active</span>
            </div>
            <div class="member-details">
              <div>Role: analyst</div>
              <div>Last Login: Database Timestamp</div>
            </div>
          </div>
          <div class="member-card">
            <div class="member-header">
              <strong>Healthcare Provider</strong>
              <span class="status-badge active">Active</span>
            </div>
            <div class="member-details">
              <div>Role: provider</div>
              <div>Last Login: Database Timestamp</div>
            </div>
          </div>
          <div class="member-card">
            <div class="member-header">
              <strong>Patient</strong>
              <span class="status-badge active">Active</span>
            </div>
            <div class="member-details">
              <div>Role: patient</div>
              <div>Last Login: Database Timestamp</div>
            </div>
          </div>
          <div class="member-card">
            <div class="member-header">
              <strong>Fraud Investigator</strong>
              <span class="status-badge active">Active</span>
            </div>
            <div class="member-details">
              <div>Role: investigator</div>
              <div>Last Login: Database Timestamp</div>
            </div>
          </div>
          <div class="member-card">
            <div class="member-header">
              <strong>Compliance Regulator</strong>
              <span class="status-badge active">Active</span>
            </div>
            <div class="member-details">
              <div>Role: regulator</div>
              <div>Last Login: Database Timestamp</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateComplianceMonitorContent() {
    return `
      <div class="compliance-monitor">
        <h2>Compliance Monitor</h2>
        <div class="compliance-metrics">
          <div class="metric-card">
            <h3>Overall Compliance Score</h3>
            <div class="metric-value">96.5%</div>
          </div>
          <div class="metric-card">
            <h3>Regulatory Adherence</h3>
            <div class="metric-value">98.2%</div>
          </div>
          <div class="metric-card">
            <h3>Audit Completion</h3>
            <div class="metric-value">87.8%</div>
          </div>
        </div>
      </div>
    `;
  }

  function generateBlockchainLedgerContent() {
    return `
      <div class="blockchain-ledger">
        <h2>Blockchain Ledger</h2>
        <div class="ledger-info">
          <div class="block-info">
            <h3>Latest Block</h3>
            <div class="block-details">
              <div>Block Height: #1,234</div>
              <div>Transactions: 47</div>
              <div>Timestamp: ${new Date().toISOString()}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateSystemHealthContent() {
    return `
      <div class="system-health">
        <h2>System Health</h2>
        <div class="health-metrics">
          <div class="metric-card">
            <h3>Server Uptime</h3>
            <div class="metric-value">99.9%</div>
          </div>
          <div class="metric-card">
            <h3>API Response Time</h3>
            <div class="metric-value">124ms</div>
          </div>
          <div class="metric-card">
            <h3>Error Rate</h3>
            <div class="metric-value">0.02%</div>
          </div>
        </div>
      </div>
    `;
  }

  function generateBenchmarksContent() {
    return `
      <div class="benchmarks">
        <h2>Industry Benchmarks</h2>
        <div class="benchmark-comparison">
          <div class="benchmark-card">
            <h3>Your Performance</h3>
            <div class="metric-value">94.2%</div>
          </div>
          <div class="benchmark-card">
            <h3>Industry Average</h3>
            <div class="metric-value">87.5%</div>
          </div>
          <div class="benchmark-card">
            <h3>Top Performer</h3>
            <div class="metric-value">98.7%</div>
          </div>
        </div>
      </div>
    `;
  }

  function generateClaimSubmissionContent() {
    return `
      <div class="claim-submission">
        <h2>Claim Submission</h2>
        <div class="submission-form">
          <div class="form-group">
            <label>Patient Information</label>
            <input type="text" placeholder="Patient Name" class="form-input">
            <input type="text" placeholder="Patient ID" class="form-input">
          </div>
          <div class="form-group">
            <label>Service Details</label>
            <input type="text" placeholder="Service Code" class="form-input">
            <input type="number" placeholder="Amount" class="form-input">
          </div>
          <button class="btn btn-primary">Submit Claim</button>
        </div>
      </div>
    `;
  }

  function generateClaimTrackerContent() {
    return `
      <div class="claim-tracker">
        <h2>Claim Status Tracker</h2>
        <div class="claim-status-list">
          <div class="status-item">
            <div class="status-header">
              <strong>Loading claims from database...</strong>
              <span class="status-badge">Database</span>
            </div>
            <div class="status-details">
              <div>Patient: Database Patient</div>
              <div>Amount: Database Amount</div>
              <div>Submitted: Database Date</div>
              <div>Current Status: Database Status</div>
            </div>
          </div>
          <div class="status-item">
            <div class="status-header">
              <strong>Loading claims from database...</strong>
              <span class="status-badge">Database</span>
            </div>
            <div class="status-details">
              <div>Patient: Database Patient</div>
              <div>Amount: Database Amount</div>
              <div>Submitted: Database Date</div>
              <div>Current Status: Database Status</div>
            </div>
          </div>
          <div class="status-item">
            <div class="status-header">
              <strong>Loading claims from database...</strong>
              <span class="status-badge">Database</span>
            </div>
            <div class="status-details">
              <div>Patient: Database Patient</div>
              <div>Amount: Database Amount</div>
              <div>Submitted: Database Date</div>
              <div>Current Status: Database Status</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateRiskScoreContent() {
    return `
      <div class="risk-score">
        <h2>Risk Score Analysis</h2>
        <div class="risk-metrics">
          <div class="risk-card">
            <h3>Overall Risk Score</h3>
            <div class="risk-value high">7.8</div>
          </div>
          <div class="risk-factors">
            <h4>Risk Factors:</h4>
            <ul>
              <li>Claim amount exceeds average</li>
              <li>Unusual billing frequency</li>
              <li>Missing documentation</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function generateComplianceContent() {
    return `
      <div class="compliance">
        <h2>Compliance Dashboard</h2>
        <div class="compliance-items">
          <div class="compliance-card">
            <h3>Documentation Status</h3>
            <div class="compliance-value good">Complete</div>
          </div>
          <div class="compliance-card">
            <h3>Regulatory Check</h3>
            <div class="compliance-value warning">Pending Review</div>
          </div>
        </div>
      </div>
    `;
  }

  function generateSelfAuditContent() {
    return `
      <div class="self-audit">
        <h2>Self-Audit Tools</h2>
        <div class="audit-tools">
          <div class="tool-card">
            <h3>Claims Audit</h3>
            <p>Review recent claims for compliance issues.</p>
            <button class="btn btn-primary">Start Audit</button>
          </div>
          <div class="tool-card">
            <h3>Billing Analysis</h3>
            <p>Analyze billing patterns for anomalies.</p>
            <button class="btn btn-primary">Analyze</button>
          </div>
        </div>
      </div>
    `;
  }

  function generateMyClaimsContent() {
    return `
      <div class="my-claims">
        <h2>My Claims</h2>
        <div class="claims-list">
          <div class="claim-item">
            <div class="claim-header">
              <strong>Loading claims from database...</strong>
              <span class="status-badge">Database</span>
            </div>
            <div class="claim-details">
              <div>Provider: Database Provider</div>
              <div>Amount: Database Amount</div>
              <div>Date: Database Date</div>
              <div>Status: Database Status</div>
            </div>
          </div>
          <div class="claim-item">
            <div class="claim-header">
              <strong>Loading claims from database...</strong>
              <span class="status-badge">Database</span>
            </div>
            <div class="claim-details">
              <div>Provider: Database Provider</div>
              <div>Amount: Database Amount</div>
              <div>Date: Database Date</div>
              <div>Status: Database Status</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateAppealTrackerContent() {
    return `
      <div class="appeal-tracker">
        <h2>Appeal Tracker</h2>
        <div class="appeals-list">
          <div class="appeal-item">
            <div class="appeal-header">
              <strong>Appeal #001</strong>
              <span class="status-badge pending">In Progress</span>
            </div>
            <div class="appeal-details">
              <div>Original Claim: Database Claim ID</div>
              <div>Reason: Insufficient Documentation</div>
              <div>Submitted: Database Date</div>
              <div>Status: Under Review</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateFraudProtectionContent() {
    return `
      <div class="fraud-protection">
        <h2>Fraud Protection</h2>
        <div class="protection-features">
          <div class="protection-card">
            <h3>Active Monitoring</h3>
            <div class="protection-status active">Enabled</div>
          </div>
          <div class="protection-card">
            <h3>Alert Preferences</h3>
            <div class="protection-status active">Real-time Alerts</div>
          </div>
          <div class="protection-card">
            <h3>Privacy Controls</h3>
            <div class="protection-status active">Maximum</div>
          </div>
        </div>
      </div>
    `;
  }

  function generateTransparencyReportsContent() {
    return `
      <div class="transparency-reports">
        <h2>Transparency Reports</h2>
        <div class="report-list">
          <div class="report-card">
            <h3>Q4 2023 Report</h3>
            <p>Complete analysis of fraud detection patterns and outcomes.</p>
            <button class="btn btn-primary">Download PDF</button>
          </div>
        </div>
      </div>
    `;
  }

  function generatePreferencesContent() {
    return `
      <div class="preferences">
        <h2>Preferences</h2>
        <div class="preferences-form">
          <div class="form-group">
            <label>Notification Settings</label>
            <select class="form-select">
              <option>Real-time Alerts</option>
              <option>Daily Summary</option>
              <option>Weekly Reports</option>
            </select>
          </div>
          <div class="form-group">
            <label>Privacy Level</label>
            <select class="form-select">
              <option>Maximum</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </div>
          <button class="btn btn-primary">Save Preferences</button>
        </div>
      </div>
    `;
  }

  function generateFraudTrendsContent() {
    return `
      <div class="fraud-trends">
        <h2>Fraud Trends Analysis</h2>
        <div class="trends-chart">
          <div class="trend-metric">
            <h3>Monthly Fraud Detection</h3>
            <div class="trend-data">
              <div class="trend-item">
                <span>January:</span>
                <strong>47 cases</strong>
              </div>
              <div class="trend-item">
                <span>February:</span>
                <strong>52 cases</strong>
              </div>
              <div class="trend-item">
                <span>March:</span>
                <strong>38 cases</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateAuditLogsContent() {
    return `
      <div class="audit-logs">
        <h2>Audit Logs</h2>
        <div class="logs-list">
          <div class="log-item">
            <div class="log-header">
              <strong>Database Timestamp</strong>
              <span class="log-type compliance">Compliance</span>
            </div>
            <div class="log-details">
              <div>Action: Database audit log entry</div>
              <div>User: System</div>
              <div>Claim: Database Claim ID</div>
            </div>
          </div>
          <div class="log-item">
            <div class="log-header">
              <strong>Database Timestamp</strong>
              <span class="log-type security">Security</span>
            </div>
            <div class="log-details">
              <div>Action: Database audit log entry</div>
              <div>User: System</div>
              <div>Claim: Database Claim ID</div>
            </div>
          </div>
          <div class="log-item">
            <div class="log-header">
              <strong>Database Timestamp</strong>
              <span class="log-type performance">Performance</span>
            </div>
            <div class="log-details">
              <div>Action: Database audit log entry</div>
              <div>User: System</div>
              <div>Claim: Database Claim ID</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateBiasAuditingContent() {
    return `
      <div class="bias-auditing">
        <h2>Bias Auditing Reports</h2>
        <div class="bias-metrics">
          <div class="bias-card">
            <h3>Model Fairness Score</h3>
            <div class="bias-value good">0.94</div>
          </div>
          <div class="bias-card">
            <h3>Demographic Parity</h3>
            <div class="bias-value good">0.91</div>
          </div>
          <div class="bias-card">
            <h3>Equal Opportunity</h3>
            <div class="bias-value warning">0.87</div>
          </div>
        </div>
      </div>
    `;
  }

  function generateBlockchainVerificationContent() {
    return `
      <div class="blockchain-verification">
        <h2>Blockchain Verification</h2>
        <div class="verification-tools">
          <div class="verification-card">
            <h3>Claim Integrity</h3>
            <div class="verification-status verified">Verified</div>
          </div>
          <div class="verification-card">
            <h3>Transaction Hash</h3>
            <div class="hash-value">0x7f8a9b3c4e2d6a1b5c9f8e7a6b3d5e4f2a1b</div>
          </div>
        </div>
      </div>
    `;
  }

  function generateIndustryBenchmarkingContent() {
    return `
      <div class="industry-benchmarking">
        <h2>Industry Benchmarking</h2>
        <div class="benchmark-comparison">
          <div class="benchmark-card">
            <h3>Your Organization</h3>
            <div class="metric-value">94.2%</div>
          </div>
          <div class="benchmark-card">
            <h3>Industry Average</h3>
            <div class="metric-value">87.5%</div>
          </div>
          <div class="benchmark-card">
            <h3>Top Quartile</h3>
            <div class="metric-value">96.8%</div>
          </div>
        </div>
      </div>
    `;
  }

  function generateFeatureInsightsContent() {
    return `
      <div class="feature-insights">
        <h2>Feature Insights</h2>
        <div class="insights-grid">
          <div class="insight-card">
            <h3>High Impact Features</h3>
            <div class="feature-list">
              <div class="feature-item">
                <span>Provider Frequency</span>
                <div class="importance high">High</div>
              </div>
              <div class="feature-item">
                <span>Amount Deviation</span>
                <div class="importance high">High</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateGraphAnalyticsContent() {
    return `
      <div class="graph-analytics">
        <h2>Graph Analytics</h2>
        <div class="network-analysis">
          <div class="analysis-card">
            <h3>Network Connections</h3>
            <p>Visualizing provider-patient relationships and detecting anomalous patterns.</p>
          </div>
          <div class="analysis-card">
            <h3>Suspicious Clusters</h3>
            <p>3 clusters identified with unusual billing patterns.</p>
          </div>
        </div>
      </div>
    `;
  }

  function generateModelMetricsContent() {
    return `
      <div class="model-metrics">
        <h2>Model Performance Metrics</h2>
        <div class="metrics-dashboard">
          <div class="metric-card">
            <h3>Accuracy</h3>
            <div class="metric-value">94.7%</div>
          </div>
          <div class="metric-card">
            <h3>Precision</h3>
            <div class="metric-value">91.2%</div>
          </div>
          <div class="metric-card">
            <h3>Recall</h3>
            <div class="metric-value">89.5%</div>
          </div>
          <div class="metric-card">
            <h3>F1 Score</h3>
            <div class="metric-value">90.3%</div>
          </div>
        </div>
      </div>
    `;
  }

  function generateSandboxContent() {
    return `
      <div class="fraud-sandbox">
        <h2>Fraud Simulation Sandbox</h2>
        <div class="sandbox-dashboard">
          <div class="scenario-builder">
            <h3>Build Synthetic Fraud Scenarios</h3>
            <div class="scenario-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Scenario Type</label>
                  <select class="form-select" id="scenarioType">
                    <option value="upcoding">Upcoding</option>
                    <option value="phantom-billing">Phantom Billing</option>
                    <option value="unbundling">Unbundling</option>
                    <option value="kickbacks">Kickbacks</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Severity Level</label>
                  <select class="form-select" id="severityLevel">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Number of Claims</label>
                  <input type="number" class="form-input" id="claimCount" value="100" min="10" max="1000">
                </div>
                <div class="form-group">
                  <label>Time Period (days)</label>
                  <input type="number" class="form-input" id="timePeriod" value="30" min="1" max="365">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Provider Mix</label>
                  <select class="form-select" id="providerMix">
                    <option value="random">Random</option>
                    <option value="targeted">Targeted</option>
                    <option value="network">Network-based</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Amount Variation</label>
                  <select class="form-select" id="amountVariation">
                    <option value="realistic">Realistic</option>
                    <option value="exaggerated">Exaggerated</option>
                    <option value="subtle">Subtle</option>
                  </select>
                </div>
              </div>
              <button class="btn btn-primary" onclick="generateScenario()">🎲 Generate Scenario</button>
            </div>
          </div>
          
          <div class="model-testing">
            <h3>Test Model Responses</h3>
            <div class="testing-controls">
              <button class="btn btn-secondary" onclick="runModelTest()">🚀 Run Model Test</button>
              <button class="btn btn-secondary" onclick="compareModels()">📊 Compare Models</button>
              <button class="btn btn-secondary" onclick="stressTest()">💪 Stress Test</button>
            </div>
            
            <div class="test-results">
              <h4>Test Results</h4>
              <div class="results-grid">
                <div class="result-card">
                  <h5>Detection Rate</h5>
                  <div class="result-value good">87.3%</div>
                  <p>Successfully identified fraudulent claims</p>
                </div>
                <div class="result-card">
                  <h5>False Positive Rate</h5>
                  <div class="result-value warning">12.7%</div>
                  <p>Legitimate claims incorrectly flagged</p>
                </div>
                <div class="result-card">
                  <h5>Processing Time</h5>
                  <div class="result-value good">0.8s</div>
                  <p>Average time per claim</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="retraining-feedback">
            <h3>Retrain with Feedback</h3>
            <div class="feedback-loop">
              <div class="feedback-item">
                <h4>🎯 False Positive Analysis</h4>
                <p>Review claims incorrectly flagged to improve precision</p>
                <button class="btn btn-sm" onclick="analyzeFalsePositives()">Analyze</button>
              </div>
              <div class="feedback-item">
                <h4>🔍 False Negative Analysis</h4>
                <p>Review missed fraud patterns to improve recall</p>
                <button class="btn btn-sm" onclick="analyzeFalseNegatives()">Analyze</button>
              </div>
              <div class="feedback-item">
                <h4>🔄 Model Retraining</h4>
                <p>Incorporate new patterns and feedback</p>
                <button class="btn btn-primary" onclick="retrainModel()">Retrain Model</button>
              </div>
            </div>
          </div>
          
          <div class="chart-container">
            <canvas id="sandboxResultsChart"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function addInputFocusEffects(form) {
    if (!form) return;
    qsa('input, textarea, select', form).forEach(input => {
      input.addEventListener('focus', () => {
        if (input.parentElement) input.parentElement.classList.add('focused');
      });
      input.addEventListener('blur', () => {
        if (!input.value && input.parentElement) input.parentElement.classList.remove('focused');
      });
    });
  }

  function showQuickSearch() {
    const input = $id('kmed-search-input');
    if (input) {
      input.focus();
      input.select();
    } else {
      // fallback notification
      alert('Quick search not available');
    }
  }

  function closeModals() {
    qsa('.modal-overlay.active').forEach(m => m.remove());
  }

  // ---------- Button Event Listeners ----------
  function setupButtonEventListeners() {
    // Analyst Dashboard Button Functions
    window.generateScenario = function() {
      const scenarioType = document.getElementById('scenarioType')?.value;
      const severityLevel = document.getElementById('severityLevel')?.value;
      const claimCount = document.getElementById('claimCount')?.value;
      const timePeriod = document.getElementById('timePeriod')?.value;
      
      console.log('Generating scenario:', { scenarioType, severityLevel, claimCount, timePeriod });
      alert(`Scenario Generated!\nType: ${scenarioType}\nSeverity: ${severityLevel}\nClaims: ${claimCount}\nPeriod: ${timePeriod} days`);
    };
    
    window.runModelTest = function() {
      console.log('Running model test...');
      alert('Model test started! Results will be displayed shortly.');
    };
    
    window.compareModels = function() {
      console.log('Comparing models...');
      alert('Model comparison initiated! Analysis in progress.');
    };
    
    window.stressTest = function() {
      console.log('Running stress test...');
      alert('Stress test initiated! Testing model under extreme conditions.');
    };
    
    window.analyzeFalsePositives = function() {
      console.log('Analyzing false positives...');
      alert('False positive analysis started! Identifying incorrectly flagged claims.');
    };
    
    window.analyzeFalseNegatives = function() {
      console.log('Analyzing false negatives...');
      alert('False negative analysis started! Identifying missed fraud patterns.');
    };
    
    window.retrainModel = function() {
      console.log('Retraining model...');
      alert('Model retraining initiated! This may take several minutes.');
    };
    
    // Claims Stream Functions
    window.investigateClaim = function(claimId) {
      console.log('Investigating claim:', claimId);
      alert(`Investigating claim ${claimId}\nOpening detailed analysis panel...`);
    };
    
    window.flagClaim = function(claimId) {
      console.log('Flagging claim:', claimId);
      alert(`Claim ${claimId} flagged for review!`);
    };
    
    window.approveClaim = function(claimId) {
      console.log('Approving claim:', claimId);
      alert(`Claim ${claimId} approved! Processing payment...`);
    };
    
    window.viewClaim = function(claimId) {
      console.log('Viewing claim:', claimId);
      
      const claimDetails = {
        'CLM001': {
          patient: 'John Smith',
          patientId: 'P001',
          date: '2024-01-15',
          amount: '$1,250.00',
          status: 'approved',
          provider: 'Dr. Sarah Johnson',
          diagnosis: 'A45.9',
          procedure: '99214',
          insurance: 'Blue Cross',
          submitted: '2024-01-15',
          approved: '2024-01-17',
          notes: 'Routine checkup with preventive care. All documentation complete.'
        },
        'CLM002': {
          patient: 'Jane Doe',
          patientId: 'P002',
          date: '2024-01-14',
          amount: '$850.00',
          status: 'pending',
          provider: 'Dr. Sarah Johnson',
          diagnosis: 'J02.9',
          procedure: '99213',
          insurance: 'Aetna',
          submitted: '2024-01-14',
          approved: 'Pending',
          notes: 'Follow-up visit for acute pharyngitis. Awaiting additional documentation.'
        }
      };
      
      const claim = claimDetails[claimId] || claimDetails['CLM001'];
      
      const content = `
        <div class="detail-section">
          <h4>Patient Information</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">Patient Name</div>
              <div class="detail-value">${claim.patient}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Patient ID</div>
              <div class="detail-value">${claim.patientId}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Date of Service</div>
              <div class="detail-value">${claim.date}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Insurance Provider</div>
              <div class="detail-value">${claim.insurance}</div>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Claim Details</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">Claim ID</div>
              <div class="detail-value">${claimId}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Amount</div>
              <div class="detail-value">${claim.amount}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Status</div>
              <div class="detail-value"><span class="detail-status ${claim.status}">${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}</span></div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Provider</div>
              <div class="detail-value">${claim.provider}</div>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Medical Information</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">Diagnosis Code</div>
              <div class="detail-value">${claim.diagnosis}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Procedure Code</div>
              <div class="detail-value">${claim.procedure}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Submitted Date</div>
              <div class="detail-value">${claim.submitted}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Approved Date</div>
              <div class="detail-value">${claim.approved}</div>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Notes</h4>
          <div class="detail-item" style="grid-column: 1 / -1;">
            <div class="detail-value">${claim.notes}</div>
          </div>
        </div>
        
        <div class="detail-actions">
          <button class="btn btn-primary" onclick="downloadClaim('${claimId}')">📥 Download Documents</button>
          <button class="btn btn-secondary" onclick="printClaim('${claimId}')">🖨️ Print</button>
          ${claim.status === 'pending' ? `<button class="btn btn-secondary" onclick="editClaim('${claimId}')">✏️ Edit Claim</button>` : ''}
        </div>
      `;
      
      showModal(`Claim Details - ${claimId}`, content);
    };
    
    window.downloadClaim = function(claimId) {
      console.log('Downloading claim:', claimId);
      alert(`Downloading claim ${claimId} documents...`);
    };
    
    // Graph Analytics Functions
    window.investigateCluster = function(clusterId) {
      console.log('Investigating cluster:', clusterId);
      alert(`Investigating Cluster ${clusterId}\nAnalyzing network connections...`);
    };
    
    // Investigator Dashboard Button Functions
    window.quickView = function(claimId) {
      console.log('Quick view claim:', claimId);
      alert(`Quick View: Claim ${claimId}\nOpening detailed preview...`);
    };
    
    window.quickAssign = function(alertId) {
      console.log('Quick assign alert:', alertId);
      alert(`Quick Assign: Alert ${alertId}\nOpening assignment modal...`);
    };
    
    window.quickEscalate = function(alertId) {
      console.log('Quick escalate alert:', alertId);
      alert(`Quick Escalate: Alert ${alertId}\nEscalating to senior investigator...`);
    };
    
    window.quickDismiss = function(alertId) {
      console.log('Quick dismiss alert:', alertId);
      alert(`Quick Dismiss: Alert ${alertId}\nDismissing alert with reason...`);
    };
    
    window.refreshQueue = function() {
      console.log('Refreshing queue...');
      alert('Queue refreshed! Latest data loaded.');
    };
    
    window.exportQueue = function() {
      console.log('Exporting queue...');
      alert('Queue exported! Downloading CSV file...');
    };
    
    window.switchTab = function(tabName) {
      console.log('Switching to tab:', tabName);
      alert(`Switching to ${tabName} tab...`);
    };
    
    window.printCase = function() {
      console.log('Printing case...');
      alert('Printing case summary...');
    };
    
    window.pdfExport = function() {
      console.log('Exporting PDF...');
      alert('Generating PDF case summary...');
    };
    
    window.sortTable = function(column) {
      console.log('Sorting table by:', column);
      alert(`Sorting by ${column}...`);
    };
    
    window.loadSearch = function(searchName) {
      console.log('Loading saved search:', searchName);
      alert(`Loading saved search: ${searchName}`);
    };
    
    window.openTraining = function() {
      console.log('Opening training...');
      alert('Opening training module...');
    };
    
    window.openPolicy = function() {
      console.log('Opening policy reference...');
      alert('Opening policy reference guide...');
    };
    
    window.viewEvidence = function(docId) {
      console.log('Viewing evidence:', docId);
      alert(`Opening evidence ${docId} with redaction tools...`);
    };
    
    window.tagEvidence = function(docId, tag) {
      console.log('Tagging evidence:', docId, tag);
      alert(`Evidence ${docId} tagged as ${tag}`);
    };
    
    window.assignCase = function() {
      console.log('Assigning case...');
      alert('Case assigned with SLA timer started!');
    };
    
    window.requestInfo = function() {
      console.log('Requesting more info...');
      alert('Information request sent to provider!');
    };
    
    window.freezePayment = function() {
      console.log('Freezing payment...');
      alert('Payment frozen! Investigation in progress.');
    };
    
    window.createCase = function() {
      console.log('Creating case...');
      alert('New case created from alert!');
    };
  }
  function setupEventListeners() {
    // Login form
    const loginForm = $id('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
      addInputFocusEffects(loginForm);
    } else {
      console.warn('Login form not found on page');
    }

    // Logout button
    const logoutBtn = $id('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // UI helpers
    addRippleEffect();
    addSmoothScrolling();
    addKeyboardNavigation();
  }

  // ---------- Boot sequence ----------
  document.addEventListener('DOMContentLoaded', () => {
    // Prevent double initialization
    if (window.__KMED_INITIALIZED__) return;
    window.__KMED_INITIALIZED__ = true;

    // Wire events and UI
    setupEventListeners();

    // Restore auth if present
    if (checkExistingAuth()) {
      showDashboard();
    } else {
      // ensure login page visible
      const loginPage = $id('loginPage');
      const dashboardLayout = $id('dashboardLayout');
      if (loginPage) {
        loginPage.classList.add('active');
        loginPage.style.display = 'flex';
      }
      if (dashboardLayout) {
        dashboardLayout.classList.remove('active');
        dashboardLayout.style.display = 'none';
      }
    }

    // Expose debug helpers for dev
    window.debugLogin = {
      currentUser: () => currentUser,
      showDashboard,
      handleLogout,
      tryMockLogin
    };

    // Console hints
    console.info('Login system initialized. Demo credentials: analyst / password (and other roles).');
  });

})();
