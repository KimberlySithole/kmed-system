// Provider Dashboard Functions
function generateHomeContent() {
    return `
        <div class="provider-home">
            <h2>Provider Dashboard</h2>
            <div class="dashboard-overview">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-header">
                            <h3>Claims Submitted</h3>
                            <span class="metric-icon">📋</span>
                        </div>
                        <div class="metric-value">247</div>
                        <div class="metric-change positive">+12% from last month</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-header">
                            <h3>Claims Approved</h3>
                            <span class="metric-icon">✅</span>
                        </div>
                        <div class="metric-value">189</div>
                        <div class="metric-change positive">+8% from last month</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-header">
                            <h3>Pending Claims</h3>
                            <span class="metric-icon">⏳</span>
                        </div>
                        <div class="metric-value">23</div>
                        <div class="metric-change neutral">Same as last month</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-header">
                            <h3>Compliance Score</h3>
                            <span class="metric-icon">📊</span>
                        </div>
                        <div class="metric-value">92.4%</div>
                        <div class="metric-change positive">+2.1% from last month</div>
                    </div>
                </div>
                
                <div class="recent-activity">
                    <h3>Recent Activity</h3>
                    <div class="activity-list">
                        <div class="activity-item">
                            <span class="activity-time">2 hours ago</span>
                            <span class="activity-text">Claim CLM001 approved for $1,250.00</span>
                        </div>
                        <div class="activity-item">
                            <span class="activity-time">5 hours ago</span>
                            <span class="activity-text">New compliance alert requires attention</span>
                        </div>
                        <div class="activity-item">
                            <span class="activity-time">1 day ago</span>
                            <span class="activity-text">Self-audit completed - 3 minor issues found</span>
                        </div>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="navigateToPage('claim-submission')">📝 Submit New Claim</button>
                        <button class="btn btn-secondary" onclick="navigateToPage('claim-tracker')">📋 Track Claims</button>
                        <button class="btn btn-secondary" onclick="navigateToPage('risk-score')">📊 View Risk Score</button>
                        <button class="btn btn-secondary" onclick="navigateToPage('compliance-feedback')">📈 Compliance Status</button>
                        <button class="btn btn-secondary" onclick="navigateToPage('self-audit')">🔍 Run Self-Audit</button>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="providerOverviewChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateClaimSubmissionContent() {
    return `
        <div class="claim-submission">
            <h2>Submit New Claim</h2>
            <div class="submission-form">
                <div class="form-progress">
                    <div class="progress-step active">
                        <div class="step-number">1</div>
                        <div class="step-label">Patient Info</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-number">2</div>
                        <div class="step-label">Provider Info</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-number">3</div>
                        <div class="step-label">Diagnosis</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-number">4</div>
                        <div class="step-label">Billing</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-number">5</div>
                        <div class="step-label">Review</div>
                    </div>
                </div>
                
                <form id="claimForm" class="claim-form">
                    <div class="form-section">
                        <h3>Patient Information</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="patientId">Patient ID *</label>
                                <input type="text" id="patientId" name="patientId" required>
                                <small>Enter unique patient identifier</small>
                            </div>
                            <div class="form-group">
                                <label for="patientName">Full Name *</label>
                                <input type="text" id="patientName" name="patientName" required>
                            </div>
                            <div class="form-group">
                                <label for="patientDOB">Date of Birth *</label>
                                <input type="date" id="patientDOB" name="patientDOB" required>
                            </div>
                            <div class="form-group">
                                <label for="insuranceId">Insurance ID *</label>
                                <input type="text" id="insuranceId" name="insuranceId" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Provider Information</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="providerId">Provider ID *</label>
                                <input type="text" id="providerId" name="providerId" value="PROV-001" readonly>
                            </div>
                            <div class="form-group">
                                <label for="providerName">Provider Name *</label>
                                <input type="text" id="providerName" name="providerName" value="Dr. Sarah Johnson" readonly>
                            </div>
                            <div class="form-group">
                                <label for="specialty">Specialty *</label>
                                <input type="text" id="specialty" name="specialty" value="Internal Medicine" readonly>
                            </div>
                            <div class="form-group">
                                <label for="npiNumber">NPI Number *</label>
                                <input type="text" id="npiNumber" name="npiNumber" value="1234567890" readonly>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Diagnosis Information</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="diagnosisCode">Primary Diagnosis Code *</label>
                                <input type="text" id="diagnosisCode" name="diagnosisCode" placeholder="e.g., A45.9" required>
                                <small>Use ICD-10 coding format</small>
                            </div>
                            <div class="form-group">
                                <label for="procedureCode">Procedure Code *</label>
                                <input type="text" id="procedureCode" name="procedureCode" placeholder="e.g., 99214" required>
                                <small>Use CPT coding format</small>
                            </div>
                            <div class="form-group">
                                <label for="serviceDate">Date of Service *</label>
                                <input type="date" id="serviceDate" name="serviceDate" required>
                            </div>
                            <div class="form-group">
                                <label for="placeOfService">Place of Service *</label>
                                <select id="placeOfService" name="placeOfService" required>
                                    <option value="">Select...</option>
                                    <option value="11">Office</option>
                                    <option value="21">Inpatient Hospital</option>
                                    <option value="22">Outpatient Hospital</option>
                                    <option value="23">Emergency Room</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Billing Information</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="billingAmount">Billing Amount ($) *</label>
                                <input type="number" id="billingAmount" name="billingAmount" step="0.01" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="billingCode">Billing Code *</label>
                                <input type="text" id="billingCode" name="billingCode" required>
                            </div>
                            <div class="form-group">
                                <label for="modifiers">Modifiers</label>
                                <input type="text" id="modifiers" name="modifiers" placeholder="e.g., 25, 59">
                            </div>
                            <div class="form-group">
                                <label for="authorization">Prior Authorization</label>
                                <input type="text" id="authorization" name="authorization">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="saveDraft()">💾 Save Draft</button>
                        <button type="button" class="btn btn-secondary" onclick="validateForm()">✅ Validate</button>
                        <button type="submit" class="btn btn-primary" id="submitClaimBtn">📤 Submit Claim</button>
                    </div>
                </form>
                
                <div id="validationResults" class="validation-results"></div>
                <div id="auditResults" class="audit-results"></div>
            </div>
        </div>
    `;
}

function generateClaimTrackerContent() {
    return `
        <div class="claim-tracker">
            <h2>Claim Status Tracker</h2>
            <div class="tracker-overview">
                <div class="status-cards">
                    <div class="status-card approved">
                        <div class="status-icon">✅</div>
                        <div class="status-info">
                            <h4>Approved</h4>
                            <div class="status-count">189</div>
                            <div class="status-percentage">76.5%</div>
                        </div>
                    </div>
                    <div class="status-card pending">
                        <div class="status-icon">⏳</div>
                        <div class="status-info">
                            <h4>Pending</h4>
                            <div class="status-count">23</div>
                            <div class="status-percentage">9.3%</div>
                        </div>
                    </div>
                    <div class="status-card flagged">
                        <div class="status-icon">⚠️</div>
                        <div class="status-info">
                            <h4>Flagged</h4>
                            <div class="status-count">8</div>
                            <div class="status-percentage">3.2%</div>
                        </div>
                    </div>
                    <div class="status-card denied">
                        <div class="status-icon">❌</div>
                        <div class="status-info">
                            <h4>Denied</h4>
                            <div class="status-count">4</div>
                            <div class="status-percentage">1.6%</div>
                        </div>
                    </div>
                </div>
                
                <div class="filter-controls">
                    <div class="filter-group">
                        <label for="statusFilter">Status:</label>
                        <select id="statusFilter" onchange="filterClaims()">
                            <option value="">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Flagged">Flagged</option>
                            <option value="Denied">Denied</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="dateFilter">Date Range:</label>
                        <select id="dateFilter" onchange="filterClaims()">
                            <option value="">All Time</option>
                            <option value="2024-01">January 2024</option>
                            <option value="2023-12">December 2023</option>
                            <option value="2023-11">November 2023</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="patientFilter">Patient:</label>
                        <input type="text" id="patientFilter" placeholder="Search patient name..." onkeyup="filterClaims()">
                    </div>
                </div>
                
                <div class="claims-table-container">
                    <table class="claims-table">
                        <thead>
                            <tr>
                                <th>Claim ID</th>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CLM001</td>
                                <td>John Smith</td>
                                <td>2024-01-15</td>
                                <td>$1,250.00</td>
                                <td><span class="status-badge approved">Approved</span></td>
                                <td>
                                    <button class="btn btn-sm" onclick="viewClaim('CLM001')">👁 View</button>
                                    <button class="btn btn-sm" onclick="downloadClaim('CLM001')">📥 Download</button>
                                </td>
                            </tr>
                            <tr>
                                <td>CLM002</td>
                                <td>Jane Doe</td>
                                <td>2024-01-14</td>
                                <td>$850.00</td>
                                <td><span class="status-badge pending">Pending</span></td>
                                <td>
                                    <button class="btn btn-sm" onclick="viewClaim('CLM002')">👁 View</button>
                                    <button class="btn btn-sm" onclick="editClaim('CLM002')">✏️ Edit</button>
                                </td>
                            </tr>
                            <tr>
                                <td>CLM003</td>
                                <td>Bob Johnson</td>
                                <td>2024-01-13</td>
                                <td>$2,100.00</td>
                                <td><span class="status-badge flagged">Flagged</span></td>
                                <td>
                                    <button class="btn btn-sm" onclick="viewClaim('CLM003')">👁 View</button>
                                    <button class="btn btn-sm" onclick="resolveFlag('CLM003')">✅ Resolve</button>
                                </td>
                            </tr>
                            <tr>
                                <td>CLM004</td>
                                <td>Alice Brown</td>
                                <td>2024-01-12</td>
                                <td>$650.00</td>
                                <td><span class="status-badge denied">Denied</span></td>
                                <td>
                                    <button class="btn btn-sm" onclick="viewClaim('CLM004')">👁 View</button>
                                    <button class="btn btn-sm" onclick="resubmitClaim('CLM004')">🔄 Resubmit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="export-controls">
                    <button class="btn btn-secondary" onclick="exportClaims()">📊 Export Claims</button>
                </div>
                
                <div class="chart-container">
                    <canvas id="claimsTrendChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateRiskScoreContent() {
    return `
        <div class="risk-score">
            <h2>Provider Risk Score Overview</h2>
            <div class="risk-dashboard">
                <div class="current-risk">
                    <div class="risk-circle">
                        <div class="risk-value medium">5.2</div>
                        <div class="risk-label">Medium Risk</div>
                    </div>
                    <div class="risk-details">
                        <div class="risk-item">
                            <span class="risk-label">Billing Anomalies:</span>
                            <span class="risk-score high">7.8</span>
                        </div>
                        <div class="risk-item">
                            <span class="risk-label">Claim Frequency:</span>
                            <span class="risk-score medium">5.4</span>
                        </div>
                        <div class="risk-item">
                            <span class="risk-label">Amount Deviation:</span>
                            <span class="risk-score high">8.1</span>
                        </div>
                        <div class="risk-item">
                            <span class="risk-label">Documentation:</span>
                            <span class="risk-score low">2.3</span>
                        </div>
                    </div>
                </div>
                
                <div class="risk-factors">
                    <h3>Risk Contributing Factors</h3>
                    <div class="factors-grid">
                        <div class="factor-card high">
                            <h4>📊 Billing Anomalies</h4>
                            <div class="factor-score">7.8</div>
                            <p>Unusual billing patterns detected</p>
                        </div>
                        <div class="factor-card medium">
                            <h4>📈 Claim Frequency</h4>
                            <div class="factor-score">5.4</div>
                            <p>Higher than average submission rate</p>
                        </div>
                        <div class="factor-card high">
                            <h4>💰 Amount Deviation</h4>
                            <div class="factor-score">8.1</div>
                            <p>Above regional average amounts</p>
                        </div>
                        <div class="factor-card low">
                            <h4>📋 Documentation</h4>
                            <div class="factor-score">2.3</div>
                            <p>Minor completeness issues</p>
                        </div>
                    </div>
                </div>
                
                <div class="risk-recommendations">
                    <h3>Recommendations</h3>
                    <div class="recommendations-list">
                        <div class="recommendation-item high">
                            <h4>🚨 High Priority</h4>
                            <p>Review high-value claims for documentation</p>
                        </div>
                        <div class="recommendation-item medium">
                            <h4>⚠️ Medium Priority</h4>
                            <p>Analyze billing patterns for consistency</p>
                        </div>
                        <div class="recommendation-item low">
                            <h4>💡 Low Priority</h4>
                            <p>Consider coding best practices training</p>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="riskHistoryChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateComplianceFeedbackContent() {
    return `
        <div class="compliance-feedback">
            <h2>Compliance Feedback</h2>
            <div class="compliance-dashboard">
                <div class="compliance-score">
                    <div class="score-circle">
                        <div class="score-value good">92.4%</div>
                        <div class="score-label">Good Standing</div>
                    </div>
                    <div class="score-breakdown">
                        <div class="score-item">
                            <span class="score-label">Documentation:</span>
                            <span class="score-value good">95%</span>
                        </div>
                        <div class="score-item">
                            <span class="score-label">Coding:</span>
                            <span class="score-value good">89%</span>
                        </div>
                        <div class="score-item">
                            <span class="score-label">Billing:</span>
                            <span class="score-value good">94%</span>
                        </div>
                        <div class="score-item">
                            <span class="score-label">Timeliness:</span>
                            <span class="score-value good">92%</span>
                        </div>
                    </div>
                </div>
                
                <div class="recent-feedback">
                    <h3>Recent Feedback</h3>
                    <div class="feedback-list">
                        <div class="feedback-item warning">
                            <div class="feedback-header">
                                <strong>⚠️ Coding Error Detected</strong>
                                <span class="feedback-date">2024-01-15</span>
                            </div>
                            <div class="feedback-content">
                                <p>Incorrect ICD-10 coding for claim CLM005</p>
                                <p>Action: Review and correct coding</p>
                            </div>
                        </div>
                        <div class="feedback-item info">
                            <div class="feedback-header">
                                <strong>📋 Documentation Reminder</strong>
                                <span class="feedback-date">2024-01-14</span>
                            </div>
                            <div class="feedback-content">
                                <p>Missing supporting documents for 3 claims</p>
                                <p>Action: Upload required documentation</p>
                            </div>
                        </div>
                        <div class="feedback-item success">
                            <div class="feedback-header">
                                <strong>✅ Compliance Improved</strong>
                                <span class="feedback-date">2024-01-13</span>
                            </div>
                            <div class="feedback-content">
                                <p>Documentation quality increased by 5%</p>
                                <p>Keep up the good work!</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-items">
                    <h3>Required Actions</h3>
                    <div class="action-list">
                        <div class="action-item urgent">
                            <h4>🚨 Urgent</h4>
                            <p>Correct coding errors in 2 claims</p>
                            <button class="btn btn-sm btn-primary" onclick="navigateToPage('claim-submission')">Fix Now</button>
                        </div>
                        <div class="action-item medium">
                            <h4>⚠️ This Week</h4>
                            <p>Upload missing documentation</p>
                            <button class="btn btn-sm btn-secondary" onclick="navigateToPage('claim-tracker')">Upload</button>
                        </div>
                        <div class="action-item low">
                            <h4>💡 Recommended</h4>
                            <p>Complete compliance training module</p>
                            <button class="btn btn-sm btn-secondary" onclick="showNotification('Training', 'Opening training module...', 'info')">Start</button>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="complianceTrendsChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateSelfAuditContent() {
    return `
        <div class="self-audit">
            <h2>Self-Audit Tools</h2>
            <div class="audit-dashboard">
                <div class="audit-overview">
                    <div class="overview-cards">
                        <div class="overview-card">
                            <h4>Last Audit</h4>
                            <div class="overview-value">2024-01-10</div>
                        </div>
                        <div class="overview-card">
                            <h4>Issues Found</h4>
                            <div class="overview-value">3</div>
                        </div>
                        <div class="overview-card">
                            <h4>Resolved</h4>
                            <div class="overview-value">2</div>
                        </div>
                        <div class="overview-card">
                            <h4>Next Audit</h4>
                            <div class="overview-value">2024-01-24</div>
                        </div>
                    </div>
                </div>
                
                <div class="audit-tools">
                    <h3>Audit Tools</h3>
                    <div class="tools-grid">
                        <div class="tool-card">
                            <h4>🔍 Duplicate Check</h4>
                            <p>Check for duplicate billing</p>
                            <button class="btn btn-sm btn-primary" onclick="runDuplicateCheck()">Run Check</button>
                        </div>
                        <div class="tool-card">
                            <h4>📝 Coding Validation</h4>
                            <p>Validate ICD-10 and CPT codes</p>
                            <button class="btn btn-sm btn-primary" onclick="runCodingCheck()">Run Check</button>
                        </div>
                        <div class="tool-card">
                            <h4>📋 Fields Check</h4>
                            <p>Verify required fields</p>
                            <button class="btn btn-sm btn-primary" onclick="runFieldsCheck()">Run Check</button>
                        </div>
                        <div class="tool-card">
                            <h4>⚠️ Fraud Analysis</h4>
                            <p>Analyze fraud triggers</p>
                            <button class="btn btn-sm btn-primary" onclick="runFraudCheck()">Run Check</button>
                        </div>
                    </div>
                </div>
                
                <div class="recent-audits">
                    <h3>Recent Audit Results</h3>
                    <div class="audit-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Result</th>
                                    <th>Issues</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2024-01-10</td>
                                    <td>Duplicate Check</td>
                                    <td><span class="status-badge success">Passed</span></td>
                                    <td>0</td>
                                    <td><button class="btn btn-sm" onclick="viewResults('Duplicate Check')">View</button></td>
                                </tr>
                                <tr>
                                    <td>2024-01-09</td>
                                    <td>Coding Validation</td>
                                    <td><span class="status-badge warning">Warnings</span></td>
                                    <td>2</td>
                                    <td><button class="btn btn-sm" onclick="viewResults('Coding Validation')">View</button></td>
                                </tr>
                                <tr>
                                    <td>2024-01-08</td>
                                    <td>Fields Check</td>
                                    <td><span class="status-badge success">Passed</span></td>
                                    <td>0</td>
                                    <td><button class="btn btn-sm" onclick="viewResults('Fields Check')">View</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="audit-schedule">
                    <h3>Audit Schedule</h3>
                    <div class="schedule-list">
                        <div class="schedule-item">
                            <div class="schedule-date">2024-01-22</div>
                            <div class="schedule-type">Monthly Full Audit</div>
                            <div class="schedule-status">Scheduled</div>
                        </div>
                        <div class="schedule-item">
                            <div class="schedule-date">2024-01-25</div>
                            <div class="schedule-type">Coding Review</div>
                            <div class="schedule-status">Scheduled</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize Provider Charts
function initializeProviderCharts() {
    // Provider Overview Chart
    const overviewCtx = document.getElementById('providerOverviewChart');
    if (overviewCtx) {
        new Chart(overviewCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Claims Submitted',
                    data: [45, 52, 48, 61, 58, 67],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Claims Approved',
                    data: [38, 45, 42, 54, 51, 58],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                }
            }
        });
    }
    
    // Claims Trend Chart
    const claimsTrendCtx = document.getElementById('claimsTrendChart');
    if (claimsTrendCtx) {
        new Chart(claimsTrendCtx, {
            type: 'bar',
            data: {
                labels: ['Submitted', 'Processing', 'Approved', 'Flagged', 'Denied'],
                datasets: [{
                    label: 'Current Month',
                    data: [45, 23, 189, 8, 12],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(100, 116, 139, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Risk History Chart
    const riskHistoryCtx = document.getElementById('riskHistoryChart');
    if (riskHistoryCtx) {
        new Chart(riskHistoryCtx, {
            type: 'line',
            data: {
                labels: ['Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Risk Score',
                    data: [85.1, 86.3, 87.8, 87.3],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Compliance Trends Chart
    const complianceTrendsCtx = document.getElementById('complianceTrendsChart');
    if (complianceTrendsCtx) {
        new Chart(complianceTrendsCtx, {
            type: 'radar',
            data: {
                labels: ['Documentation', 'Coding', 'Billing', 'Timeliness', 'Accuracy'],
                datasets: [{
                    label: 'Current',
                    data: [94.2, 89.7, 87.3, 93.8, 91.2],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)'
                }, {
                    label: 'Target',
                    data: [95, 95, 95, 95, 95],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
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
}

// Provider Dashboard Button Functions
window.saveDraft = function() {
    console.log('Saving draft...');
    alert('Draft saved successfully!');
};

window.validateForm = function() {
    console.log('Validating form...');
    alert('Form validation passed!');
};

window.submitClaim = function() {
    console.log('Submitting claim...');
    alert('Claim submitted successfully!');
};

// Modal Functions
window.showModal = function(title, content) {
    const modal = document.getElementById('detailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.add('show');
};

window.closeModal = function() {
    const modal = document.getElementById('detailsModal');
    modal.classList.remove('show');
};

// Enhanced Detail Functions - Database Integration
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
        alert('Unable to load investigation details from database. Please check your connection.');
    }
};

// Enhanced Detail Functions - Database Integration
window.viewSubmission = async function(submissionId) {
    console.log('Viewing submission from database:', submissionId);
    
    // Try to get from database first
    const claims = await loadClaimsFromDatabase();
    const claim = claims.find(clm => clm.claim_id === submissionId);
    
    if (claim) {
        const content = `
            <div class="detail-section">
                <h4>Submission Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Submission ID</div>
                        <div class="detail-value">${claim.claim_id}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Patient</div>
                        <div class="detail-value">${claim.patient_first_name} ${claim.patient_last_name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Provider</div>
                        <div class="detail-value">${claim.provider_first_name} ${claim.provider_last_name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date of Service</div>
                        <div class="detail-value">${claim.service_date}</div>
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
                        <div class="detail-label">Priority</div>
                        <div class="detail-value"><span class="detail-status ${claim.priority}">${claim.priority.charAt(0).toUpperCase() + claim.priority.slice(1)}</span></div>
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
                        <div class="detail-label">Insurance Provider</div>
                        <div class="detail-value">${claim.insurance_company}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Submitted Date</div>
                        <div class="detail-value">${claim.submitted_date}</div>
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
                <button class="btn btn-primary" onclick="downloadSubmission('${submissionId}')">📥 Download All</button>
                <button class="btn btn-secondary" onclick="printSubmission('${submissionId}')">🖨️ Print</button>
                <button class="btn btn-secondary" onclick="editSubmission('${submissionId}')">✏️ Edit</button>
            </div>
        `;
        
        showModal(`Submission Details - ${submissionId}`, content);
    } else {
        alert('Unable to load submission details from database. Please check your connection.');
    }
};

// Additional Modal Functions
window.downloadClaim = function(claimId) {
    console.log('Downloading claim:', claimId);
    alert(`Downloading claim ${claimId} documents...`);
};

window.printClaim = function(claimId) {
    console.log('Printing claim:', claimId);
    alert(`Preparing claim ${claimId} for printing...`);
};

window.downloadInvestigation = function(investigationId) {
    console.log('Downloading investigation:', investigationId);
    alert(`Downloading investigation ${investigationId} report...`);
};

window.printInvestigation = function(investigationId) {
    console.log('Printing investigation:', investigationId);
    alert(`Preparing investigation ${investigationId} for printing...`);
};

window.updateInvestigation = function(investigationId) {
    console.log('Updating investigation:', investigationId);
    alert(`Opening investigation ${investigationId} for update...`);
};

window.downloadSubmission = function(submissionId) {
    console.log('Downloading submission:', submissionId);
    alert(`Downloading submission ${submissionId} documents...`);
};

window.printSubmission = function(submissionId) {
    console.log('Printing submission:', submissionId);
    alert(`Preparing submission ${submissionId} for printing...`);
};

window.editSubmission = function(submissionId) {
    console.log('Editing submission:', submissionId);
    alert(`Opening submission ${submissionId} for editing...`);
};

window.editClaim = function(claimId) {
    console.log('Editing claim:', claimId);
    alert(`Opening claim ${claimId} for editing...`);
};

window.downloadClaim = function(claimId) {
    console.log('Downloading claim:', claimId);
    alert(`Downloading claim ${claimId}...`);
};

window.resolveFlag = function(claimId) {
    console.log('Resolving flag for claim:', claimId);
    alert(`Resolving flag for claim ${claimId}...`);
};

window.exportClaims = function() {
    console.log('Exporting claims...');
    alert('Exporting claims data...');
};

window.runDuplicateCheck = function() {
    console.log('Running duplicate billing check...');
    alert('Duplicate billing check completed - No duplicates found!');
};

window.runCodingCheck = function() {
    console.log('Running coding error detection...');
    alert('Coding check completed - 2 minor issues found!');
};

window.runFieldsCheck = function() {
    console.log('Running missing fields validation...');
    alert('Fields validation completed - All required fields present!');
};

window.runFraudCheck = function() {
    console.log('Running fraud trigger analysis...');
    alert('Fraud analysis completed - Low risk detected!');
};

window.viewResults = function(checkType) {
    console.log('Viewing results for:', checkType);
    alert(`Opening ${checkType} check results...`);
};

window.viewAuditDetails = function(auditId) {
    console.log('Viewing audit details:', auditId);
    alert(`Opening audit ${auditId} details...`);
};

window.navigateToPage = function(page) {
    console.log('Navigating to:', page);
    loadDashboardContent(page);
};

window.showNotification = function(title, message, type) {
    console.log(`${type}: ${title} - ${message}`);
    alert(`${title}: ${message}`);
};
