// Patient Dashboard Functions

// Content Generation Functions
function generateHomeContent() {
    return `
        <div class="patient-home">
            <h2>Patient Dashboard</h2>
            <div class="dashboard-grid">
                <div class="metric-card">
                    <h3>Total Claims Submitted</h3>
                    <div class="metric-value">12</div>
                </div>
                <div class="metric-card">
                    <h3>Claims Approved</h3>
                    <div class="metric-value">8</div>
                </div>
                <div class="metric-card">
                    <h3>Claims Denied</h3>
                    <div class="metric-value">2</div>
                </div>
                <div class="metric-card">
                    <h3>Claims Flagged</h3>
                    <div class="metric-value">2</div>
                </div>
            </div>
            
            <div class="fraud-protection-alerts">
                <div class="alert-banner warning">
                    <h4>🛡️ Fraud Protection Alert</h4>
                    <p>Suspicious login attempt detected from unknown device</p>
                    <button class="btn btn-sm" onclick="showSecuritySteps()">🔒 Secure Account</button>
                </div>
                <div class="alert-banner info">
                    <h4>📋 Identity Verification Required</h4>
                    <p>New claim filed - please verify your identity</p>
                    <button class="btn btn-sm" onclick="verifyIdentity()">✅ Verify Identity</button>
                </div>
            </div>
            
            <div class="quick-links">
                <div class="link-card">
                    <h3>📅 Appeal Tracker</h3>
                    <p>Track and manage claim disputes</p>
                    <button class="btn btn-primary" onclick="loadDashboardContent('appeal-tracker')">View Appeals</button>
                </div>
                <div class="link-card">
                    <h3>📋 Claim History</h3>
                    <p>View complete claim timeline</p>
                    <button class="btn btn-primary" onclick="loadDashboardContent('claim-history')">View History</button>
                </div>
            </div>
            
            <div class="chart-container">
                <canvas id="patientOverviewChart"></canvas>
            </div>
        </div>
    `;
}

function generateClaimHistoryContent() {
    return `
        <div class="claim-history">
            <h2>Claim History Timeline</h2>
            <div class="timeline-dashboard">
                <div class="timeline-filters">
                    <h3>Filter Claims</h3>
                    <div class="filter-controls">
                        <select class="form-select" id="statusFilter">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="flagged">Flagged</option>
                            <option value="denied">Denied</option>
                        </select>
                        <select class="form-select" id="providerFilter">
                            <option value="all">All Providers</option>
                            <option value="dr-smith">Dr. Smith</option>
                            <option value="dr-johnson">Dr. Johnson</option>
                            <option value="dr-brown">Dr. Brown</option>
                        </select>
                        <input type="date" class="form-input" id="dateFilter" placeholder="Filter by date range">
                    </div>
                </div>
                
                <div class="timeline-view">
                    <h3>Claims Timeline</h3>
                    <div class="timeline">
                        <div class="timeline-item approved">
                            <div class="timeline-marker green"></div>
                            <div class="timeline-content">
                                <div class="claim-header">
                                    <strong>CLM001</strong>
                                    <span class="status-badge approved">Approved</span>
                                    <span class="claim-date">2024-01-10</span>
                                </div>
                                <div class="claim-details">
                                    <div>Provider: Dr. Smith</div>
                                    <div>Amount: $1,200</div>
                                    <div>Service: Annual Checkup</div>
                                    <div>Submitted: 2024-01-08</div>
                                    <div>Approved: 2024-01-10</div>
                                    <div>Processing Time: 2 days</div>
                                </div>
                            </div>
                        </div>
                        <div class="timeline-item denied">
                            <div class="timeline-marker red"></div>
                            <div class="timeline-content">
                                <div class="claim-header">
                                    <strong>CLM002</strong>
                                    <span class="status-badge denied">Denied</span>
                                    <span class="claim-date">2024-01-12</span>
                                </div>
                                <div class="claim-details">
                                    <div>Provider: Dr. Johnson</div>
                                    <div>Amount: $800</div>
                                    <div>Service: Dental Cleaning</div>
                                    <div>Submitted: 2024-01-05</div>
                                    <div>Denied: 2024-01-12</div>
                                    <div>Reason: Missing documentation</div>
                                    <div>Processing Time: 7 days</div>
                                </div>
                            </div>
                        </div>
                        <div class="timeline-item flagged">
                            <div class="timeline-marker yellow"></div>
                            <div class="timeline-content">
                                <div class="claim-header">
                                    <strong>CLM003</strong>
                                    <span class="status-badge flagged">Flagged</span>
                                    <span class="claim-date">2024-01-15</span>
                                </div>
                                <div class="claim-details">
                                    <div>Provider: Dr. Brown</div>
                                    <div>Amount: $2,500</div>
                                    <div>Service: Specialist Consultation</div>
                                    <div>Submitted: 2024-01-14</div>
                                    <div>Status: Under Review</div>
                                    <div>Flag Reason: Unusual billing pattern</div>
                                    <div>Processing Time: 1 day</div>
                                </div>
                            </div>
                        </div>
                        <div class="timeline-item pending">
                            <div class="timeline-marker yellow"></div>
                            <div class="timeline-content">
                                <div class="claim-header">
                                    <strong>CLM004</strong>
                                    <span class="status-badge pending">Pending</span>
                                    <span class="claim-date">2024-01-16</span>
                                </div>
                                <div class="claim-details">
                                    <div>Provider: Dr. Smith</div>
                                    <div>Amount: $600</div>
                                    <div>Service: Blood Test</div>
                                    <div>Submitted: 2024-01-16</div>
                                    <div>Status: In Review</div>
                                    <div>Processing Time: In Progress</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="timeline-summary">
                    <h3>Summary Statistics</h3>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="summary-label">Total Claims:</span>
                            <span class="summary-value">12</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Approved:</span>
                            <span class="summary-value approved">8 (67%)</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Denied:</span>
                            <span class="summary-value denied">2 (17%)</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Flagged:</span>
                            <span class="summary-value flagged">2 (17%)</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Pending:</span>
                            <span class="summary-value pending">1 (8%)</span>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="claimTimelineChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateAppealTrackerContent() {
    return `
        <div class="appeal-tracker">
            <h2>Appeal Tracker</h2>
            <div class="appeal-dashboard">
                <div class="appeals-list">
                    <div class="appeal-item">
                        <div class="appeal-header">
                            <strong>Appeal #001</strong>
                            <span class="appeal-status resolved">Resolved</span>
                            <span class="appeal-date">2024-01-08</span>
                        </div>
                        <div class="appeal-details">
                            <div class="appeal-info">
                                <div>Original Claim: CLM002</div>
                                <div>Reason for Denial: Missing documentation</div>
                                <div>Appeal Filed: 2024-01-08</div>
                                <div>Status: Resolved - Approved</div>
                                <div>Resolution Date: 2024-01-12</div>
                            </div>
                            <div class="appeal-documents">
                                <h4>Supporting Documents</h4>
                                <div class="document-list">
                                    <div class="document-item">
                                        <span class="doc-name">medical_record.pdf</span>
                                        <span class="doc-status uploaded">✅ Uploaded</span>
                                    </div>
                                    <div class="document-item">
                                        <span class="doc-name">id_verification.pdf</span>
                                        <span class="doc-status uploaded">✅ Uploaded</span>
                                    </div>
                                    <div class="document-item">
                                        <span class="doc-name">referral_letter.pdf</span>
                                        <span class="doc-status uploaded">✅ Uploaded</span>
                                    </div>
                                </div>
                                <button class="btn btn-sm" onclick="uploadAppealDocument('001')">📤 Upload Document</button>
                            </div>
                        </div>
                        <div class="appeal-item">
                            <div class="appeal-header">
                                <strong>Appeal #002</strong>
                                <span class="appeal-status in-progress">Under Review</span>
                                <span class="appeal-date">2024-01-15</span>
                            </div>
                            <div class="appeal-details">
                                <div class="appeal-info">
                                    <div>Original Claim: CLM003</div>
                                    <div>Reason for Denial: Unusual billing pattern</div>
                                    <div>Appeal Filed: 2024-01-15</div>
                                    <div>Status: Under Review</div>
                                    <div>Estimated Resolution: 2024-01-22</div>
                                </div>
                                <div class="appeal-documents">
                                    <h4>Supporting Documents</h4>
                                    <div class="document-list">
                                        <div class="document-item">
                                            <span class="doc-name">explanation_letter.pdf</span>
                                            <span class="doc-status uploaded">✅ Uploaded</span>
                                        </div>
                                        <div class="document-item">
                                            <span class="doc-name">provider_statement.pdf</span>
                                            <span class="doc-status pending">📤 Pending</span>
                                        </div>
                                    </div>
                                    <button class="btn btn-sm" onclick="uploadAppealDocument('002')">📤 Upload Document</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="appeal-notifications">
                    <h3>Notification Preferences</h3>
                    <div class="notification-settings">
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" checked> Email notifications for status changes
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" checked> SMS alerts for urgent updates
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" checked> Portal notifications
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="appealStatusChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateFraudProtectionContent() {
    return `
        <div class="fraud-protection">
            <h2>Fraud Protection Alerts</h2>
            <div class="protection-dashboard">
                <div class="security-alerts">
                    <div class="alert-banner urgent">
                        <h4>🚨 Suspicious Activity Detected</h4>
                        <p>New claim filed in your name from unrecognized location</p>
                        <div class="alert-details">
                            <div>Location: Unknown IP Address</div>
                            <div>Time: 2024-01-15 14:30</div>
                            <div>Claim ID: CLM999</div>
                            <div>Amount: $3,500</div>
                        </div>
                        <div class="response-actions">
                            <h5>Immediate Response Required:</h5>
                            <div class="action-steps">
                                <div class="step-item">
                                    <span class="step-number">1</span>
                                    <span class="step-text">Contact provider immediately to verify claim</span>
                                </div>
                                <div class="step-item">
                                    <span class="step-number">2</span>
                                    <span class="step-text">Report identity theft to authorities</span>
                                </div>
                                <div class="step-item">
                                    <span class="step-number">3</span>
                                    <span class="step-text">Place fraud alert on your account</span>
                                </div>
                            </div>
                            <div class="action-buttons">
                                <button class="btn btn-danger" onclick="reportIdentityTheft()">🚨 Report Identity Theft</button>
                                <button class="btn btn-primary" onclick="contactProvider()">📞 Contact Provider</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="alert-banner warning">
                        <h4>⚠️ Unusual Login Pattern</h4>
                        <p>Multiple login attempts from different devices detected</p>
                        <div class="alert-details">
                            <div>Attempts: 5 failed logins</div>
                            <div>Devices: 3 different locations</div>
                            <div>Time Frame: Last 2 hours</div>
                        </div>
                        <div class="response-actions">
                            <h5>Recommended Actions:</h5>
                            <div class="action-steps">
                                <div class="step-item">
                                    <span class="step-number">1</span>
                                    <span class="step-text">Change your password immediately</span>
                                </div>
                                <div class="step-item">
                                    <span class="step-number">2</span>
                                    <span class="step-text">Enable two-factor authentication</span>
                                </div>
                                <div class="step-item">
                                    <span class="step-number">3</span>
                                    <span class="step-text">Review recent account activity</span>
                                </div>
                            </div>
                            <div class="action-buttons">
                                <button class="btn btn-primary" onclick="changePassword()">🔐 Change Password</button>
                                <button class="btn btn-primary" onclick="enable2FA">🛡️ Enable 2FA</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="secure-messaging">
                    <h3>Secure Investigator Communication</h3>
                    <div class="messaging-interface">
                        <div class="message-history">
                            <div class="message-item investigator">
                                <div class="message-header">
                                    <strong>Investigator Sarah Miller</strong>
                                    <span class="message-time">2024-01-15 10:30</span>
                                </div>
                                <div class="message-content">
                                    <p>We need to verify your identity regarding claim CLM002. Please contact us at the secure number provided.</p>
                                </div>
                                <div class="message-actions">
                                    <button class="btn btn-sm" onclick="respondToInvestigator('sarah-miller')">💬 Respond</button>
                                    <button class="btn btn-sm" onclick="callInvestigator('sarah-miller')">📞 Call</button>
                                </div>
                            </div>
                        </div>
                        <div class="compose-message">
                            <textarea class="form-input" id="secureMessage" placeholder="Compose secure message to investigator..."></textarea>
                            <button class="btn btn-primary" onclick="sendSecureMessage()">🔒 Send Secure Message</button>
                        </div>
                    </div>
                </div>
                
                <div class="protection-settings">
                    <h3>Fraud Protection Settings</h3>
                    <div class="settings-grid">
                        <div class="setting-card">
                            <h4>Real-time Monitoring</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <p>Instant alerts for suspicious activities</p>
                        </div>
                        <div class="setting-card">
                            <h4>Location Tracking</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <p>Monitor claims from unusual locations</p>
                        </div>
                        <div class="setting-card">
                            <h4>Identity Verification</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <p>Require verification for new claims</p>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="fraudProtectionChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateTransparencyReportsContent() {
    return `
        <div class="transparency-reports">
            <h2>Transparency Reports</h2>
            <div class="transparency-dashboard">
                <div class="bias-free-decisions">
                    <h3>Bias-Free Decision Summaries</h3>
                    <div class="decision-examples">
                        <div class="decision-item">
                            <div class="decision-header">
                                <strong>Claim CLM001 - Approved</strong>
                                <span class="decision-reason fair">✅ Fair Decision</span>
                            </div>
                            <div class="decision-details">
                                <div><strong>Decision:</strong> Approved based on complete documentation and medical necessity</div>
                                <div><strong>Not Based On:</strong> Patient demographics, age, gender, or location</div>
                                <div><strong>Compliance:</strong> Meets all regulatory requirements for claim processing</div>
                                <div><strong>Processing Time:</strong> 2 days (within standard timeframe)</div>
                            </div>
                        </div>
                        <div class="decision-item">
                            <div class="decision-header">
                                <strong>Claim CLM002 - Denied</strong>
                                <span class="decision-reason fair">✅ Fair Decision</span>
                            </div>
                            <div class="decision-details">
                                <div><strong>Decision:</strong> Denied due to missing required documentation</div>
                                <div><strong>Not Based On:</strong> Patient demographics, insurance status, or medical history</div>
                                <div><strong>Compliance:</strong> Follows established guidelines for incomplete claims</div>
                                <div><strong>Processing Time:</strong> 7 days (extended due to follow-up requests)</div>
                                <div><strong>Next Steps:</strong> Patient can resubmit with complete documentation</div>
                            </div>
                        </div>
                        <div class="decision-item">
                            <div class="decision-header">
                                <strong>Claim CLM003 - Flagged</strong>
                                <span class="decision-reason fair">✅ Fair Decision</span>
                            </div>
                            <div class="decision-details">
                                <div><strong>Decision:</strong> Flagged for unusual billing pattern requiring investigation</div>
                                <div><strong>Not Based On:</strong> Patient identity or demographics</div>
                                <div><strong>Compliance:</strong> Standard fraud detection protocol applied equally to all claims</div>
                                <div><strong>Investigation:</strong> Independent review scheduled within 5 business days</div>
                                <div><strong>Patient Rights:</strong> Full access to investigation findings and appeal process</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="compliance-assurance">
                    <h3>Compliance Rule Adherence</h3>
                    <div class="compliance-metrics">
                        <div class="compliance-card">
                            <h4>Documentation Requirements</h4>
                            <div class="compliance-status good">✅ Met</div>
                            <p>All claims processed according to documentation standards</p>
                        </div>
                        <div class="compliance-card">
                            <h4>Processing Timeframes</h4>
                            <div class="compliance-status good">✅ Met</div>
                            <p>95% of claims processed within standard timeframe</p>
                        </div>
                        <div class="compliance-card">
                            <h4>Appeal Process</h4>
                            <div class="compliance-status good">✅ Met</div>
                            <p>All appeals reviewed within regulatory timeline</p>
                        </div>
                        <div class="compliance-card">
                            <h4>Anti-Discrimination Policy</h4>
                            <div class="compliance-status good">✅ Met</div>
                            <p>No demographic bias detected in claim decisions</p>
                        </div>
                    </div>
                </div>
                
                <div class="report-generation">
                    <h3>Personal Record Reports</h3>
                    <div class="report-options">
                        <div class="report-card">
                            <h4>Claim History Report</h4>
                            <p>Complete timeline of all your claims and decisions</p>
                            <div class="report-features">
                                <span>📊 Includes decision explanations</span>
                                <span>⚖️ Bias-free analysis</span>
                                <span>📋 Compliance verification</span>
                            </div>
                            <button class="btn btn-primary" onclick="generatePersonalReport('claims')">📥 Download PDF</button>
                        </div>
                        <div class="report-card">
                            <h4>Transparency Summary</h4>
                            <p>Annual summary of claim processing fairness and compliance</p>
                            <div class="report-features">
                                <span>📈 Processing statistics</span>
                                <span>🎯 Fairness metrics</span>
                                <span>🔍 Compliance audit results</span>
                            </div>
                            <button class="btn btn-primary" onclick="generatePersonalReport('transparency')">📥 Download PDF</button>
                        </div>
                        <div class="report-card">
                            <h4>Complete Record Export</h4>
                            <p>All your data in machine-readable format for personal records</p>
                            <div class="report-features">
                                <span>💾 CSV format</span>
                                <span>📄 JSON format</span>
                                <span>🔐 Encrypted download</span>
                            </div>
                            <button class="btn btn-primary" onclick="generatePersonalReport('complete')">📦 Download All Data</button>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="transparencyMetricsChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generatePreferencesContent() {
    return `
        <div class="preferences">
            <h2>Patient Preferences</h2>
            <div class="preferences-dashboard">
                <div class="notification-preferences">
                    <h3>Alert & Notification Settings</h3>
                    <div class="preference-grid">
                        <div class="preference-card">
                            <h4>Claim Status Updates</h4>
                            <select class="form-select">
                                <option>Real-time Alerts</option>
                                <option>Daily Summary</option>
                                <option>Weekly Digest</option>
                                <option>Monthly Report</option>
                            </select>
                            <p>Get notified when your claim status changes</p>
                        </div>
                        <div class="preference-card">
                            <h4>Appeal Notifications</h4>
                            <select class="form-select">
                                <option>Instant Notifications</option>
                                <option>Daily Updates</option>
                                <option>Resolution Only</option>
                            </select>
                            <p>Stay informed about appeal progress</p>
                        </div>
                        <div class="preference-card">
                            <h4>Fraud Alerts</h4>
                            <select class="form-select">
                                <option>Immediate Alerts</option>
                                <option>Daily Summary</option>
                                <option>High Priority Only</option>
                            </select>
                            <p>Quick response to suspicious activity</p>
                        </div>
                        <div class="preference-card">
                            <h4>Communication Method</h4>
                            <select class="form-select">
                                <option>Email + SMS</option>
                                <option>Email Only</option>
                                <option>SMS Only</option>
                                <option>Portal Only</option>
                            </select>
                            <p>Choose how you receive updates</p>
                        </div>
                    </div>
                </div>
                
                <div class="privacy-preferences">
                    <h3>Privacy & Security Settings</h3>
                    <div class="privacy-grid">
                        <div class="privacy-card">
                            <h4>Data Sharing Preferences</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <p>Share anonymized data for research</p>
                        </div>
                        <div class="privacy-card">
                            <h4>Two-Factor Authentication</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <p>Extra security for account access</p>
                        </div>
                        <div class="privacy-card">
                            <h4>Biometric Login</h4>
                            <label class="toggle-switch">
                                <input type="checkbox">
                                <span class="slider"></span>
                            </label>
                            <p>Use fingerprint or face recognition</p>
                        </div>
                        <div class="privacy-card">
                            <h4>Location Tracking</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <p>Monitor for unusual claim locations</p>
                        </div>
                    </div>
                </div>
                
                <div class="accessibility-preferences">
                    <h3>Accessibility Settings</h3>
                    <div class="accessibility-grid">
                        <div class="accessibility-card">
                            <h4>Text Size</h4>
                            <select class="form-select">
                                <option>Standard</option>
                                <option>Large</option>
                                <option>Extra Large</option>
                            </select>
                        </div>
                        <div class="accessibility-card">
                            <h4>High Contrast</h4>
                            <label class="toggle-switch">
                                <input type="checkbox">
                                <span class="slider"></span>
                            </label>
                            <p>Improve visibility for visual impairments</p>
                        </div>
                        <div class="accessibility-card">
                            <h4>Screen Reader Support</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <p>Optimized for assistive technologies</p>
                        </div>
                    </div>
                </div>
                
                <div class="preference-actions">
                    <button class="btn btn-primary" onclick="savePreferences()">💾 Save Preferences</button>
                    <button class="btn btn-secondary" onclick="resetPreferences()">🔄 Reset to Default</button>
                </div>
            </div>
        </div>
    `;
}

// Initialize Patient Charts
function initializePatientCharts() {
    // Patient Claims Overview Chart
    const claimsCtx = document.getElementById('patientClaimsChart');
    if (claimsCtx) {
        new Chart(claimsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Approved', 'Pending', 'Flagged', 'Denied'],
                datasets: [{
                    data: [8, 2, 2, 0],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b', 
                        '#ef4444',
                        '#6b7280'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Patient Monthly Trend Chart
    const trendCtx = document.getElementById('patientTrendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Claims Submitted',
                    data: [2, 1, 3, 2, 4, 2],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Claims Approved',
                    data: [2, 1, 2, 2, 3, 1],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// Patient Dashboard Functions
function dismissFraudAlerts() {
    const alertsContainer = document.getElementById('patientFraudAlerts');
    if (alertsContainer) {
        alertsContainer.style.display = 'none';
        showNotification('Alerts Dismissed', 'All fraud protection alerts have been dismissed', 'success');
    }
}

function reviewSuspiciousActivity() {
    showModal('Review Suspicious Activity', `
        <div class="activity-review">
            <div class="review-header">
                <h5>Suspicious Activity Review</h5>
                <span class="review-date">Detected: 2024-01-20 14:30</span>
            </div>
            <div class="activity-details">
                <div class="detail-item">
                    <span class="detail-label">Activity Type:</span>
                    <span class="detail-value">Multiple high-value claims</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Claims Affected:</span>
                    <span class="detail-value">CLM-2024-010, CLM-2024-011</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">$3,700.00</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Time Frame:</span>
                    <span class="detail-value">Within 24 hours</span>
                </div>
            </div>
            <div class="review-actions">
                <h6>Recommended Actions:</h6>
                <ul>
                    <li>Verify these claims with your healthcare providers</li>
                    <li>Check if you authorized these submissions</li>
                    <li>Contact support if you did not submit these claims</li>
                </ul>
            </div>
        </div>
    `, 'I Understand');
}

function verifyIdentity() {
    showModal('Identity Verification', `
        <div class="identity-verification">
            <div class="verification-header">
                <h5>Verify Your Identity</h5>
                <p>Please complete the verification process to secure your account</p>
            </div>
            <div class="verification-steps">
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h6>Upload ID Document</h6>
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" class="form-control">
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h6>Verify Phone Number</h6>
                        <input type="tel" placeholder="Enter your phone number" class="form-control">
                        <button class="btn btn-sm btn-secondary">Send Code</button>
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h6>Enter Verification Code</h6>
                        <input type="text" placeholder="Enter 6-digit code" class="form-control">
                    </div>
                </div>
            </div>
        </div>
    `, 'Complete Verification');
}

function filterPatientClaims() {
    const dateFilter = document.getElementById('dateFilter').value;
    const providerFilter = document.getElementById('providerFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const statusElement = item.querySelector('.timeline-status');
        const providerElement = item.querySelector('.timeline-provider');
        const dateElement = item.querySelector('.timeline-date');
        
        if (!statusElement || !providerElement || !dateElement) return;
        
        const status = statusElement.textContent.toLowerCase();
        const provider = providerElement.textContent.toLowerCase();
        const date = dateElement.textContent;
        
        let showItem = true;
        
        if (statusFilter && status !== statusFilter.toLowerCase()) showItem = false;
        if (providerFilter && !provider.includes(providerFilter.toLowerCase())) showItem = false;
        if (dateFilter && date !== dateFilter) showItem = false;
        
        item.style.display = showItem ? '' : 'none';
    });
}

function fileNewAppeal() {
    showModal('File New Appeal', `
        <div class="appeal-form">
            <div class="form-group">
                <label>Claim ID *</label>
                <input type="text" placeholder="Enter claim ID" required>
            </div>
            <div class="form-group">
                <label>Appeal Reason *</label>
                <select required>
                    <option value="">Select Reason</option>
                    <option value="missing-docs">Missing Documentation</option>
                    <option value="coding-error">Coding Error</option>
                    <option value="medical-necessity">Medical Necessity</option>
                    <option value="coverage-issue">Coverage Issue</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Detailed Explanation *</label>
                <textarea rows="4" placeholder="Explain why you are appealing this claim..." required></textarea>
            </div>
            <div class="form-group">
                <label>Supporting Documents</label>
                <input type="file" multiple accept=".pdf,.jpg,.png,.doc">
            </div>
        </div>
    `, 'Submit Appeal');
}

function viewAppealDetails(appealId) {
    showModal('Appeal Details', `
        <div class="appeal-details-modal">
            <div class="appeal-header">
                <h5>Appeal ${appealId}</h5>
                <span class="appeal-status status-badge pending">Under Review</span>
            </div>
            <div class="appeal-info">
                <div class="info-item">
                    <span class="info-label">Original Claim:</span>
                    <span class="info-value">CLM-2024-010</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date Submitted:</span>
                    <span class="info-value">2024-01-16</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Reason for Appeal:</span>
                    <span class="info-value">Missing Documentation</span>
                </div>
            </div>
            <div class="appeal-timeline-modal">
                <h6>Appeal Progress</h6>
                <div class="timeline-steps">
                    <div class="step completed">
                        <div class="step-dot"></div>
                        <span class="step-title">Submitted</span>
                        <span class="step-date">2024-01-16</span>
                    </div>
                    <div class="step active">
                        <div class="step-dot"></div>
                        <span class="step-title">Under Review</span>
                        <span class="step-date">In Progress</span>
                    </div>
                    <div class="step">
                        <div class="step-dot"></div>
                        <span class="step-title">Decision</span>
                        <span class="step-date">Pending</span>
                    </div>
                </div>
            </div>
        </div>
    `, 'Close');
}

function uploadAppealDocument(appealId) {
    showModal('Upload Document', `
        <div class="document-upload">
            <div class="upload-header">
                <h5>Upload Supporting Document</h5>
                <p>Appeal: ${appealId}</p>
            </div>
            <div class="upload-form">
                <div class="form-group">
                    <label>Document Type *</label>
                    <select required>
                        <option value="">Select Type</option>
                        <option value="medical-record">Medical Record</option>
                        <option value="prescription">Prescription</option>
                        <option value="lab-result">Lab Result</option>
                        <option value="imaging">Imaging Report</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Document File *</label>
                    <input type="file" accept=".pdf,.jpg,.png,.doc" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea rows="3" placeholder="Describe what this document proves..."></textarea>
                </div>
            </div>
        </div>
    `, 'Upload Document');
}

function downloadAppealDecision(appealId) {
    showNotification('Download Started', `Downloading appeal decision for ${appealId}`, 'info');
}

function reportFraud() {
    showModal('Report Fraud', `
        <div class="fraud-report">
            <div class="report-header">
                <h5>Report Fraudulent Activity</h5>
                <p>Please provide details about the suspected fraud</p>
            </div>
            <div class="report-form">
                <div class="form-group">
                    <label>Type of Fraud *</label>
                    <select required>
                        <option value="">Select Type</option>
                        <option value="identity-theft">Identity Theft</option>
                        <option value="false-claims">False Claims</option>
                        <option value="provider-fraud">Provider Fraud</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Detailed Description *</label>
                    <textarea rows="4" placeholder="Describe the fraudulent activity..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Supporting Evidence</label>
                    <input type="file" multiple accept=".pdf,.jpg,.png,.doc">
                </div>
                <div class="form-group">
                    <label>Contact Preference</label>
                    <select>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="secure-message">Secure Message</option>
                    </select>
                </div>
            </div>
        </div>
    `, 'Submit Report');
}

function contactProvider() {
    showModal('Contact Provider', `
        <div class="provider-contact">
            <div class="contact-header">
                <h5>Contact Your Healthcare Provider</h5>
                <p>Reach out to verify recent claim submissions</p>
            </div>
            <div class="provider-list">
                <div class="provider-item">
                    <div class="provider-info">
                        <h6>Dr. Smith - Cardiology</h6>
                        <span class="provider-phone">Phone: (555) 123-4567</span>
                        <span class="provider-email">Email: drsmith@clinic.com</span>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="initiateContact('Dr. Smith')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                </div>
                <div class="provider-item">
                    <div class="provider-info">
                        <h6>Dr. Johnson - General Practice</h6>
                        <span class="provider-phone">Phone: (555) 234-5678</span>
                        <span class="provider-email">Email: drjohnson@clinic.com</span>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="initiateContact('Dr. Johnson')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                </div>
                <div class="provider-item">
                    <div class="provider-info">
                        <h6>Dr. Williams - Orthopedics</h6>
                        <span class="provider-phone">Phone: (555) 345-6789</span>
                        <span class="provider-email">Email: drwilliams@clinic.com</span>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="initiateContact('Dr. Williams')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                </div>
            </div>
        </div>
    `, 'Close');
}

function initiateContact(providerName) {
    showNotification('Contact Initiated', `Contact information for ${providerName} has been sent to your email`, 'success');
}

function submitVerification() {
    showModal('Submit Verification Documents', `
        <div class="verification-submit">
            <div class="submit-header">
                <h5>Submit Identity Verification</h5>
                <p>Upload documents to verify your identity</p>
            </div>
            <div class="verification-form">
                <div class="form-group">
                    <label>Government ID *</label>
                    <input type="file" accept=".pdf,.jpg,.png" required>
                    <small>Driver's license, passport, or state ID</small>
                </div>
                <div class="form-group">
                    <label>Proof of Address *</label>
                    <input type="file" accept=".pdf,.jpg,.png" required>
                    <small>Utility bill, bank statement, or lease agreement</small>
                </div>
                <div class="form-group">
                    <label>Selfie Photo *</label>
                    <input type="file" accept=".jpg,.png" required>
                    <small>Clear photo of yourself holding your ID</small>
                </div>
                <div class="form-group">
                    <label>Additional Notes</label>
                    <textarea rows="3" placeholder="Any additional information..."></textarea>
                </div>
            </div>
        </div>
    `, 'Submit Verification');
}

function openSecureMessage() {
    showModal('Secure Message', `
        <div class="secure-message">
            <div class="message-header">
                <h5>Send Secure Message to Investigators</h5>
                <div class="security-indicator">
                    <i class="fas fa-lock"></i>
                    <span>End-to-End Encrypted</span>
                </div>
            </div>
            <div class="message-form">
                <div class="form-group">
                    <label>Subject *</label>
                    <input type="text" placeholder="Enter message subject" required>
                </div>
                <div class="form-group">
                    <label>Message *</label>
                    <textarea rows="6" placeholder="Describe your concerns about potential fraud..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select>
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Attachments</label>
                    <input type="file" multiple accept=".pdf,.jpg,.png,.doc">
                </div>
            </div>
        </div>
    `, 'Send Secure Message');
}

function contactSupport() {
    showModal('Contact Support', `
        <div class="support-contact">
            <div class="support-header">
                <h5>Fraud Protection Support</h5>
                <p>Get help with account security and fraud concerns</p>
            </div>
            <div class="support-options">
                <div class="support-option">
                    <div class="option-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="option-content">
                        <h6>Phone Support</h6>
                        <span>1-800-FRAUD-HELP</span>
                        <span>Available 24/7</span>
                    </div>
                </div>
                <div class="support-option">
                    <div class="option-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="option-content">
                        <h6>Live Chat</h6>
                        <button class="btn btn-sm btn-primary">Start Chat</button>
                    </div>
                </div>
                <div class="support-option">
                    <div class="option-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="option-content">
                        <h6>Email Support</h6>
                        <span>fraud-support@kmed.com</span>
                        <span>Response within 24 hours</span>
                    </div>
                </div>
            </div>
        </div>
    `, 'Close');
}

function generateTransparencyReport() {
    showNotification('Report Generated', 'Transparency report has been generated and is ready for download', 'success');
}

function exportClaimsReport() {
    showNotification('Export Started', 'Your claims report is being generated and will be downloaded shortly', 'info');
}

function exportTransparencySummary() {
    showNotification('Export Started', 'Transparency summary is being exported to PDF format', 'info');
}

function exportAppealHistory() {
    showNotification('Export Started', 'Your appeal history is being exported to PDF format', 'info');
}
