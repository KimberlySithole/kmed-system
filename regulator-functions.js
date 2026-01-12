// Regulator Dashboard Functions

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

// Enhanced Detail Functions
window.viewInvestigation = function(investigationId) {
    console.log('Viewing investigation:', investigationId);
    
    const investigations = {
        'INV001': {
            title: 'Systemic Billing Pattern Investigation',
            status: 'active',
            priority: 'critical',
            region: 'Northeast',
            dateOpened: '2024-01-10',
            assignedTo: 'Agent Thompson',
            description: 'Coordinated fraudulent billing activity detected across 12 providers in Northeast region. Pattern indicates organized fraud scheme.',
            findings: '47 fraudulent claims identified, total value $125,000. Multiple providers using same billing codes for services not rendered.',
            riskScore: '9.2',
            providers: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'],
            nextSteps: 'Coordinate with law enforcement, prepare legal action, freeze payments'
        },
        'INV002': {
            title: 'Regional Bias Investigation',
            status: 'review',
            priority: 'high',
            region: 'Western',
            dateOpened: '2024-01-08',
            assignedTo: 'Agent Martinez',
            description: 'Investigation into potential demographic bias in claim approvals across Western sector.',
            findings: 'Statistical anomaly detected in approval rates for specific demographic groups. 15% deviation from regional average.',
            riskScore: '7.5',
            providers: ['Multiple providers under review'],
            nextSteps: 'Complete demographic analysis, recommend corrective actions'
        }
    };
    
    const investigation = investigations[investigationId] || investigations['INV001'];
    
    const content = `
        <div class="detail-section">
            <h4>Investigation Overview</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Investigation ID</div>
                    <div class="detail-value">${investigationId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Title</div>
                    <div class="detail-value">${investigation.title}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value"><span class="detail-status ${investigation.status}">${investigation.status.charAt(0).toUpperCase() + investigation.status.slice(1)}</span></div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Priority</div>
                    <div class="detail-value"><span class="detail-status ${investigation.priority}">${investigation.priority.charAt(0).toUpperCase() + investigation.priority.slice(1)}</span></div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Assignment Details</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Region</div>
                    <div class="detail-value">${investigation.region}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Assigned To</div>
                    <div class="detail-value">${investigation.assignedTo}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Date Opened</div>
                    <div class="detail-value">${investigation.dateOpened}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Risk Score</div>
                    <div class="detail-value">${investigation.riskScore}/10</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Description</h4>
            <div class="detail-item" style="grid-column: 1 / -1;">
                <div class="detail-value">${investigation.description}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Findings</h4>
            <div class="detail-item" style="grid-column: 1 / -1;">
                <div class="detail-value">${investigation.findings}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Involved Providers</h4>
            <div class="detail-grid">
                ${investigation.providers.map(provider => `
                    <div class="detail-item">
                        <div class="detail-label">Provider</div>
                        <div class="detail-value">${provider}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Next Steps</h4>
            <div class="detail-item" style="grid-column: 1 / -1;">
                <div class="detail-value">${investigation.nextSteps}</div>
            </div>
        </div>
        
        <div class="detail-actions">
            <button class="btn btn-primary" onclick="downloadInvestigation('${investigationId}')">📥 Download Report</button>
            <button class="btn btn-secondary" onclick="printInvestigation('${investigationId}')">🖨️ Print</button>
            ${investigation.status === 'active' ? `<button class="btn btn-secondary" onclick="updateInvestigation('${investigationId}')">✏️ Update</button>` : ''}
            <button class="btn btn-secondary" onclick="escalateInvestigation('${investigationId}')">⚠️ Escalate</button>
        </div>
    `;
    
    showModal(`Regulatory Investigation - ${investigationId}`, content);
};

window.viewAudit = function(auditId) {
    console.log('Viewing audit:', auditId);
    
    const audits = {
        'AUD001': {
            title: 'Q4 2023 Compliance Audit',
            type: 'Quarterly Compliance',
            status: 'completed',
            date: '2024-01-05',
            auditor: 'Regional Audit Team',
            scope: 'All providers in Northeast region',
            findings: '23 minor violations, 2 major violations identified',
            recommendations: 'Implement additional training, strengthen documentation requirements',
            compliance: '94.2%',
            nextAudit: '2024-04-05'
        },
        'AUD002': {
            title: 'Bias Analysis Report',
            type: 'Demographic Bias Study',
            status: 'in_progress',
            date: '2024-01-12',
            auditor: 'Fairness Committee',
            scope: 'All claims processed in Q4 2023',
            findings: 'Statistical anomalies detected in approval rates across demographics',
            recommendations: 'Review algorithmic decision-making, implement bias mitigation',
            compliance: 'Pending',
            nextAudit: '2024-02-15'
        }
    };
    
    const audit = audits[auditId] || audits['AUD001'];
    
    const content = `
        <div class="detail-section">
            <h4>Audit Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Audit ID</div>
                    <div class="detail-value">${auditId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Title</div>
                    <div class="detail-value">${audit.title}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Type</div>
                    <div class="detail-value">${audit.type}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value"><span class="detail-status ${audit.status}">${audit.status.replace('_', ' ').charAt(0).toUpperCase() + audit.status.replace('_', ' ').slice(1)}</span></div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Audit Details</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Audit Date</div>
                    <div class="detail-value">${audit.date}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Auditor</div>
                    <div class="detail-value">${audit.auditor}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Compliance Score</div>
                    <div class="detail-value">${audit.compliance}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Next Audit</div>
                    <div class="detail-value">${audit.nextAudit}</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Scope</h4>
            <div class="detail-item" style="grid-column: 1 / -1;">
                <div class="detail-value">${audit.scope}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Findings</h4>
            <div class="detail-item" style="grid-column: 1 / -1;">
                <div class="detail-value">${audit.findings}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Recommendations</h4>
            <div class="detail-item" style="grid-column: 1 / -1;">
                <div class="detail-value">${audit.recommendations}</div>
            </div>
        </div>
        
        <div class="detail-actions">
            <button class="btn btn-primary" onclick="downloadAudit('${auditId}')">📥 Download Report</button>
            <button class="btn btn-secondary" onclick="printAudit('${auditId}')">🖨️ Print</button>
            <button class="btn btn-secondary" onclick="scheduleFollowUp('${auditId}')">📅 Schedule Follow-up</button>
        </div>
    `;
    
    showModal(`Audit Report - ${auditId}`, content);
};

// Additional Regulator Functions
window.escalateInvestigation = function(investigationId) {
    console.log('Escalating investigation:', investigationId);
    alert(`Escalating investigation ${investigationId} to senior management...`);
};

window.downloadAudit = function(auditId) {
    console.log('Downloading audit:', auditId);
    alert(`Downloading audit ${auditId} report...`);
};

window.printAudit = function(auditId) {
    console.log('Printing audit:', auditId);
    alert(`Preparing audit ${auditId} for printing...`);
};

window.scheduleFollowUp = function(auditId) {
    console.log('Scheduling follow-up for audit:', auditId);
    alert(`Scheduling follow-up audit for ${auditId}...`);
};

// Content Generation Functions
function generateHomeContent() {
    return `
        <div class="regulator-home">
            <h2>Regulator Dashboard</h2>
            <div class="dashboard-grid">
                <div class="metric-card">
                    <h3>Total Claims Processed</h3>
                    <div class="metric-value">12,847</div>
                </div>
                <div class="metric-card">
                    <h3>Claims Flagged</h3>
                    <div class="metric-value">8.3%</div>
                </div>
                <div class="metric-card">
                    <h3>Claims Denied</h3>
                    <div class="metric-value">2.1%</div>
                </div>
                <div class="metric-card">
                    <h3>Appeals in Progress</h3>
                    <div class="metric-value">147</div>
                </div>
            </div>
            
            <div class="alert-banners">
                <div class="alert-banner urgent">
                    <h4>🚨 Urgent Compliance Violation</h4>
                    <p>Systemic fraud pattern detected in Northeast region - Immediate investigation required</p>
                </div>
                <div class="alert-banner warning">
                    <h4>⚠️ Systemic Fraud Alert</h4>
                    <p>Unusual billing patterns identified across multiple providers in Western sector</p>
                </div>
            </div>
            
            <div class="quick-links">
                <div class="link-card">
                    <h3>📋 Audit Logs</h3>
                    <p>View complete traceability of claim decisions</p>
                    <button class="btn btn-primary" onclick="loadDashboardContent('audit-logs')">View Logs</button>
                </div>
                <div class="link-card">
                    <h3>⚖️ Bias Reports</h3>
                    <p>Review fairness across demographics and providers</p>
                    <button class="btn btn-primary" onclick="loadDashboardContent('bias-auditing')">View Reports</button>
                </div>
            </div>
            
            <div class="chart-container">
                <canvas id="regulatorOverviewChart"></canvas>
            </div>
        </div>
    `;
}

function generateFraudTrendsContent() {
    return `
        <div class="fraud-trends">
            <h2>Fraud Trends Analysis</h2>
            <div class="trends-dashboard">
                <div class="heatmap-section">
                    <h3>Fraud Rates by Region</h3>
                    <div class="heatmap-container">
                        <div class="heatmap-grid">
                            <div class="heatmap-cell low">Northeast: 2.1%</div>
                            <div class="heatmap-cell medium">Southeast: 4.7%</div>
                            <div class="heatmap-cell high">Midwest: 8.9%</div>
                            <div class="heatmap-cell medium">Southwest: 5.2%</div>
                            <div class="heatmap-cell low">West: 3.1%</div>
                        </div>
                    </div>
                </div>
                
                <div class="graph-analytics-section">
                    <h3>Collusion Networks</h3>
                    <div class="network-clusters">
                        <div class="cluster-card">
                            <h4>Cluster #1</h4>
                            <p>12 providers showing unusual billing patterns</p>
                            <div class="cluster-metrics">
                                <span>Claims: 847</span>
                                <span>Risk Score: 8.7</span>
                            </div>
                        </div>
                        <div class="cluster-card">
                            <h4>Cluster #2</h4>
                            <p>8 providers with coordinated billing</p>
                            <div class="cluster-metrics">
                                <span>Claims: 623</span>
                                <span>Risk Score: 7.9</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="trend-charts">
                    <h3>Fraud Detection Rates Over Time</h3>
                    <div class="chart-container">
                        <canvas id="fraudTrendsChart"></canvas>
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
            <div class="logs-dashboard">
                <div class="immutable-logs">
                    <h3>Immutable Claim Decision Logs</h3>
                    <div class="log-filters">
                        <select class="form-select" id="decisionFilter">
                            <option value="all">All Decisions</option>
                            <option value="approved">Approved</option>
                            <option value="denied">Denied</option>
                            <option value="flagged">Flagged</option>
                        </select>
                        <input type="date" class="form-input" id="dateFilter" placeholder="Filter by date">
                    </div>
                    <div class="logs-list">
                        <div class="log-item approved">
                            <div class="log-header">
                                <strong>CLM001</strong>
                                <span class="decision-badge approved">Approved</span>
                                <span class="timestamp">2024-01-15 10:30</span>
                            </div>
                            <div class="log-details">
                                <div>Amount: $1,200</div>
                                <div>Provider: Dr. Smith</div>
                                <div>Decision: Approved - Standard billing</div>
                                <div>Hash: 0x7f8a9b3c4e2d6a1b5c9f8e7a6b3d5e4f2a1b</div>
                            </div>
                        </div>
                        <div class="log-item denied">
                            <div class="log-header">
                                <strong>CLM002</strong>
                                <span class="decision-badge denied">Denied</span>
                                <span class="timestamp">2024-01-15 09:15</span>
                            </div>
                            <div class="log-details">
                                <div>Amount: $3,500</div>
                                <div>Provider: Dr. Johnson</div>
                                <div>Decision: Denied - Insufficient documentation</div>
                                <div>Hash: 0x9c2d5e8f1a7b6c4d3e9f8a2b5c7d6e1f4a3b2c</div>
                            </div>
                        </div>
                        <div class="log-item flagged">
                            <div class="log-header">
                                <strong>CLM003</strong>
                                <span class="decision-badge flagged">Flagged</span>
                                <span class="timestamp">2024-01-15 08:45</span>
                            </div>
                            <div class="log-details">
                                <div>Amount: $2,800</div>
                                <div>Provider: Dr. Brown</div>
                                <div>Decision: Flagged - Unusual billing pattern</div>
                                <div>Hash: 0x3e7f9a2b5c8d1e6f4a9b7c2d5e8f1a6b4c</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="investigator-actions">
                    <h3>Investigator Actions</h3>
                    <div class="actions-list">
                        <div class="action-item">
                            <div class="action-header">
                                <strong>Case #001</strong>
                                <span class="action-type escalation">Escalation</span>
                            </div>
                            <div class="action-details">
                                <div>Investigator: Sarah Miller</div>
                                <div>Action: Escalated to senior reviewer</div>
                                <div>Reason: Complex billing pattern</div>
                                <div>Timestamp: 2024-01-15 11:20</div>
                            </div>
                        </div>
                        <div class="action-item">
                            <div class="action-header">
                                <strong>Case #002</strong>
                                <span class="action-type resolution">Resolution</span>
                            </div>
                            <div class="action-details">
                                <div>Investigator: John Davis</div>
                                <div>Action: Resolved - Fraud confirmed</div>
                                <div>Outcome: Provider flagged for review</div>
                                <div>Timestamp: 2024-01-15 10:45</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="export-section">
                    <h3>Exportable Logs</h3>
                    <div class="export-options">
                        <button class="btn btn-primary" onclick="exportAuditLogs('csv')">📊 Export CSV</button>
                        <button class="btn btn-primary" onclick="exportAuditLogs('json')">📄 Export JSON</button>
                        <button class="btn btn-primary" onclick="exportAuditLogs('pdf')">📋 Export PDF</button>
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
            <div class="bias-dashboard">
                <div class="demographic-charts">
                    <h3>Claim Approval/Denial Rates by Demographic</h3>
                    <div class="chart-container">
                        <canvas id="demographicBiasChart"></canvas>
                    </div>
                </div>
                
                <div class="bias-metrics">
                    <div class="bias-card">
                        <h3>Age Group Fairness</h3>
                        <div class="bias-value good">0.94</div>
                        <p>Approval rates consistent across age groups</p>
                    </div>
                    <div class="bias-card">
                        <h3>Gender Parity</h3>
                        <div class="bias-value good">0.91</div>
                        <p>Equal approval rates regardless of gender</p>
                    </div>
                    <div class="bias-card">
                        <h3>Geographic Equity</h3>
                        <div class="bias-value warning">0.87</div>
                        <p>Slight variance in regional approval rates</p>
                    </div>
                    <div class="bias-card">
                        <h3>Provider Type Fairness</h3>
                        <div class="bias-value good">0.93</div>
                        <p>Consistent rates across provider types</p>
                    </div>
                </div>
                
                <div class="bias-alerts">
                    <h3>Bias Threshold Alerts</h3>
                    <div class="alert-item warning">
                        <div class="alert-header">
                            <strong>⚠️ Geographic Bias Detected</strong>
                            <span class="severity-badge medium">Medium</span>
                        </div>
                        <div class="alert-details">
                            <div>Metric: Geographic Equity</div>
                            <div>Current Value: 0.87</div>
                            <div>Threshold: 0.90</div>
                            <div>Impact: 8.3% variance in approval rates</div>
                        </div>
                    </div>
                </div>
                
                <div class="corrective-actions">
                    <h3>Corrective Actions Taken</h3>
                    <div class="actions-list">
                        <div class="action-item">
                            <h4>Model Retraining</h4>
                            <p>Retrained fraud detection model with balanced demographic dataset</p>
                            <div class="action-status completed">Completed</div>
                        </div>
                        <div class="action-item">
                            <h4>Policy Adjustment</h4>
                            <p>Updated approval criteria to reduce geographic bias</p>
                            <div class="action-status in-progress">In Progress</div>
                        </div>
                        <div class="action-item">
                            <h4>Additional Oversight</h4>
                            <p>Implemented manual review for high-variance regions</p>
                            <div class="action-status completed">Completed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateBlockchainVerificationContent() {
    return `
        <div class="blockchain-verification">
            <h2>Blockchain Verification</h2>
            <div class="blockchain-dashboard">
                <div class="verification-tools">
                    <div class="verification-card">
                        <h3>Claim Authenticity Verification</h3>
                        <div class="verification-status active">✅ All Verified</div>
                        <p>12,847 claims verified on blockchain</p>
                        <button class="btn btn-primary" onclick="verifyRandomClaim()">🔍 Verify Random Claim</button>
                    </div>
                    <div class="verification-card">
                        <h3>Transaction Hash Verification</h3>
                        <div class="hash-verification">
                            <input type="text" class="form-input" id="hashInput" placeholder="Enter claim hash to verify">
                            <button class="btn btn-primary" onclick="verifyHash()">🔐 Verify Hash</button>
                        </div>
                        <div class="verification-result" id="hashResult">
                            <p>Enter a hash to verify claim authenticity</p>
                        </div>
                    </div>
                    <div class="verification-card">
                        <h3>Tamper-Proof Verification</h3>
                        <div class="tamper-status verified">🛡️ No Tampering Detected</div>
                        <p>All claim records show intact blockchain signatures</p>
                        <div class="chart-container">
                            <canvas id="tamperProofChart"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="blockchain-snapshots">
                    <h3>Blockchain Snapshots</h3>
                    <div class="snapshot-list">
                        <div class="snapshot-item">
                            <div class="snapshot-header">
                                <strong>Block #12,847</strong>
                                <span class="timestamp">2024-01-15 12:00</span>
                            </div>
                            <div class="snapshot-details">
                                <div>Transactions: 47</div>
                                <div>Merkle Root: 0x7f8a9b3c4e2d6a1b5c9f8e7a6b3d5e4f2a1b</div>
                                <div>Previous Hash: 0x9c2d5e8f1a7b6c4d3e9f8a2b5c7d6e1f4a3b2c</div>
                            </div>
                            <button class="btn btn-sm" onclick="exportSnapshot(12847)">📥 Export</button>
                        </div>
                        <div class="snapshot-item">
                            <div class="snapshot-header">
                                <strong>Block #12,846</strong>
                                <span class="timestamp">2024-01-15 11:00</span>
                            </div>
                            <div class="snapshot-details">
                                <div>Transactions: 52</div>
                                <div>Merkle Root: 0x3e7f9a2b5c8d1e6f4a9b7c2d5e8f1a6b4c</div>
                                <div>Previous Hash: 0x5d8f2c9a1e6b7d4c3e8f9a2b6c7d8e2f5a3b1c</div>
                            </div>
                            <button class="btn btn-sm" onclick="exportSnapshot(12846)">📥 Export</button>
                        </div>
                    </div>
                    <div class="export-options">
                        <button class="btn btn-primary" onclick="exportAllSnapshots()">📦 Export All Snapshots</button>
                        <button class="btn btn-primary" onclick="generateExternalAuditReport()">📋 Generate External Audit Report</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateIndustryBenchmarkingContent() {
    return `
        <div class="industry-benchmarking">
            <h2>Industry Benchmarking</h2>
            <div class="benchmarking-dashboard">
                <div class="comparative-charts">
                    <h3>Fraud Rates by Insurer</h3>
                    <div class="chart-container">
                        <canvas id="insurerBenchmarkChart"></canvas>
                    </div>
                </div>
                
                <div class="provider-benchmarking">
                    <h3>Fraud Rates by Provider Type</h3>
                    <div class="chart-container">
                        <canvas id="providerBenchmarkChart"></canvas>
                    </div>
                </div>
                
                <div class="regional-benchmarking">
                    <h3>Fraud Rates by Region</h3>
                    <div class="chart-container">
                        <canvas id="regionalBenchmarkChart"></canvas>
                    </div>
                </div>
                
                <div class="historical-trends">
                    <h3>Historical Benchmarking Trends</h3>
                    <div class="chart-container">
                        <canvas id="historicalBenchmarkChart"></canvas>
                    </div>
                </div>
                
                <div class="outlier-identification">
                    <h3>Outlier Identification</h3>
                    <div class="outlier-list">
                        <div class="outlier-item high">
                            <div class="outlier-header">
                                <strong>🚨 High Outlier</strong>
                                <span class="outlier-type">Provider</span>
                            </div>
                            <div class="outlier-details">
                                <div>Organization: Regional Health Systems</div>
                                <div>Fraud Rate: 18.7%</div>
                                <div>Industry Average: 4.2%</div>
                                <div>Variance: +345%</div>
                                <div>Status: Under Investigation</div>
                            </div>
                        </div>
                        <div class="outlier-item medium">
                            <div class="outlier-header">
                                <strong>⚠️ Medium Outlier</strong>
                                <span class="outlier-type">Insurer</span>
                            </div>
                            <div class="outlier-details">
                                <div>Organization: State Insurance Co.</div>
                                <div>Fraud Rate: 9.8%</div>
                                <div>Industry Average: 4.2%</div>
                                <div>Variance: +133%</div>
                                <div>Status: Review Scheduled</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="benchmarking-reports">
                    <h3>Exportable Benchmarking Reports</h3>
                    <div class="export-options">
                        <button class="btn btn-primary" onclick="generateBenchmarkReport('insurer')">🏢 Insurer Report</button>
                        <button class="btn btn-primary" onclick="generateBenchmarkReport('provider')">🏥 Provider Report</button>
                        <button class="btn btn-primary" onclick="generateBenchmarkReport('regional')">🗺️ Regional Report</button>
                        <button class="btn btn-primary" onclick="generateBenchmarkReport('comprehensive')">📊 Comprehensive Report</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize Regulator Charts
function initializeRegulatorCharts() {
    // Fraud Rate Trend Chart
    const fraudRateCtx = document.getElementById('fraudRateChart');
    if (fraudRateCtx) {
        new Chart(fraudRateCtx, {
            type: 'line',
            data: {
                labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Fraud Detection Rate',
                    data: [10.2, 11.5, 12.1, 11.8, 12.3, 12.3],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

function initializeFraudTrendsCharts() {
    // Collusion Network Chart
    const networkCtx = document.getElementById('collusionNetwork');
    if (networkCtx) {
        new Chart(networkCtx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Provider Clusters',
                    data: [
                        { x: 20, y: 30, r: 15, label: 'Cluster A' },
                        { x: 40, y: 50, r: 20, label: 'Cluster B' },
                        { x: 60, y: 40, r: 12, label: 'Cluster C' },
                        { x: 35, y: 25, r: 8, label: 'Cluster D' }
                    ],
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: '#ef4444'
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

    // Fraud Trends Chart
    const trendsCtx = document.getElementById('fraudTrendsChart');
    if (trendsCtx) {
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Detected Fraud',
                    data: [85, 92, 88, 95, 102, 98, 105, 110, 108, 115, 118, 122],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Prevented Fraud',
                    data: [120, 125, 118, 130, 135, 128, 140, 145, 142, 150, 155, 160],
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
                }
            }
        });
    }

    // Provider Type Chart
    const providerTypeCtx = document.getElementById('providerTypeChart');
    if (providerTypeCtx) {
        new Chart(providerTypeCtx, {
            type: 'bar',
            data: {
                labels: ['Cardiology', 'Orthopedics', 'General Practice', 'Dermatology', 'Radiology', 'Other'],
                datasets: [{
                    label: 'Fraud Rate %',
                    data: [18.5, 15.2, 9.8, 7.3, 5.6, 11.1],
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#3b82f6',
                        '#10b981',
                        '#6b7280',
                        '#8b5cf6'
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
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

function initializeBiasCharts() {
    // Demographic Chart
    const demographicCtx = document.getElementById('demographicChart');
    if (demographicCtx) {
        new Chart(demographicCtx, {
            type: 'radar',
            data: {
                labels: ['Age 18-34', 'Age 35-54', 'Age 55-64', 'Age 65+', 'Male', 'Female', 'Urban', 'Rural'],
                datasets: [{
                    label: 'Approval Rate',
                    data: [92, 94, 91, 79, 88, 90, 93, 89],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderWidth: 2
                }, {
                    label: 'Industry Average',
                    data: [90, 92, 89, 85, 87, 88, 91, 88],
                    borderColor: '#6b7280',
                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Provider Bias Chart
    const providerBiasCtx = document.getElementById('providerBiasChart');
    if (providerBiasCtx) {
        new Chart(providerBiasCtx, {
            type: 'bar',
            data: {
                labels: ['Cardiology', 'Orthopedics', 'General Practice', 'Dermatology', 'Radiology'],
                datasets: [{
                    label: 'Bias Score',
                    data: [98.5, 97.2, 96.8, 98.1, 97.5],
                    backgroundColor: '#10b981'
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
                        beginAtZero: false,
                        min: 90,
                        max: 100
                    }
                }
            }
        });
    }
}

function initializeBlockchainCharts() {
    // Blockchain verification charts can be added here
    console.log('Blockchain charts initialized');
}

function initializeBenchmarkingCharts() {
    // Insurer Comparison Chart
    const insurerCtx = document.getElementById('insurerComparisonChart');
    if (insurerCtx) {
        new Chart(insurerCtx, {
            type: 'bar',
            data: {
                labels: ['KMED', 'HealthNet', 'MediCare', 'SecureHealth', 'TrustCare'],
                datasets: [{
                    label: 'Fraud Rate %',
                    data: [8.7, 12.3, 11.8, 9.5, 13.2],
                    backgroundColor: [
                        '#10b981',
                        '#ef4444',
                        '#f59e0b',
                        '#10b981',
                        '#ef4444'
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
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Provider Comparison Chart
    const providerCtx = document.getElementById('providerComparisonChart');
    if (providerCtx) {
        new Chart(providerCtx, {
            type: 'bar',
            data: {
                labels: ['Top Quartile', 'Upper Mid', 'Lower Mid', 'Bottom Quartile'],
                datasets: [{
                    label: 'Performance Score',
                    data: [94.2, 87.5, 78.3, 65.1],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
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
                        max: 100
                    }
                }
            }
        });
    }

    // Regional Chart
    const regionalCtx = document.getElementById('regionalChart');
    if (regionalCtx) {
        new Chart(regionalCtx, {
            type: 'bar',
            data: {
                labels: ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West', 'Mountain', 'Pacific'],
                datasets: [{
                    label: 'Performance Score',
                    data: [89.5, 92.1, 78.5, 91.2, 88.7, 85.3, 94.2],
                    backgroundColor: '#3b82f6'
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
                        beginAtZero: false,
                        min: 70,
                        max: 100
                    }
                }
            }
        });
    }

    // Historical Trends Chart
    const historicalCtx = document.getElementById('historicalTrendsChart');
    if (historicalCtx) {
        new Chart(historicalCtx, {
            type: 'line',
            data: {
                labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'],
                datasets: [{
                    label: 'Our Performance',
                    data: [85.2, 87.1, 89.5, 91.3, 94.2],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Industry Average',
                    data: [82.5, 83.2, 84.8, 86.1, 87.5],
                    borderColor: '#6b7280',
                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
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
                }
            }
        });
    }
}

// Regulator Dashboard Functions
function dismissComplianceAlerts() {
    const alertsContainer = document.getElementById('regulatorAlerts');
    if (alertsContainer) {
        alertsContainer.style.display = 'none';
        showNotification('Alerts Dismissed', 'All compliance alerts have been dismissed', 'success');
    }
}

function investigateSystemicFraud() {
    showModal('Systemic Fraud Investigation', `
        <div class="fraud-investigation">
            <div class="investigation-header">
                <h5>Systemic Fraud Investigation</h5>
                <span class="investigation-id">INV-2024-001</span>
            </div>
            <div class="investigation-details">
                <div class="detail-section">
                    <h6>Detected Pattern</h6>
                    <p>Unusual pattern of high-value claims ($5,000+) detected across 12 providers in Northeast region over the past 30 days.</p>
                </div>
                <div class="detail-section">
                    <h6>Affected Providers</h6>
                    <ul>
                        <li>Dr. Smith - Cardiology (23 claims)</li>
                        <li>Dr. Johnson - Orthopedics (18 claims)</li>
                        <li>Dr. Williams - General Practice (15 claims)</li>
                        <li>And 9 other providers</li>
                    </ul>
                </div>
                <div class="detail-section">
                    <h6>Risk Assessment</h6>
                    <div class="risk-indicators">
                        <div class="risk-item high">
                            <span class="risk-label">Claim Pattern</span>
                            <span class="risk-value">High Risk</span>
                        </div>
                        <div class="risk-item medium">
                            <span class="risk-label">Geographic Concentration</span>
                            <span class="risk-value">Medium Risk</span>
                        </div>
                        <div class="risk-item high">
                            <span class="risk-label">Amount Consistency</span>
                            <span class="risk-value">High Risk</span>
                        </div>
                    </div>
                </div>
                <div class="investigation-actions">
                    <h6>Recommended Actions</h6>
                    <ul>
                        <li>Initiate full investigation of all involved providers</li>
                        <li>Place temporary hold on all pending claims from these providers</li>
                        <li>Review historical claims from the past 6 months</li>
                        <li>Coordinate with regional fraud investigators</li>
                    </ul>
                </div>
            </div>
        </div>
    `, 'Start Investigation');
}

function reviewBiasReport() {
    showModal('Bias Report Review', `
        <div class="bias-report-review">
            <div class="report-header">
                <h5>Demographic Bias Analysis</h5>
                <span class="report-date">Generated: 2024-01-20</span>
            </div>
            <div class="bias-findings">
                <div class="finding-item">
                    <h6>Age Group 65+ Disparity</h6>
                    <p>Approval rate for patients aged 65+ is 15% lower than expected baseline.</p>
                    <div class="finding-metrics">
                        <span class="metric">Expected: 89%</span>
                        <span class="metric">Actual: 74%</span>
                        <span class="metric">Disparity: -15%</span>
                    </div>
                </div>
                <div class="finding-item">
                    <h6>Specialty-Specific Issues</h6>
                    <p>Minor variance detected in cardiology claims for female patients.</p>
                    <div class="finding-metrics">
                        <span class="metric">Male Approval: 91%</span>
                        <span class="metric">Female Approval: 87%</span>
                        <span class="metric">Disparity: -4%</span>
                    </div>
                </div>
            </div>
            <div class="bias-recommendations">
                <h6>Corrective Actions Required</h6>
                <ul>
                    <li>Review algorithm parameters for age-based bias</li>
                    <li>Retrain model with balanced demographic data</li>
                    <li>Implement bias monitoring dashboard</li>
                    <li>Conduct provider training on bias awareness</li>
                </ul>
            </div>
        </div>
    `, 'Acknowledge');
}

function updateHeatmap() {
    const metric = document.getElementById('heatmapMetric').value;
    showNotification('Heatmap Updated', `Heatmap updated to show ${metric}`, 'info');
}

function refreshHeatmap() {
    showNotification('Heatmap Refreshed', 'Regional fraud heatmap has been refreshed with latest data', 'success');
}

function viewRegionDetails(region) {
    showModal(`Regional Analysis - ${region}`, `
        <div class="region-details">
            <div class="region-header">
                <h5>${region} Region Analysis</h5>
                <span class="region-status">Active Monitoring</span>
            </div>
            <div class="region-metrics">
                <div class="metric-item">
                    <span class="metric-label">Total Claims</span>
                    <span class="metric-value">2,347</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Fraud Rate</span>
                    <span class="metric-value">12.5%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Active Investigations</span>
                    <span class="metric-value">3</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Providers</span>
                    <span class="metric-value">89</span>
                </div>
            </div>
            <div class="region-alerts">
                <h6>Active Alerts</h6>
                <div class="alert-list">
                    <div class="alert-item warning">
                        <span class="alert-title">High Volume Provider</span>
                        <span class="alert-desc">Dr. Smith - 45 claims this month</span>
                    </div>
                    <div class="alert-item info">
                        <span class="alert-title">Unusual Pattern</span>
                        <span class="alert-desc">Spike in dermatology claims</span>
                    </div>
                </div>
            </div>
        </div>
    `, 'Close');
}

function refreshNetwork() {
    showNotification('Network Refreshed', 'Collusion network data has been refreshed', 'success');
}

function exportAuditLogs() {
    showNotification('Export Started', 'Audit logs are being exported to CSV format', 'info');
}

function refreshLogs() {
    showNotification('Logs Refreshed', 'Audit logs have been refreshed with latest data', 'success');
}

function filterAuditLogs() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const claimId = document.getElementById('claimIdFilter').value;
    const action = document.getElementById('actionFilter').value;
    const investigator = document.getElementById('investigatorFilter').value;
    
    showNotification('Filters Applied', `Audit logs filtered by your criteria`, 'success');
}

function viewAuditDetails(auditId) {
    showModal('Audit Details', `
        <div class="audit-details-modal">
            <div class="audit-header">
                <h5>Audit Entry ${auditId}</h5>
                <span class="audit-status status-badge approved">Completed</span>
            </div>
            <div class="audit-info">
                <div class="info-item">
                    <span class="info-label">Timestamp:</span>
                    <span class="info-value">2024-01-20 14:32:15</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Claim ID:</span>
                    <span class="info-value">CLM-2024-015</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Action:</span>
                    <span class="info-value">Approved</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Investigator:</span>
                    <span class="info-value">John Smith</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Reason:</span>
                    <span class="info-value">Standard processing</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Blockchain Hash:</span>
                    <span class="info-value">0x7f8a9b2c3d4e5f6...</span>
                </div>
            </div>
            <div class="audit-notes">
                <h6>Investigator Notes</h6>
                <p>Claim processed according to standard protocols. All documentation verified and compliance checks passed. No anomalies detected during review process.</p>
            </div>
            <div class="audit-verification">
                <h6>Blockchain Verification</h6>
                <div class="verification-status">
                    <div class="status-item verified">
                        <i class="fas fa-check-circle text-success"></i>
                        <span>Hash verified and immutable</span>
                    </div>
                    <div class="status-item verified">
                        <i class="fas fa-check-circle text-success"></i>
                        <span>Timestamp integrity confirmed</span>
                    </div>
                </div>
            </div>
        </div>
    `, 'Close');
}

function verifyBlockchainHash(claimId) {
    showModal('Blockchain Verification', `
        <div class="blockchain-verification-modal">
            <div class="verification-header">
                <h5>Blockchain Hash Verification</h5>
                <span class="claim-id">${claimId}</span>
            </div>
            <div class="verification-process">
                <div class="process-step completed">
                    <div class="step-icon">
                        <i class="fas fa-check-circle text-success"></i>
                    </div>
                    <div class="step-content">
                        <span class="step-title">Hash Retrieved</span>
                        <span class="step-desc">0x7f8a9b2c3d4e5f6...</span>
                    </div>
                </div>
                <div class="process-step completed">
                    <div class="step-icon">
                        <i class="fas fa-check-circle text-success"></i>
                    </div>
                    <div class="step-content">
                        <span class="step-title">Chain Verification</span>
                        <span class="step-desc">Link to previous block confirmed</span>
                    </div>
                </div>
                <div class="process-step completed">
                    <div class="step-icon">
                        <i class="fas fa-check-circle text-success"></i>
                    </div>
                    <div class="step-content">
                        <span class="step-title">Integrity Check</span>
                        <span class="step-desc">No tampering detected</span>
                    </div>
                </div>
                <div class="verification-result">
                    <div class="result-icon">
                        <i class="fas fa-shield-alt text-success"></i>
                    </div>
                    <div class="result-content">
                        <h6>Verification Successful</h6>
                        <p>Claim record is authentic and has not been altered since creation.</p>
                    </div>
                </div>
            </div>
        </div>
    `, 'Close');
}

function viewInvestigationNotes(auditId) {
    showModal('Investigation Notes', `
        <div class="investigation-notes-modal">
            <div class="notes-header">
                <h5>Investigation Notes</h5>
                <span class="audit-id">${auditId}</span>
            </div>
            <div class="notes-content">
                <div class="note-item">
                    <div class="note-header">
                        <span class="note-date">2024-01-20 13:45:22</span>
                        <span class="note-author">Jane Doe</span>
                    </div>
                    <div class="note-text">
                        <p>Initial review triggered by automated fraud detection system. Claim amount of $3,500 exceeds typical range for this procedure type.</p>
                    </div>
                </div>
                <div class="note-item">
                    <div class="note-header">
                        <span class="note-date">2024-01-20 14:15:33</span>
                        <span class="note-author">Jane Doe</span>
                    </div>
                    <div class="note-text">
                        <p>Provider contacted for additional documentation. Medical records reviewed and billing codes verified. No immediate evidence of fraud, but requires continued monitoring.</p>
                    </div>
                </div>
                <div class="note-item">
                    <div class="note-header">
                        <span class="note-date">2024-01-20 15:30:45</span>
                        <span class="note-author">Jane Doe</span>
                    </div>
                    <div class="note-text">
                        <p>Additional documentation received. After thorough review, claim appears legitimate but high-value. Recommend approval with enhanced monitoring flag.</p>
                    </div>
                </div>
            </div>
            <div class="notes-actions">
                <button class="btn btn-primary" onclick="addInvestigationNote('${auditId}')">
                    <i class="fas fa-plus"></i> Add Note
                </button>
                <button class="btn btn-secondary" onclick="downloadInvestigationReport('${auditId}')">
                    <i class="fas fa-download"></i> Download Report
                </button>
            </div>
        </div>
    `, 'Close');
}

function downloadInvestigationReport(auditId) {
    showNotification('Download Started', `Investigation report for ${auditId} is being generated`, 'info');
}

function viewAppealStatus(claimId) {
    showModal('Appeal Status', `
        <div class="appeal-status-modal">
            <div class="status-header">
                <h5>Appeal Status</h5>
                <span class="claim-id">${claimId}</span>
            </div>
            <div class="appeal-info">
                <div class="info-item">
                    <span class="info-label">Appeal ID:</span>
                    <span class="info-value">AP-2024-045</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Status:</span>
                    <span class="info-value status-badge pending">Under Review</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Submitted:</span>
                    <span class="info-value">2024-01-18</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Expected Resolution:</span>
                    <span class="info-value">2024-01-25</span>
                </div>
            </div>
            <div class="appeal-timeline">
                <h6>Appeal Progress</h6>
                <div class="timeline-steps">
                    <div class="step completed">
                        <div class="step-dot"></div>
                        <span class="step-title">Submitted</span>
                        <span class="step-date">2024-01-18</span>
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

function generateBiasReport() {
    showNotification('Report Generated', 'Bias auditing report has been generated and sent to your email', 'success');
}

function investigateBiasAlert(alertType) {
    showModal('Bias Investigation', `
        <div class="bias-investigation">
            <div class="investigation-header">
                <h5>Bias Alert Investigation</h5>
                <span class="alert-id">ALERT-${alertType}</span>
            </div>
            <div class="investigation-details">
                <div class="detail-section">
                    <h6>Alert Details</h6>
                    <p>Demographic bias detected in claim approval rates requiring immediate investigation and corrective action.</p>
                </div>
                <div class="detail-section">
                    <h6>Affected Demographics</h6>
                    <ul>
                        <li>Age Group: 65+</li>
                        <li>Specialty: Cardiology</li>
                        <li>Region: Northeast</li>
                    </ul>
                </div>
                <div class="detail-section">
                    <h6>Impact Assessment</h6>
                    <div class="impact-metrics">
                        <span class="metric">Affected Claims: 234</span>
                        <span class="metric">Financial Impact: $1.2M</span>
                        <span class="metric">Compliance Risk: High</span>
                    </div>
                </div>
            </div>
            <div class="investigation-actions">
                <h6>Immediate Actions</h6>
                <ul>
                    <li>Pause automated processing for affected demographic</li>
                    <li>Initiate manual review of all affected claims</li>
                    <li>Engage bias investigation team</li>
                    <li>Notify compliance department</li>
                </ul>
            </div>
        </div>
    `, 'Start Investigation');
}

function verifyRandomClaim() {
    const randomClaimId = 'CLM-' + Math.floor(Math.random() * 10000);
    verifySpecificClaim(randomClaimId);
}

function verifySpecificClaim() {
    const claimId = document.getElementById('verifyClaimId').value || 'CLM-2024-' + Math.floor(Math.random() * 1000);
    
    const resultsDiv = document.getElementById('verificationResults');
    resultsDiv.innerHTML = `
        <div class="verification-result">
            <div class="result-header">
                <h6>Verification Result</h6>
                <span class="claim-id">${claimId}</span>
            </div>
            <div class="verification-status">
                <div class="status-item verified">
                    <i class="fas fa-check-circle text-success"></i>
                    <span>Claim verified successfully</span>
                </div>
                <div class="status-item verified">
                    <i class="fas fa-check-circle text-success"></i>
                    <span>Blockchain hash confirmed</span>
                </div>
                <div class="status-item verified">
                    <i class="fas fa-check-circle text-success"></i>
                    <span>No tampering detected</span>
                </div>
            </div>
            <div class="verification-details">
                <div class="detail-item">
                    <span class="detail-label">Block Number:</span>
                    <span class="detail-value">#847,234</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Timestamp:</span>
                    <span class="detail-value">2024-01-20 14:32:15</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Hash:</span>
                    <span class="detail-value">0x7f8a9b2c3d4e5f6...</span>
                </div>
            </div>
        </div>
    `;
    
    showNotification('Verification Complete', `Claim ${claimId} verified successfully`, 'success');
}

function batchVerification() {
    showNotification('Batch Verification Started', 'Verifying 100 random claims for blockchain integrity', 'info');
}

function exportBlockchainSnapshot() {
    showNotification('Export Started', 'Blockchain snapshot is being exported for external audit', 'info');
}

function exploreBlock() {
    const blockNumber = document.getElementById('blockNumber').value || '847234';
    
    const detailsDiv = document.getElementById('blockDetails');
    detailsDiv.innerHTML = `
        <div class="block-details-content">
            <div class="block-header">
                <h6>Block #${blockNumber}</h6>
                <span class="block-status">Verified</span>
            </div>
            <div class="block-info">
                <div class="info-item">
                    <span class="info-label">Timestamp:</span>
                    <span class="info-value">2024-01-20 14:32:15</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Claims in Block:</span>
                    <span class="info-value">42</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Previous Hash:</span>
                    <span class="info-value">0x3d4e5f6a7b8c9d0...</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Block Hash:</span>
                    <span class="info-value">0x7f8a9b2c3d4e5f6...</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Merkle Root:</span>
                    <span class="info-value">0x1a2b3c4d5e6f7a8...</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Nonce:</span>
                    <span class="info-value">987654321</span>
                </div>
            </div>
            <div class="block-claims">
                <h6>Claims in This Block</h6>
                <div class="claims-list">
                    <div class="claim-item">CLM-2024-015 - Approved - $850.00</div>
                    <div class="claim-item">CLM-2024-014 - Flagged - $3,500.00</div>
                    <div class="claim-item">CLM-2024-013 - Denied - $450.00</div>
                    <div class="claim-item">CLM-2024-012 - Investigated - $2,200.00</div>
                    <div class="claim-item">CLM-2024-011 - Approved - $1,200.00</div>
                </div>
            </div>
        </div>
    `;
    
    showNotification('Block Explored', `Block #${blockNumber} details loaded successfully`, 'success');
}

function generateBenchmarkReport() {
    showNotification('Report Generated', 'Industry benchmarking report has been generated', 'success');
}

function exportBenchmarkReport() {
    showNotification('Export Started', 'Benchmark report is being exported to PDF format', 'info');
}

function exportInsurerRankings() {
    showNotification('Export Started', 'Insurer rankings are being exported to CSV format', 'info');
}

function exportProviderAnalysis() {
    showNotification('Export Started', 'Provider analysis is being exported to Excel format', 'info');
}
