// Investigator Dashboard Functions

// Content Generation Functions
function generateFraudAlertsContent() {
    return `
        <div class="investigator-workspace">
            <!-- Top Bar -->
            <div class="investigator-topbar">
                <div class="topbar-left">
                    <div class="global-search">
                        <input type="text" placeholder="Search alerts, cases, evidence..." class="search-input">
                        <button class="search-btn">🔍</button>
                    </div>
                </div>
                <div class="topbar-center">
                    <div class="role-badge">Investigator</div>
                    <div class="quick-filters">
                        <button class="filter-chip active">All</button>
                        <button class="filter-chip">High Risk</button>
                        <button class="filter-chip">My Cases</button>
                    </div>
                </div>
                <div class="topbar-right">
                    <div class="notifications">
                        <span class="notification-icon">🔔</span>
                        <span class="notification-count">3</span>
                    </div>
                </div>
            </div>

            <!-- Three Column Layout -->
            <div class="investigator-grid">
                <!-- Left Column: Navigation and Filters -->
                <div class="left-column">
                    <div class="investigator-console">
                        <h3>🎛️ Console</h3>
                        <div class="console-filters">
                            <div class="filter-section">
                                <label>Risk Score Range</label>
                                <div class="range-inputs">
                                    <input type="number" placeholder="Min" class="range-input" id="riskMin">
                                    <span>-</span>
                                    <input type="number" placeholder="Max" class="range-input" id="riskMax">
                                </div>
                            </div>
                            <div class="filter-section">
                                <label>Provider</label>
                                <select class="form-select" id="providerFilter">
                                    <option value="all">All Providers</option>
                                    <option value="dr-smith">Dr. Smith</option>
                                    <option value="dr-johnson">Dr. Johnson</option>
                                    <option value="dr-brown">Dr. Brown</option>
                                </select>
                            </div>
                            <div class="filter-section">
                                <label>Date Range</label>
                                <input type="date" class="form-input" id="dateFrom">
                                <span>to</span>
                                <input type="date" class="form-input" id="dateTo">
                            </div>
                            <div class="filter-section">
                                <label>Claim Type</label>
                                <select class="form-select" id="claimType">
                                    <option value="all">All Types</option>
                                    <option value="medical">Medical</option>
                                    <option value="pharmacy">Pharmacy</option>
                                    <option value="dental">Dental</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="saved-searches">
                            <h4>📁 Saved Searches</h4>
                            <div class="search-list">
                                <div class="search-item" onclick="loadSearch('high-priority')">High Priority Only</div>
                                <div class="search-item" onclick="loadSearch('my-queue')">My Queue</div>
                                <div class="search-item" onclick="loadSearch('recent-fraud')">Recent Fraud</div>
                            </div>
                        </div>
                        
                        <div class="quick-links">
                            <h4>⚡ Quick Links</h4>
                            <button class="link-btn" onclick="openTraining()">🎓 Training</button>
                            <button class="link-btn" onclick="openPolicy()">📋 Policy Reference</button>
                        </div>
                    </div>
                </div>

                <!-- Center Column: Primary Work Area -->
                <div class="center-column">
                    <!-- Fraud Alerts Queue -->
                    <div class="fraud-alerts-queue">
                        <div class="section-header">
                            <h2>🚨 Fraud Alerts Queue</h2>
                            <div class="queue-actions">
                                <button class="btn btn-sm" onclick="refreshQueue()">🔄 Refresh</button>
                                <button class="btn btn-sm" onclick="exportQueue()">📥 Export</button>
                            </div>
                        </div>
                        
                        <div class="alerts-table-container">
                            <table class="alerts-table">
                                <thead>
                                    <tr>
                                        <th onclick="sortTable('claimId')">Claim ID ↕</th>
                                        <th onclick="sortTable('riskScore')">Risk Score ↕</th>
                                        <th onclick="sortTable('provider')">Provider ↕</th>
                                        <th onclick="sortTable('date')">Date ↕</th>
                                        <th onclick="sortTable('priority')">Priority ↕</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="alert-row high" data-id="ALT001">
                                        <td><span class="claim-id">CLM001</span></td>
                                        <td><div class="risk-score-bar"><div class="risk-fill" style="width: 94%"></div><span class="risk-text">94</span></div></td>
                                        <td>Dr. Smith</td>
                                        <td>2024-01-15</td>
                                        <td><span class="priority-chip high">HIGH</span></td>
                                        <td>
                                            <div class="inline-actions">
                                                <button class="action-btn view" onclick="quickView('CLM001')" title="Quick View">👁️</button>
                                                <button class="action-btn assign" onclick="quickAssign('ALT001')" title="Assign">👤</button>
                                                <button class="action-btn escalate" onclick="quickEscalate('ALT001')" title="Escalate">⬆️</button>
                                                <button class="action-btn dismiss" onclick="quickDismiss('ALT001')" title="Dismiss">❌</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="alert-row medium" data-id="ALT002">
                                        <td><span class="claim-id">CLM002</span></td>
                                        <td><div class="risk-score-bar"><div class="risk-fill" style="width: 67%"></div><span class="risk-text">67</span></div></td>
                                        <td>Dr. Johnson</td>
                                        <td>2024-01-15</td>
                                        <td><span class="priority-chip medium">MEDIUM</span></td>
                                        <td>
                                            <div class="inline-actions">
                                                <button class="action-btn view" onclick="quickView('CLM002')" title="Quick View">👁️</button>
                                                <button class="action-btn assign" onclick="quickAssign('ALT002')" title="Assign">👤</button>
                                                <button class="action-btn escalate" onclick="quickEscalate('ALT002')" title="Escalate">⬆️</button>
                                                <button class="action-btn dismiss" onclick="quickDismiss('ALT002')" title="Dismiss">❌</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="alert-row low" data-id="ALT003">
                                        <td><span class="claim-id">CLM003</span></td>
                                        <td><div class="risk-score-bar"><div class="risk-fill" style="width: 23%"></div><span class="risk-text">23</span></div></td>
                                        <td>Dr. Brown</td>
                                        <td>2024-01-14</td>
                                        <td><span class="priority-chip low">LOW</span></td>
                                        <td>
                                            <div class="inline-actions">
                                                <button class="action-btn view" onclick="quickView('CLM003')" title="Quick View">👁️</button>
                                                <button class="action-btn assign" onclick="quickAssign('ALT003')" title="Assign">👤</button>
                                                <button class="action-btn escalate" onclick="quickEscalate('ALT003')" title="Escalate">⬆️</button>
                                                <button class="action-btn dismiss" onclick="quickDismiss('ALT003')" title="Dismiss">❌</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Case File Viewer -->
                    <div class="case-file-viewer">
                        <div class="section-header">
                            <h2>📁 Case File Viewer</h2>
                            <div class="viewer-actions">
                                <button class="btn btn-sm" onclick="printCase()">🖨️ Print</button>
                                <button class="btn btn-sm" onclick="pdfExport()">📄 PDF</button>
                            </div>
                        </div>
                        
                        <div class="case-tabs">
                            <button class="tab-btn active" onclick="switchTab('overview')">Overview</button>
                            <button class="tab-btn" onclick="switchTab('timeline')">Timeline</button>
                            <button class="tab-btn" onclick="switchTab('documents')">Documents</button>
                            <button class="tab-btn" onclick="switchTab('communications')">Communications</button>
                            <button class="tab-btn" onclick="switchTab('audit')">Audit Trail</button>
                        </div>
                        
                        <div class="case-content">
                            <div class="overview-card">
                                <h3>Claim Summary</h3>
                                <div class="summary-grid">
                                    <div class="summary-item">
                                        <label>Claimant:</label>
                                        <value>John Doe</value>
                                    </div>
                                    <div class="summary-item">
                                        <label>Claim Amount:</label>
                                        <value>$2,500</value>
                                    </div>
                                    <div class="summary-item">
                                        <label>Flagged Reasons:</label>
                                        <value>Unusual billing pattern, High frequency</value>
                                    </div>
                                    <div class="summary-item">
                                        <label>Current Owner:</label>
                                        <value>Sarah Investigator</value>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="timeline-view">
                                <h4>📅 Timeline</h4>
                                <div class="timeline-events">
                                    <div class="timeline-event">
                                        <div class="event-time">2024-01-15 10:30</div>
                                        <div class="event-content">
                                            <strong>System Alert</strong>
                                            <p>Unusual billing pattern detected</p>
                                        </div>
                                    </div>
                                    <div class="timeline-event">
                                        <div class="event-time">2024-01-15 10:35</div>
                                        <div class="event-content">
                                            <strong>Investigator Note</strong>
                                            <p>Initial review completed - requires investigation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Context Panels -->
                <div class="right-column">
                    <!-- Explainable AI Panel -->
                    <div class="explainable-ai-panel">
                        <h3>🤖 Explainable AI</h3>
                        <div class="ai-content">
                            <div class="feature-contributions">
                                <h4>Top 5 Drivers</h4>
                                <div class="driver-list">
                                    <div class="driver-item">
                                        <span class="driver-name">Billing Frequency</span>
                                        <span class="driver-weight">92%</span>
                                        <div class="weight-bar"><div class="weight-fill" style="width: 92%"></div></div>
                                    </div>
                                    <div class="driver-item">
                                        <span class="driver-name">Amount Deviation</span>
                                        <span class="driver-weight">87%</span>
                                        <div class="weight-bar"><div class="weight-fill" style="width: 87%"></div></div>
                                    </div>
                                    <div class="driver-item">
                                        <span class="driver-name">Time Patterns</span>
                                        <span class="driver-weight">76%</span>
                                        <div class="weight-bar"><div class="weight-fill" style="width: 76%"></div></div>
                                    </div>
                                    <div class="driver-item">
                                        <span class="driver-name">Provider History</span>
                                        <span class="driver-weight">68%</span>
                                        <div class="weight-bar"><div class="weight-fill" style="width: 68%"></div></div>
                                    </div>
                                    <div class="driver-item">
                                        <span class="driver-name">Patient Relationship</span>
                                        <span class="driver-weight">54%</span>
                                        <div class="weight-bar"><div class="weight-fill" style="width: 54%"></div></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="counterfactuals">
                                <h4>🔄 Counterfactuals</h4>
                                <div class="counterfactual-item">
                                    <span>If billing frequency changed to normal, risk would drop by <strong>32%</strong></span>
                                </div>
                                <div class="counterfactual-item">
                                    <span>If claim amount reduced by $500, risk would drop by <strong>18%</strong></span>
                                </div>
                            </div>
                            
                            <div class="confidence-meter">
                                <h4>Confidence</h4>
                                <div class="confidence-bar">
                                    <div class="confidence-fill" style="width: 94%"></div>
                                    <span class="confidence-text">94%</span>
                                </div>
                                <div class="model-version">Model v2.3.1</div>
                            </div>
                        </div>
                    </div>

                    <!-- Evidence Panel -->
                    <div class="evidence-panel">
                        <h3>📋 Evidence</h3>
                        <div class="evidence-grid">
                            <div class="evidence-item" onclick="viewEvidence('doc1')">
                                <div class="evidence-thumbnail">📄</div>
                                <div class="evidence-meta">
                                    <div class="evidence-name">Claim Form.pdf</div>
                                    <div class="evidence-info">2.3 MB • Uploaded 10:30</div>
                                    <div class="evidence-source">Dr. Smith</div>
                                </div>
                                <div class="evidence-actions">
                                    <button class="tag-btn" onclick="tagEvidence('doc1', 'admissible')">✓ Admissible</button>
                                    <button class="tag-btn" onclick="tagEvidence('doc1', 'irrelevant')">✗ Irrelevant</button>
                                </div>
                            </div>
                            <div class="evidence-item" onclick="viewEvidence('doc2')">
                                <div class="evidence-thumbnail">🖼️</div>
                                <div class="evidence-meta">
                                    <div class="evidence-name">Invoice.jpg</div>
                                    <div class="evidence-info">1.8 MB • Uploaded 10:45</div>
                                    <div class="evidence-source">System</div>
                                </div>
                                <div class="evidence-actions">
                                    <button class="tag-btn" onclick="tagEvidence('doc2', 'admissible')">✓ Admissible</button>
                                    <button class="tag-btn" onclick="tagEvidence('doc2', 'irrelevant')">✗ Irrelevant</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Investigation Workflow Tools -->
                    <div class="workflow-tools-panel">
                        <h3>🛠️ Workflow Tools</h3>
                        <div class="workflow-actions">
                            <button class="workflow-btn primary" onclick="assignCase()">
                                👤 Assign Case
                            </button>
                            <button class="workflow-btn secondary" onclick="requestInfo()">
                                📧 Request More Info
                            </button>
                            <button class="workflow-btn warning" onclick="freezePayment()">
                                ❄️ Freeze Payment
                            </button>
                            <button class="workflow-btn success" onclick="createCase()">
                                📁 Create Case
                            </button>
                        </div>
                        
                        <div class="sla-timer">
                            <h4>⏱️ SLA Timer</h4>
                            <div class="timer-display">
                                <span class="time-remaining">2h 34m</span>
                                <div class="sla-progress">
                                    <div class="sla-fill" style="width: 65%"></div>
                                </div>
                            </div>
                            <div class="escalation-rules">
                                <small>Escalate if > 4h elapsed</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="investigator-footer">
                <div class="footer-left">
                    <div class="session-status">
                        <span class="status-indicator online"></span>
                        <span>Session Active</span>
                    </div>
                    <div class="data-sync">
                        <span class="sync-indicator synced"></span>
                        <span>Last sync: 2 min ago</span>
                    </div>
                </div>
                <div class="footer-right">
                    <div class="shortcuts">
                        <span class="shortcut-hint">J/K: Navigate • A: Assign • E: Escalate</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateCaseFilesContent() {
    return `
        <div class="case-files">
            <h2>Case Files</h2>
            <div class="cases-dashboard">
                <div class="cases-summary">
                    <div class="summary-card">
                        <h3>Open Cases</h3>
                        <div class="summary-value">18</div>
                        <p>Currently under investigation</p>
                    </div>
                    <div class="summary-card">
                        <h3>In Progress</h3>
                        <div class="summary-value">7</div>
                        <p>Active investigations</p>
                    </div>
                    <div class="summary-card">
                        <h3>Resolved</h3>
                        <div class="summary-value">142</div>
                        <p>This month</p>
                    </div>
                </div>
                
                <div class="cases-filters">
                    <div class="filter-group">
                        <label>Status</label>
                        <select class="form-select" id="caseStatus">
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Priority</label>
                        <select class="form-select" id="casePriority">
                            <option value="all">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Assigned To</label>
                        <select class="form-select" id="caseAssignee">
                            <option value="all">All Investigators</option>
                            <option value="sarah">Sarah Investigator</option>
                            <option value="john">John Investigator</option>
                            <option value="mike">Mike Investigator</option>
                        </select>
                    </div>
                </div>
                
                <div class="case-list">
                    <div class="case-item">
                        <div class="case-header">
                            <strong>Case #001</strong>
                            <span class="status-badge open">Open</span>
                            <div class="case-actions">
                                <button class="btn btn-sm btn-primary" onclick="openCase('CASE001')">Open</button>
                                <button class="btn btn-sm btn-secondary" onclick="assignCase('CASE001')">Assign</button>
                            </div>
                        </div>
                        <div class="case-details">
                            <div><strong>Alert ID:</strong> ALT001</div>
                            <div><strong>Claim:</strong> CLM001</div>
                            <div><strong>Description:</strong> Unusual billing pattern detected</div>
                            <div><strong>Assigned:</strong> Sarah Investigator</div>
                            <div><strong>Created:</strong> 2024-01-15 10:30</div>
                            <div><strong>Priority:</strong> High</div>
                        </div>
                    </div>
                    <div class="case-item">
                        <div class="case-header">
                            <strong>Case #002</strong>
                            <span class="status-badge in-progress">In Progress</span>
                            <div class="case-actions">
                                <button class="btn btn-sm btn-primary" onclick="openCase('CASE002')">Open</button>
                                <button class="btn btn-sm btn-secondary" onclick="assignCase('CASE002')">Assign</button>
                            </div>
                        </div>
                        <div class="case-details">
                            <div><strong>Alert ID:</strong> ALT002</div>
                            <div><strong>Claim:</strong> CLM002</div>
                            <div><strong>Description:</strong> Missing documentation</div>
                            <div><strong>Assigned:</strong> John Investigator</div>
                            <div><strong>Created:</strong> 2024-01-15 09:15</div>
                            <div><strong>Priority:</strong> Medium</div>
                        </div>
                    </div>
                    <div class="case-item">
                        <div class="case-header">
                            <strong>Case #003</strong>
                            <span class="status-badge closed">Closed</span>
                            <div class="case-actions">
                                <button class="btn btn-sm btn-primary" onclick="openCase('CASE003')">Open</button>
                                <button class="btn btn-sm btn-secondary" onclick="assignCase('CASE003')">Assign</button>
                            </div>
                        </div>
                        <div class="case-details">
                            <div><strong>Alert ID:</strong> ALT003</div>
                            <div><strong>Claim:</strong> CLM003</div>
                            <div><strong>Description:</strong> Compliance issue resolved</div>
                            <div><strong>Assigned:</strong> Mike Investigator</div>
                            <div><strong>Created:</strong> 2024-01-14 16:45</div>
                            <div><strong>Priority:</strong> Low</div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="casesTrendChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateExplainableAIContent() {
    return `
        <div class="explainable-ai">
            <h2>Explainable AI</h2>
            <div class="ai-dashboard">
                <div class="ai-summary">
                    <div class="summary-card">
                        <h3>Model Accuracy</h3>
                        <div class="summary-value">94.7%</div>
                        <p>Current performance</p>
                    </div>
                    <div class="summary-card">
                        <h3>Explainability Score</h3>
                        <div class="summary-value">91.2%</div>
                        <p>Interpretability rating</p>
                    </div>
                    <div class="summary-card">
                        <h3>Active Analyses</h3>
                        <div class="summary-value">23</div>
                        <p>Running explanations</p>
                    </div>
                </div>
                
                <div class="ai-tools">
                    <div class="tool-section">
                        <h3>Fraud Detection Reasoning</h3>
                        <div class="reasoning-panel">
                            <div class="reasoning-item">
                                <h4>Claim CLM001 Analysis</h4>
                                <p>AI detected unusual billing patterns based on historical data analysis and anomaly detection.</p>
                                <div class="confidence-score">Confidence: 94%</div>
                                <button class="btn btn-sm btn-primary" onclick="generateExplanation('fraud-model-001')">Generate Explanation</button>
                                <button class="btn btn-sm btn-secondary" onclick="viewSHAP('CLM001')">View SHAP</button>
                            </div>
                            <div class="reasoning-item">
                                <h4>Key Factors Identified</h4>
                                <ul>
                                    <li>Unusual provider frequency (3.2x normal)</li>
                                    <li>Amount deviation from norm (+$1,250)</li>
                                    <li>Time pattern analysis (suspicious timing)</li>
                                    <li>Patient-provider relationship anomaly</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-section">
                        <h3>Feature Importance Analysis</h3>
                        <div class="feature-analysis">
                            <div class="feature-item">
                                <span class="feature-name">Billing Frequency</span>
                                <div class="importance-bar">
                                    <div class="importance-fill" style="width: 92%"></div>
                                </div>
                                <span class="importance-value">92%</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-name">Amount Deviation</span>
                                <div class="importance-bar">
                                    <div class="importance-fill" style="width: 87%"></div>
                                </div>
                                <span class="importance-value">87%</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-name">Time Patterns</span>
                                <div class="importance-bar">
                                    <div class="importance-fill" style="width: 76%"></div>
                                </div>
                                <span class="importance-value">76%</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-name">Provider History</span>
                                <div class="importance-bar">
                                    <div class="importance-fill" style="width: 68%"></div>
                                </div>
                                <span class="importance-value">68%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="aiConfidenceChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateWorkflowToolsContent() {
    return `
        <div class="workflow-tools">
            <h2>Workflow Tools</h2>
            <div class="workflow-dashboard">
                <div class="workflow-summary">
                    <div class="summary-card">
                        <h3>Active Workflows</h3>
                        <div class="summary-value">7</div>
                        <p>Currently running</p>
                    </div>
                    <div class="summary-card">
                        <h3>Completed Today</h3>
                        <div class="summary-value">23</div>
                        <p>Tasks finished</p>
                    </div>
                    <div class="summary-card">
                        <h3>Efficiency Score</h3>
                        <div class="summary-value">89%</div>
                        <p>Process optimization</p>
                    </div>
                </div>
                
                <div class="tools-grid">
                    <div class="tool-card">
                        <h3>🎯 Case Assignment</h3>
                        <p>Automatically assign cases to investigators based on workload and expertise.</p>
                        <div class="tool-stats">
                            <div class="stat-item">
                                <span class="stat-label">Pending Assignment:</span>
                                <span class="stat-value">12</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Avg Assignment Time:</span>
                                <span class="stat-value">2.3 min</span>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="runAudit('case-assignment')">Auto-Assign Cases</button>
                        <button class="btn btn-secondary" onclick="generateReport('assignment-report')">Generate Report</button>
                    </div>
                    
                    <div class="tool-card">
                        <h3>📋 Evidence Collection</h3>
                        <p>Organize and track evidence for each case with secure chain of custody.</p>
                        <div class="tool-stats">
                            <div class="stat-item">
                                <span class="stat-label">Evidence Items:</span>
                                <span class="stat-value">342</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Verified Items:</span>
                                <span class="stat-value">287</span>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="runAudit('evidence-collection')">Manage Evidence</button>
                        <button class="btn btn-secondary" onclick="generateReport('evidence-report')">Generate Report</button>
                    </div>
                    
                    <div class="tool-card">
                        <h3>📊 Report Generation</h3>
                        <p>Generate comprehensive investigation reports with AI assistance.</p>
                        <div class="tool-stats">
                            <div class="stat-item">
                                <span class="stat-label">Reports Generated:</span>
                                <span class="stat-value">156</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Avg Generation Time:</span>
                                <span class="stat-value">4.7 min</span>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="runAudit('report-generation')">Generate Report</button>
                        <button class="btn btn-secondary" onclick="generateReport('report-analytics')">View Analytics</button>
                    </div>
                    
                    <div class="tool-card">
                        <h3>🔍 Quality Assurance</h3>
                        <p>Automated quality checks for investigation completeness and accuracy.</p>
                        <div class="tool-stats">
                            <div class="stat-item">
                                <span class="stat-label">Cases Reviewed:</span>
                                <span class="stat-value">89</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Quality Score:</span>
                                <span class="stat-value">94.2%</span>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="runAudit('quality-assurance')">Run QA Check</button>
                        <button class="btn btn-secondary" onclick="generateReport('qa-report')">QA Report</button>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="workflowEfficiencyChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateTrainingModuleContent() {
    return `
        <div class="training-module">
            <h2>Training Module</h2>
            <div class="training-dashboard">
                <div class="training-summary">
                    <div class="summary-card">
                        <h3>Modules Available</h3>
                        <div class="summary-value">12</div>
                        <p>Total training courses</p>
                    </div>
                    <div class="summary-card">
                        <h3>Completed</h3>
                        <div class="summary-value">8</div>
                        <p>Courses finished</p>
                    </div>
                    <div class="summary-card">
                        <h3>Progress Score</h3>
                        <div class="summary-value">67%</div>
                        <p>Overall completion</p>
                    </div>
                </div>
                
                <div class="training-content">
                    <div class="course-grid">
                        <div class="course-card">
                            <h3>🎓 Fraud Detection Basics</h3>
                            <div class="course-info">
                                <div class="course-meta">
                                    <span class="duration">4 hours</span>
                                    <span class="difficulty">Beginner</span>
                                    <span class="status">In Progress</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 75%"></div>
                                </div>
                                <div class="progress-text">75% Complete</div>
                            </div>
                            <div class="course-actions">
                                <button class="btn btn-sm btn-primary" onclick="startTraining('fraud-basics')">Continue</button>
                                <button class="btn btn-sm btn-secondary" onclick="completeModule('fraud-basics')">Mark Complete</button>
                            </div>
                        </div>
                        
                        <div class="course-card">
                            <h3>🔍 Advanced Investigation Techniques</h3>
                            <div class="course-info">
                                <div class="course-meta">
                                    <span class="duration">6 hours</span>
                                    <span class="difficulty">Advanced</span>
                                    <span class="status">In Progress</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 30%"></div>
                                </div>
                                <div class="progress-text">30% Complete</div>
                            </div>
                            <div class="course-actions">
                                <button class="btn btn-sm btn-primary" onclick="startTraining('advanced-investigation')">Continue</button>
                                <button class="btn btn-sm btn-secondary" onclick="completeModule('advanced-investigation')">Mark Complete</button>
                            </div>
                        </div>
                        
                        <div class="course-card">
                            <h3>🤖 AI Explainability</h3>
                            <div class="course-info">
                                <div class="course-meta">
                                    <span class="duration">3 hours</span>
                                    <span class="difficulty">Intermediate</span>
                                    <span class="status">Not Started</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 0%"></div>
                                </div>
                                <div class="progress-text">0% Complete</div>
                            </div>
                            <div class="course-actions">
                                <button class="btn btn-sm btn-primary" onclick="startTraining('ai-explainability')">Start</button>
                                <button class="btn btn-sm btn-secondary" onclick="completeModule('ai-explainability')">Mark Complete</button>
                            </div>
                        </div>
                        
                        <div class="course-card">
                            <h3>📊 Data Analysis Fundamentals</h3>
                            <div class="course-info">
                                <div class="course-meta">
                                    <span class="duration">5 hours</span>
                                    <span class="difficulty">Intermediate</span>
                                    <span class="status">Completed</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 100%"></div>
                                </div>
                                <div class="progress-text">100% Complete</div>
                            </div>
                            <div class="course-actions">
                                <button class="btn btn-sm btn-success" onclick="startTraining('data-analysis')">Review</button>
                                <button class="btn btn-sm btn-secondary" onclick="generateReport('certificate-data-analysis')">Certificate</button>
                            </div>
                        </div>
                        
                        <div class="course-card">
                            <h3>⚖️ Legal Compliance</h3>
                            <div class="course-info">
                                <div class="course-meta">
                                    <span class="duration">4 hours</span>
                                    <span class="difficulty">Intermediate</span>
                                    <span class="status">Completed</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 100%"></div>
                                </div>
                                <div class="progress-text">100% Complete</div>
                            </div>
                            <div class="course-actions">
                                <button class="btn btn-sm btn-success" onclick="startTraining('legal-compliance')">Review</button>
                                <button class="btn btn-sm btn-secondary" onclick="generateReport('certificate-legal-compliance')">Certificate</button>
                            </div>
                        </div>
                        
                        <div class="course-card">
                            <h3>🔐 Cybersecurity Basics</h3>
                            <div class="course-info">
                                <div class="course-meta">
                                    <span class="duration">3 hours</span>
                                    <span class="difficulty">Beginner</span>
                                    <span class="status">Completed</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 100%"></div>
                                </div>
                                <div class="progress-text">100% Complete</div>
                            </div>
                            <div class="course-actions">
                                <button class="btn btn-sm btn-success" onclick="startTraining('cybersecurity')">Review</button>
                                <button class="btn btn-sm btn-secondary" onclick="generateReport('certificate-cybersecurity')">Certificate</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="trainingProgressChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

// Initialize Investigator Charts
function initializeInvestigatorCharts() {
    // Workload Distribution Chart
    const workloadCtx = document.getElementById('workloadChart');
    if (workloadCtx) {
        new Chart(workloadCtx, {
            type: 'doughnut',
            data: {
                labels: ['Open Cases', 'Pending Review', 'Escalated', 'Closed'],
                datasets: [{
                    data: [8, 12, 3, 45],
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#8b5cf6',
                        '#10b981'
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

// Initialize AI Charts
function initializeAICharts() {
    // Anomaly Detection Chart
    const anomalyCtx = document.getElementById('anomalyChart');
    if (anomalyCtx) {
        new Chart(anomalyCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Normal Pattern',
                    data: [12, 15, 18, 14, 16, 11, 9],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Current Pattern',
                    data: [12, 15, 18, 14, 16, 11, 25],
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
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Claim Count'
                        }
                    }
                }
            }
        });
    }
}

// Investigator-specific functions
function openCase(caseId) {
    showInvestigationModal(caseId);
}

function openCaseFromAlert(claimId) {
    showInvestigationModal(claimId);
}

function refreshAlerts() {
    showNotification('Alerts Refreshed', 'Latest fraud alerts have been loaded', 'success');
}

function filterAlerts() {
    const providerFilter = document.getElementById('providerFilter').value;
    const claimTypeFilter = document.getElementById('claimTypeFilter').value;
    const severityFilter = document.getElementById('severityFilter').value;
    const riskFilter = document.getElementById('riskFilter').value;
    
    showNotification('Filters Applied', 'Alerts filtered successfully', 'info');
}

function escalateAlert(alertId) {
    showModal('Escalate Alert', `
        <div class="escalation-form">
            <div class="form-group">
                <label>Alert ID</label>
                <input type="text" value="${alertId}" readonly>
            </div>
            <div class="form-group">
                <label>Escalation Reason</label>
                <select>
                    <option>High financial risk</option>
                    <option>Provider collusion suspected</option>
                    <option>Legal implications</option>
                    <option>Media attention risk</option>
                </select>
            </div>
            <div class="form-group">
                <label>Escalate To</label>
                <select>
                    <option>Senior Investigator</option>
                    <option>Regulator</option>
                    <option>Legal Department</option>
                </select>
            </div>
            <div class="form-group">
                <label>Additional Notes</label>
                <textarea rows="3" placeholder="Provide escalation details..."></textarea>
            </div>
        </div>
    `, 'Submit Escalation');
}

function loadCaseDetails(caseId) {
    const caseDetails = document.getElementById('caseDetails');
    if (caseDetails) {
        // Update active state
        document.querySelectorAll('.case-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Update details (in real app, this would fetch from backend)
        caseDetails.innerHTML = `
            <div class="detail-section">
                <h5>Claim Information</h5>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Claim ID:</label>
                        <span>${caseId}</span>
                    </div>
                    <div class="detail-item">
                        <label>Client:</label>
                        <span>John Doe</span>
                    </div>
                    <div class="detail-item">
                        <label>Provider:</label>
                        <span>Dr. Smith</span>
                    </div>
                    <div class="detail-item">
                        <label>Amount:</label>
                        <span>$2,500</span>
                    </div>
                    <div class="detail-item">
                        <label>Date:</label>
                        <span>2024-01-15</span>
                    </div>
                    <div class="detail-item">
                        <label>Risk Score:</label>
                        <span class="risk-badge risk-high">0.87</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h5>Provider Profile</h5>
                <div class="provider-profile">
                    <div class="profile-header">
                        <span class="provider-name">Dr. Smith</span>
                        <span class="provider-specialty">Cardiology</span>
                    </div>
                    <div class="profile-stats">
                        <div class="stat-item">
                            <label>Total Claims:</label>
                            <span>245</span>
                        </div>
                        <div class="stat-item">
                            <label>Flag Rate:</label>
                            <span>12.5%</span>
                        </div>
                        <div class="stat-item">
                            <label>Years Active:</label>
                            <span>8</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        showNotification('Case Loaded', `Details for ${caseId} loaded successfully`, 'success');
    }
}

function saveNotes() {
    const notes = document.getElementById('investigatorNotes').value;
    if (notes.trim()) {
        showNotification('Notes Saved', 'Investigator notes have been saved', 'success');
    } else {
        showNotification('Error', 'Please enter notes before saving', 'error');
    }
}

function submitAIFeedback() {
    const helpfulness = document.querySelector('input[name="helpfulness"]:checked');
    const comments = document.querySelector('textarea').value;
    
    if (helpfulness) {
        showNotification('Feedback Submitted', 'Your AI explanation feedback has been recorded', 'success');
    } else {
        showNotification('Error', 'Please rate the explanation helpfulness', 'error');
    }
}

function assignCase() {
    showModal('Assign New Case', `
        <div class="assignment-form">
            <div class="form-group">
                <label>Case ID</label>
                <input type="text" value="CASE-NEW-001" readonly>
            </div>
            <div class="form-group">
                <label>Assign To</label>
                <select>
                    <option>Sarah Investigator</option>
                    <option>Mike Chen</option>
                    <option>Lisa Wong</option>
                    <option>Tom Davis</option>
                </select>
            </div>
            <div class="form-group">
                <label>Priority Level</label>
                <select>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
            </div>
            <div class="form-group">
                <label>Assignment Notes</label>
                <textarea rows="3" placeholder="Add assignment instructions..."></textarea>
            </div>
        </div>
    `, 'Assign Case');
}

function reassignCase() {
    showModal('Reassign Case', `
        <div class="reassignment-form">
            <div class="form-group">
                <label>Select Case</label>
                <select>
                    <option>CASE-001</option>
                    <option>CASE-002</option>
                    <option>CASE-003</option>
                </select>
            </div>
            <div class="form-group">
                <label>Reassign To</label>
                <select>
                    <option>Sarah Investigator</option>
                    <option>Mike Chen</option>
                    <option>Lisa Wong</option>
                </select>
            </div>
            <div class="form-group">
                <label>Reason for Reassignment</label>
                <textarea rows="3" placeholder="Explain why this case needs reassignment..."></textarea>
            </div>
        </div>
    `, 'Reassign Case');
}

function escalateToRegulator() {
    showModal('Escalate to Regulator', `
        <div class="regulator-escalation">
            <div class="form-group">
                <label>Case ID</label>
                <input type="text" value="CASE-001" readonly>
            </div>
            <div class="form-group">
                <label>Regulatory Body</label>
                <select>
                    <option>Healthcare Compliance Board</option>
                    <option>Medical Fraud Division</option>
                    <option>State Insurance Commission</option>
                </select>
            </div>
            <div class="form-group">
                <label>Escalation Justification</label>
                <textarea rows="4" placeholder="Provide detailed justification for regulatory escalation..."></textarea>
            </div>
            <div class="form-group">
                <label>Supporting Evidence</label>
                <div class="evidence-checklist">
                    <label>
                        <input type="checkbox"> Financial records
                    </label>
                    <label>
                        <input type="checkbox"> Provider statements
                    </label>
                    <label>
                        <input type="checkbox"> Client testimony
                    </label>
                    <label>
                        <input type="checkbox"> Expert analysis
                    </label>
                </div>
            </div>
        </div>
    `, 'Submit to Regulator');
}

function escalateToLegal() {
    showModal('Escalate to Legal', `
        <div class="legal-escalation">
            <div class="form-group">
                <label>Legal Department</label>
                <select>
                    <option>Internal Legal Team</option>
                    <option>External Counsel</option>
                    <option>Compliance Legal</option>
                </select>
            </div>
            <div class="form-group">
                <label>Legal Risk Assessment</label>
                <select>
                    <option>Criminal Investigation Likely</option>
                    <option>Civil Liability Possible</option>
                    <option>Regulatory Violation</option>
                    <option>Contractual Breach</option>
                </select>
            </div>
            <div class="form-group">
                <label>Urgency Level</label>
                <select>
                    <option>Immediate (24 hours)</option>
                    <option>High (48 hours)</option>
                    <option>Medium (1 week)</option>
                    <option>Low (2 weeks)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Legal Summary</label>
                <textarea rows="4" placeholder="Provide legal context and potential implications..."></textarea>
            </div>
        </div>
    `, 'Submit to Legal');
}

function createEscalationReport() {
    showNotification('Report Generated', 'Escalation report created and ready for review', 'success');
}

function startTraining(moduleId) {
    showModal('Training Module', `
        <div class="training-module">
            <h5>${moduleId.replace('-', ' ').toUpperCase()}</h5>
            <div class="training-content">
                <p>This training module will help you develop essential fraud detection skills.</p>
                <div class="training-objectives">
                    <h6>Learning Objectives:</h6>
                    <ul>
                        <li>Identify suspicious patterns</li>
                        <li>Understand investigation protocols</li>
                        <li>Apply analytical techniques</li>
                        <li>Document findings properly</li>
                    </ul>
                </div>
                <div class="training-duration">
                    <p><strong>Estimated Time:</strong> 45 minutes</p>
                    <p><strong>Difficulty:</strong> Medium</p>
                </div>
            </div>
        </div>
    `, 'Start Training');
}

function submitExerciseAnswer() {
    const answer = document.querySelector('input[name="exercise-answer"]:checked');
    if (answer) {
        const correctAnswer = 'review-history';
        if (answer.value === correctAnswer) {
            showNotification('Correct!', 'Excellent choice. Reviewing provider history is the best first step.', 'success');
        } else {
            showNotification('Not Quite', 'Consider reviewing the provider\'s claim history first to establish a baseline.', 'warning');
        }
    } else {
        showNotification('Error', 'Please select an answer', 'error');
    }
}

function getHint() {
    showNotification('Hint', 'Always establish a baseline by reviewing historical patterns before taking action.', 'info');
}

function skipExercise() {
    showNotification('Exercise Skipped', 'You can return to this exercise later from the training dashboard.', 'info');
}

function escalateAlert(alertId) {
    showModal('Escalate Alert', `
        <div class="escalation-form">
            <div class="form-group">
                <label>Alert ID</label>
                <input type="text" value="${alertId}" readonly>
            </div>
            <div class="form-group">
                <label>Escalation Reason</label>
                <select>
                    <option>High financial risk</option>
                    <option>Provider collusion suspected</option>
                    <option>Legal implications</option>
                    <option>Media attention risk</option>
                </select>
            </div>
            <div class="form-group">
                <label>Escalate To</label>
                <select>
                    <option>Senior Investigator</option>
                    <option>Regulator</option>
                    <option>Legal Department</option>
                </select>
            </div>
            <div class="form-group">
                <label>Additional Notes</label>
                <textarea rows="3" placeholder="Provide escalation details..."></textarea>
            </div>
        </div>
    `, 'Submit Escalation');
}

function loadCaseDetails(caseId) {
    const caseDetails = document.getElementById('caseDetails');
    if (caseDetails) {
        // Update active state
        document.querySelectorAll('.case-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Update details (in real app, this would fetch from backend)
        caseDetails.innerHTML = `
            <div class="detail-section">
                <h5>Claim Information</h5>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Claim ID:</label>
                        <span>${caseId}</span>
                    </div>
                    <div class="detail-item">
                        <label>Client:</label>
                        <span>John Doe</span>
                    </div>
                    <div class="detail-item">
                        <label>Provider:</label>
                        <span>Dr. Smith</span>
                    </div>
                    <div class="detail-item">
                        <label>Amount:</label>
                        <span>$2,500</span>
                    </div>
                    <div class="detail-item">
                        <label>Date:</label>
                        <span>2024-01-15</span>
                    </div>
                    <div class="detail-item">
                        <label>Risk Score:</label>
                        <span class="risk-badge risk-high">0.87</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h5>Provider Profile</h5>
                <div class="provider-profile">
                    <div class="profile-header">
                        <span class="provider-name">Dr. Smith</span>
                        <span class="provider-specialty">Cardiology</span>
                    </div>
                    <div class="profile-stats">
                        <div class="stat-item">
                            <label>Total Claims:</label>
                            <span>245</span>
                        </div>
                        <div class="stat-item">
                            <label>Flag Rate:</label>
                            <span>12.5%</span>
                        </div>
                        <div class="stat-item">
                            <label>Years Active:</label>
                            <span>8</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        showNotification('Case Loaded', `Details for ${caseId} loaded successfully`, 'success');
    }
}

function saveNotes() {
    const notes = document.getElementById('investigatorNotes').value;
    if (notes.trim()) {
        showNotification('Notes Saved', 'Investigator notes have been saved', 'success');
    } else {
        showNotification('Error', 'Please enter notes before saving', 'error');
    }
}

function submitAIFeedback() {
    const helpfulness = document.querySelector('input[name="helpfulness"]:checked');
    const comments = document.querySelector('textarea').value;
    
    if (helpfulness) {
        showNotification('Feedback Submitted', 'Your AI explanation feedback has been recorded', 'success');
    } else {
        showNotification('Error', 'Please rate the explanation helpfulness', 'error');
    }
}

function assignCase() {
    showModal('Assign New Case', `
        <div class="assignment-form">
            <div class="form-group">
                <label>Case ID</label>
                <input type="text" value="CASE-NEW-001" readonly>
            </div>
            <div class="form-group">
                <label>Assign To</label>
                <select>
                    <option>Sarah Investigator</option>
                    <option>Mike Chen</option>
                    <option>Lisa Wong</option>
                    <option>Tom Davis</option>
                </select>
            </div>
            <div class="form-group">
                <label>Priority Level</label>
                <select>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
            </div>
            <div class="form-group">
                <label>Assignment Notes</label>
                <textarea rows="3" placeholder="Add assignment instructions..."></textarea>
            </div>
        </div>
    `, 'Assign Case');
}

function reassignCase() {
    showModal('Reassign Case', `
        <div class="reassignment-form">
            <div class="form-group">
                <label>Select Case</label>
                <select>
                    <option>CASE-001</option>
                    <option>CASE-002</option>
                    <option>CASE-003</option>
                </select>
            </div>
            <div class="form-group">
                <label>Reassign To</label>
                <select>
                    <option>Sarah Investigator</option>
                    <option>Mike Chen</option>
                    <option>Lisa Wong</option>
                </select>
            </div>
            <div class="form-group">
                <label>Reason for Reassignment</label>
                <textarea rows="3" placeholder="Explain why this case needs reassignment..."></textarea>
            </div>
        </div>
    `, 'Reassign Case');
}

function escalateToRegulator() {
    showModal('Escalate to Regulator', `
        <div class="regulator-escalation">
            <div class="form-group">
                <label>Case ID</label>
                <input type="text" value="CASE-001" readonly>
            </div>
            <div class="form-group">
                <label>Regulatory Body</label>
                <select>
                    <option>Healthcare Compliance Board</option>
                    <option>Medical Fraud Division</option>
                    <option>State Insurance Commission</option>
                </select>
            </div>
            <div class="form-group">
                <label>Escalation Justification</label>
                <textarea rows="4" placeholder="Provide detailed justification for regulatory escalation..."></textarea>
            </div>
            <div class="form-group">
                <label>Supporting Evidence</label>
                <div class="evidence-checklist">
                    <label>
                        <input type="checkbox"> Financial records
                    </label>
                    <label>
                        <input type="checkbox"> Provider statements
                    </label>
                    <label>
                        <input type="checkbox"> Client testimony
                    </label>
                    <label>
                        <input type="checkbox"> Expert analysis
                    </label>
                </div>
            </div>
        </div>
    `, 'Submit to Regulator');
}

function escalateToLegal() {
    showModal('Escalate to Legal', `
        <div class="legal-escalation">
            <div class="form-group">
                <label>Legal Department</label>
                <select>
                    <option>Internal Legal Team</option>
                    <option>External Counsel</option>
                    <option>Compliance Legal</option>
                </select>
            </div>
            <div class="form-group">
                <label>Legal Risk Assessment</label>
                <select>
                    <option>Criminal Investigation Likely</option>
                    <option>Civil Liability Possible</option>
                    <option>Regulatory Violation</option>
                    <option>Contractual Breach</option>
                </select>
            </div>
            <div class="form-group">
                <label>Urgency Level</label>
                <select>
                    <option>Immediate (24 hours)</option>
                    <option>High (48 hours)</option>
                    <option>Medium (1 week)</option>
                    <option>Low (2 weeks)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Legal Summary</label>
                <textarea rows="4" placeholder="Provide legal context and potential implications..."></textarea>
            </div>
        </div>
    `, 'Submit to Legal');
}

function createEscalationReport() {
    showNotification('Report Generated', 'Escalation report created and ready for review', 'success');
}

function startTraining(moduleId) {
    showModal('Training Module', `
        <div class="training-module">
            <h5>${moduleId.replace('-', ' ').toUpperCase()}</h5>
            <div class="training-content">
                <p>This training module will help you develop essential fraud detection skills.</p>
                <div class="training-objectives">
                    <h6>Learning Objectives:</h6>
                    <ul>
                        <li>Identify suspicious patterns</li>
                        <li>Understand investigation protocols</li>
                        <li>Apply analytical techniques</li>
                        <li>Document findings properly</li>
                    </ul>
                </div>
                <div class="training-duration">
                    <p><strong>Estimated Time:</strong> 45 minutes</p>
                    <p><strong>Difficulty:</strong> Medium</p>
                </div>
            </div>
        </div>
    `, 'Start Training');
}

function submitExerciseAnswer() {
    const answer = document.querySelector('input[name="exercise-answer"]:checked');
    if (answer) {
        const correctAnswer = 'review-history';
        if (answer.value === correctAnswer) {
            showNotification('Correct!', 'Excellent choice. Reviewing provider history is the best first step.', 'success');
        } else {
            showNotification('Not Quite', 'Consider reviewing the provider\'s claim history first to establish a baseline.', 'warning');
        }
    } else {
        showNotification('Error', 'Please select an answer', 'error');
    }
}

function getHint() {
    showNotification('Hint', 'Always establish a baseline by reviewing historical patterns before taking action.', 'info');
}

function skipExercise() {
    showNotification('Exercise Skipped', 'You can return to this exercise later from the training dashboard.', 'info');
}
