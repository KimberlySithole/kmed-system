// Admin Dashboard Functions

// Content Generation Functions
function generateAccessControlContent() {
    return `
        <div class="access-control">
            <h2>Access Control</h2>
            <div class="user-management">
                <h3>User Permissions</h3>
                <div class="permissions-table">
                    <div class="user-row">
                        <div class="user-info">
                            <strong>John Analyst</strong>
                            <span class="role-badge">analyst</span>
                        </div>
                        <div class="user-actions">
                            <button class="btn btn-sm">Edit</button>
                            <button class="btn btn-sm btn-danger">Remove</button>
                        </div>
                    </div>
                    <div class="user-row">
                        <div class="user-info">
                            <strong>Sarah Investigator</strong>
                            <span class="role-badge">investigator</span>
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
                        <strong>John Analyst</strong>
                        <span class="status-badge active">active</span>
                    </div>
                    <div class="member-details">
                        <div>Role: analyst</div>
                        <div>Last Login: 2024-01-15 08:00</div>
                    </div>
                </div>
                <div class="member-card">
                    <div class="member-header">
                        <strong>Sarah Investigator</strong>
                        <span class="status-badge active">active</span>
                    </div>
                    <div class="member-details">
                        <div>Role: investigator</div>
                        <div>Last Login: 2024-01-15 09:30</div>
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
            <div class="chart-container">
                <canvas id="systemPerformanceChart"></canvas>
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

// Initialize Admin Charts
function initializeAdminCharts() {
    // System Performance Chart
    const perfCtx = document.getElementById('systemPerformanceChart');
    if (perfCtx) {
        new Chart(perfCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                datasets: [{
                    label: 'Response Time (ms)',
                    data: [45, 42, 48, 52, 44, 41, 43],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Error Rate (%)',
                    data: [0.1, 0.2, 0.15, 0.3, 0.2, 0.1, 0.15],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1'
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
                        title: {
                            display: true,
                            text: 'Response Time (ms)'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Error Rate (%)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
}

function initializeComplianceCharts() {
    // Bias Audit Chart
    const biasCtx = document.getElementById('biasAuditChart');
    if (biasCtx) {
        new Chart(biasCtx, {
            type: 'bar',
            data: {
                labels: ['Age Group', 'Gender', 'Region', 'Income Level', 'Ethnicity'],
                datasets: [{
                    label: 'Approval Rate (%)',
                    data: [92, 89, 91, 88, 90],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
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
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Approval Rate (%)'
                        }
                    }
                }
            }
        });
    }
}

function initializeHealthCharts() {
    // Resource Usage Chart
    const resourceCtx = document.getElementById('resourceUsageChart');
    if (resourceCtx) {
        new Chart(resourceCtx, {
            type: 'doughnut',
            data: {
                labels: ['CPU Usage', 'Memory', 'Storage', 'Network'],
                datasets: [{
                    data: [65, 78, 45, 82],
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#f59e0b',
                        '#8b5cf6'
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
}

function initializeBenchmarkCharts() {
    // Performance Benchmark Chart
    const benchmarkCtx = document.getElementById('benchmarkChart');
    if (benchmarkCtx) {
        new Chart(benchmarkCtx, {
            type: 'bar',
            data: {
                labels: ['North Region', 'South Region', 'East Region', 'West Region', 'Central'],
                datasets: [{
                    label: 'Detection Rate (%)',
                    data: [87, 92, 85, 89, 91],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }, {
                    label: 'Avg Resolution Time (days)',
                    data: [3.2, 2.8, 3.5, 2.9, 3.1],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    yAxisID: 'y1'
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
                        max: 100,
                        title: {
                            display: true,
                            text: 'Detection Rate (%)'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Avg Resolution Time (days)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
}

// Admin Dashboard Functions
function dismissAllAlerts() {
    const alertsContainer = document.getElementById('criticalAlerts');
    if (alertsContainer) {
        alertsContainer.style.display = 'none';
        showNotification('Alerts Dismissed', 'All critical alerts have been dismissed', 'success');
    }
}

function investigateAlert(alertType) {
    showModal('Alert Investigation', `
        <div class="alert-investigation">
            <div class="form-group">
                <label>Alert Type</label>
                <input type="text" value="${alertType}" readonly>
            </div>
            <div class="form-group">
                <label>Investigation Notes</label>
                <textarea rows="4" placeholder="Enter investigation details..."></textarea>
            </div>
            <div class="form-group">
                <label>Recommended Action</label>
                <select>
                    <option>Immediate System Restart</option>
                    <option>Escalate to Technical Team</option>
                    <option>Monitor for 24 Hours</option>
                    <option>Create Support Ticket</option>
                </select>
            </div>
            <div class="form-group">
                <label>Priority Level</label>
                <select>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
            </div>
        </div>
    `, 'Submit Investigation');
}

function navigateToPage(page) {
    loadDashboardContent(page);
}

function generateSystemReport() {
    showNotification('Report Generated', 'System performance report has been generated and sent to your email', 'success');
}

// Access Control Functions
function addNewRole() {
    showModal('Add New Role', `
        <div class="role-form">
            <div class="form-group">
                <label>Role Name</label>
                <input type="text" placeholder="Enter role name...">
            </div>
            <div class="form-group">
                <label>Role Description</label>
                <textarea rows="3" placeholder="Describe role responsibilities..."></textarea>
            </div>
            <div class="form-group">
                <label>Permissions</label>
                <div class="permissions-checklist">
                    <label>
                        <input type="checkbox"> Dashboard Access
                    </label>
                    <label>
                        <input type="checkbox"> Claims Management
                    </label>
                    <label>
                        <input type="checkbox"> Case Investigation
                    </label>
                    <label>
                        <input type="checkbox"> Access Control
                    </label>
                    <label>
                        <input type="checkbox"> System Health
                    </label>
                </div>
            </div>
        </div>
    `, 'Create Role');
}

function editRole(roleId) {
    showModal('Edit Role', `
        <div class="role-form">
            <div class="form-group">
                <label>Role Name</label>
                <input type="text" value="${roleId}" readonly>
            </div>
            <div class="form-group">
                <label>Role Description</label>
                <textarea rows="3" placeholder="Update role description..."></textarea>
            </div>
            <div class="form-group">
                <label>Permissions</label>
                <div class="permissions-checklist">
                    <label>
                        <input type="checkbox" checked> Dashboard Access
                    </label>
                    <label>
                        <input type="checkbox" checked> Claims Management
                    </label>
                    <label>
                        <input type="checkbox"> Case Investigation
                    </label>
                    <label>
                        <input type="checkbox"> Access Control
                    </label>
                    <label>
                        <input type="checkbox"> System Health
                    </label>
                </div>
            </div>
        </div>
    `, 'Update Role');
}

function deleteRole(roleId) {
    if (confirm(`Are you sure you want to delete the ${roleId} role? This action cannot be undone.`)) {
        showNotification('Role Deleted', `The ${roleId} role has been successfully deleted`, 'success');
    }
}

function exportPermissions() {
    showNotification('Export Started', 'Permissions matrix is being exported to CSV format', 'info');
}

function exportAuditTrail() {
    showNotification('Export Started', 'Audit trail is being exported to CSV format', 'info');
}

// Members Management Functions
function addNewMember() {
    showModal('Add New Member', `
        <div class="member-form">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter full name...">
            </div>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter email address...">
            </div>
            <div class="form-group">
                <label>Role</label>
                <select>
                    <option value="admin">Administrator</option>
                    <option value="investigator">Investigator</option>
                    <option value="analyst">Analyst</option>
                    <option value="provider">Provider</option>
                    <option value="patient">Patient</option>
                </select>
            </div>
            <div class="form-group">
                <label>Department</label>
                <input type="text" placeholder="Enter department...">
            </div>
            <div class="form-group">
                <label>Send Welcome Email</label>
                <label class="radio-option">
                    <input type="radio" name="welcome" value="yes" checked>
                    <span>Yes</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="welcome" value="no">
                    <span>No</span>
                </label>
            </div>
        </div>
    `, 'Add Member');
}

function inviteUsers() {
    showModal('Send Invitations', `
        <div class="invite-form">
            <div class="form-group">
                <label>Email Addresses (one per line)</label>
                <textarea rows="5" placeholder="Enter email addresses..."></textarea>
            </div>
            <div class="form-group">
                <label>Default Role</label>
                <select>
                    <option value="investigator">Investigator</option>
                    <option value="analyst">Analyst</option>
                    <option value="provider">Provider</option>
                    <option value="patient">Patient</option>
                </select>
            </div>
            <div class="form-group">
                <label>Personal Message</label>
                <textarea rows="3" placeholder="Add a personal message to the invitation..."></textarea>
            </div>
        </div>
    `, 'Send Invitations');
}

function exportMembers() {
    showNotification('Export Started', 'Member list is being exported to CSV format', 'info');
}

function filterMembers() {
    const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    showNotification('Filters Applied', 'Member list has been filtered', 'info');
}

function editMember(memberId) {
    showModal('Edit Member', `
        <div class="member-form">
            <div class="form-group">
                <label>Member ID</label>
                <input type="text" value="${memberId}" readonly>
            </div>
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" value="John Doe">
            </div>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" value="john.doe@kmed.com">
            </div>
            <div class="form-group">
                <label>Role</label>
                <select>
                    <option value="admin">Administrator</option>
                    <option value="investigator" selected>Investigator</option>
                    <option value="analyst">Analyst</option>
                    <option value="provider">Provider</option>
                    <option value="patient">Patient</option>
                </select>
            </div>
            <div class="form-group">
                <label>Account Status</label>
                <select>
                    <option value="active" selected>Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>
        </div>
    `, 'Update Member');
}

function resetPassword(memberId) {
    if (confirm(`Are you sure you want to reset the password for ${memberId}?`)) {
        showNotification('Password Reset', `Password reset link has been sent to ${memberId}`, 'success');
    }
}

function deactivateMember(memberId) {
    if (confirm(`Are you sure you want to deactivate ${memberId}?`)) {
        showNotification('Member Deactivated', `${memberId} has been deactivated`, 'warning');
    }
}

function activateMember(memberId) {
    showNotification('Member Activated', `${memberId} has been activated`, 'success');
}

function exportActivityLogs() {
    showNotification('Export Started', 'Activity logs are being exported to CSV format', 'info');
}

// Compliance Functions
function runComplianceAudit() {
    showNotification('Audit Started', 'Compliance audit is running in the background', 'info');
}

function exportComplianceReport() {
    showNotification('Export Started', 'Compliance report is being generated', 'info');
}

// Blockchain Functions
function verifyTransaction(hash) {
    showNotification('Verification Complete', `Transaction ${hash} has been verified as authentic`, 'success');
}

function exportLedger() {
    showNotification('Export Started', 'Blockchain ledger is being exported', 'info');
}

// System Health Functions
function restartService(serviceName) {
    if (confirm(`Are you sure you want to restart ${serviceName}?`)) {
        showNotification('Service Restarting', `${serviceName} is restarting...`, 'warning');
    }
}

function viewLogs(serviceName) {
    showModal('Service Logs', `
        <div class="logs-viewer">
            <div class="log-entries">
                <div class="log-entry info">2024-01-15 14:32:15 [INFO] Service started successfully</div>
                <div class="log-entry warning">2024-01-15 14:35:22 [WARN] High memory usage detected</div>
                <div class="log-entry error">2024-01-15 14:38:45 [ERROR] Database connection timeout</div>
                <div class="log-entry info">2024-01-15 14:40:12 [INFO] Connection restored</div>
                <div class="log-entry info">2024-01-15 14:42:30 [INFO] Normal operation resumed</div>
            </div>
        </div>
    `, 'Close');
}

// Benchmark Functions
function exportBenchmarkData() {
    showNotification('Export Started', 'Benchmark data is being exported to Excel format', 'info');
}

function generateBenchmarkReport() {
    showNotification('Report Generated', 'Benchmark report has been generated and sent to your email', 'success');
}

// Additional Admin Functions
function dismissComplianceAlerts() {
    const alertsContainer = document.getElementById('complianceAlerts');
    if (alertsContainer) {
        alertsContainer.style.display = 'none';
        showNotification('Alerts Dismissed', 'All compliance alerts have been dismissed', 'success');
    }
}

function investigateCompliance(alertType) {
    showModal('Compliance Investigation', `
        <div class="compliance-investigation">
            <div class="form-group">
                <label>Alert Type</label>
                <input type="text" value="${alertType}" readonly>
            </div>
            <div class="form-group">
                <label>Investigation Notes</label>
                <textarea rows="4" placeholder="Enter investigation details..."></textarea>
            </div>
            <div class="form-group">
                <label>Recommended Action</label>
                <select>
                    <option>Immediate Audit Required</option>
                    <option>Escalate to Compliance Officer</option>
                    <option>Monitor for 48 Hours</option>
                    <option>Create Corrective Action Plan</option>
                </select>
            </div>
            <div class="form-group">
                <label>Priority Level</label>
                <select>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
            </div>
        </div>
    `, 'Submit Investigation');
}

function exportRegulatorLogs() {
    showNotification('Export Started', 'Regulator access logs are being exported to CSV format', 'info');
}

function generateComplianceReport() {
    showNotification('Report Generated', 'Compliance report has been generated and sent to your email', 'success');
}

function viewReport(reportType) {
    showModal('Compliance Report', `
        <div class="report-viewer">
            <div class="report-header">
                <h5>${reportType.replace('-', ' ').toUpperCase()}</h5>
                <span class="report-date">Generated: 2024-01-15</span>
            </div>
            <div class="report-content">
                <p>This is a comprehensive compliance report containing detailed analysis and recommendations.</p>
                <div class="report-summary">
                    <h6>Executive Summary</h6>
                    <ul>
                        <li>Overall compliance score: 98.5%</li>
                        <li>3 minor violations identified</li>
                        <li>All critical issues resolved</li>
                        <li>Next audit scheduled: 2024-02-15</li>
                    </ul>
                </div>
            </div>
        </div>
    `, 'Close');
}

function verifyLedger() {
    showNotification('Ledger Verification', 'Blockchain ledger integrity verified successfully', 'success');
}

function verifyHash() {
    const hashInput = document.getElementById('hashInput').value;
    const resultDiv = document.getElementById('verificationResult');
    
    if (hashInput) {
        resultDiv.innerHTML = `
            <div class="verification-success">
                <i class="fas fa-check-circle text-success"></i>
                <span>Transaction hash verified successfully</span>
                <small>Integrity: 100% | Timestamp: Valid | Status: Confirmed</small>
            </div>
        `;
        showNotification('Hash Verified', 'Transaction hash is authentic and valid', 'success');
    } else {
        resultDiv.innerHTML = `
            <div class="verification-error">
                <i class="fas fa-exclamation-triangle text-warning"></i>
                <span>Please enter a valid transaction hash</span>
            </div>
        `;
    }
}

function openRegulatorPortal() {
    showNotification('Portal Opening', 'Opening secure regulator verification portal...', 'info');
}

function exportFullLedger() {
    showNotification('Export Started', 'Full blockchain ledger export initiated (this may take several minutes)', 'info');
}

function exportDateRange() {
    showModal('Date Range Export', `
        <div class="date-range-form">
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" value="2024-01-01">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="date" value="2024-01-15">
            </div>
            <div class="form-group">
                <label>Export Format</label>
                <select>
                    <option>CSV</option>
                    <option>JSON</option>
                    <option>PDF</option>
                </select>
            </div>
        </div>
    `, 'Export Range');
}

function exportRegulatorSnapshot() {
    showNotification('Export Started', 'Regulator compliance snapshot being generated', 'info');
}

function refreshPipelines() {
    showNotification('Refreshing', 'Pipeline status is being refreshed...', 'info');
    setTimeout(() => {
        showNotification('Updated', 'Pipeline status has been refreshed', 'success');
    }, 2000);
}

function dismissSystemAlerts() {
    const alertsContainer = document.getElementById('systemAlerts');
    if (alertsContainer) {
        alertsContainer.style.display = 'none';
        showNotification('Alerts Dismissed', 'All system alerts have been dismissed', 'success');
    }
}

function viewMaintenanceDetails() {
    showModal('Maintenance Details', `
        <div class="maintenance-details">
            <div class="maintenance-info">
                <h5>Scheduled System Maintenance</h5>
                <p><strong>Date:</strong> January 16, 2024</p>
                <p><strong>Time:</strong> 2:00 AM - 4:00 AM EST</p>
                <p><strong>Duration:</strong> 2 hours</p>
                <p><strong>Impact:</strong> Temporary service interruption</p>
            </div>
            <div class="maintenance-tasks">
                <h6>Maintenance Tasks:</h6>
                <ul>
                    <li>Database optimization and indexing</li>
                    <li>Security patch deployment</li>
                    <li>System performance tuning</li>
                    <li>Backup verification</li>
                </ul>
            </div>
        </div>
    `, 'Close');
}

function refreshBenchmarks() {
    showNotification('Refreshing', 'Benchmark data is being refreshed...', 'info');
    setTimeout(() => {
        showNotification('Updated', 'Benchmark data has been refreshed', 'success');
    }, 2000);
}

function exportInvestigatorStats() {
    showNotification('Export Started', 'Investigator performance statistics are being exported', 'info');
}

function updateTrends() {
    const period = document.getElementById('trendPeriod').value;
    showNotification('Updated', `Trends updated for ${period.replace('-', ' ')}`, 'success');
}

function generateTrendReport() {
    showNotification('Report Generated', 'Trend analysis report has been generated', 'success');
}

function exportRegionalData() {
    showNotification('Export Started', 'Regional performance data is being exported', 'info');
}

function exportScorecards() {
    showNotification('Export Started', 'Investigator scorecards are being generated', 'info');
}
