// Analyst Dashboard Functions

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
window.viewClaim = function(claimId) {
    console.log('Viewing claim:', claimId);
    
    const claimDetails = {
        'CLM9845': {
            patient: 'Robert Johnson',
            patientId: 'P9845',
            date: '2024-01-15',
            amount: '$2,450.00',
            status: 'approved',
            provider: 'Dr. Michael Chen',
            diagnosis: 'M54.5',
            procedure: '99215',
            insurance: 'Blue Cross',
            submitted: '2024-01-15',
            approved: '2024-01-16',
            riskScore: '0.23',
            notes: 'High-complexity evaluation and management. All documentation verified.'
        },
        'CLM9846': {
            patient: 'Maria Garcia',
            patientId: 'P9846',
            date: '2024-01-14',
            amount: '$1,800.00',
            status: 'flagged',
            provider: 'Dr. Sarah Williams',
            diagnosis: 'J45.909',
            procedure: '99214',
            insurance: 'Aetna',
            submitted: '2024-01-14',
            approved: 'Under Review',
            riskScore: '7.8',
            notes: 'Flagged for unusual billing pattern. Requires additional documentation.'
        }
    };
    
    const claim = claimDetails[claimId] || claimDetails['CLM9845'];
    
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
                    <div class="detail-label">Risk Score</div>
                    <div class="detail-value">${claim.riskScore}</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Medical Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Provider</div>
                    <div class="detail-value">${claim.provider}</div>
                </div>
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
            ${claim.status === 'flagged' ? `<button class="btn btn-primary" onclick="investigateClaim('${claimId}')">🔍 Investigate</button>` : ''}
            <button class="btn btn-secondary" onclick="runAnalysis('${claimId}')">📊 Run Analysis</button>
        </div>
    `;
    
    showModal(`Claim Analysis - ${claimId}`, content);
};

window.viewSubmission = function(submissionId) {
    console.log('Viewing submission:', submissionId);
    
    const submissions = {
        'SUB001': {
            patient: 'John Smith',
            provider: 'Dr. Sarah Johnson',
            date: '2024-01-15',
            amount: '$1,250.00',
            status: 'submitted',
            diagnosis: 'A45.9',
            procedure: '99214',
            insurance: 'Blue Cross',
            documents: ['Patient Consent', 'Medical Record', 'Invoice', 'Lab Results'],
            validation: 'Passed',
            riskScore: '2.1',
            analysis: 'Low risk claim with complete documentation. No anomalies detected.'
        },
        'SUB002': {
            patient: 'Emily Davis',
            provider: 'Dr. Michael Chen',
            date: '2024-01-14',
            amount: '$3,200.00',
            status: 'under_review',
            diagnosis: 'M25.55',
            procedure: '99215',
            insurance: 'Medicare',
            documents: ['Patient Consent', 'Medical Record', 'MRI Report'],
            validation: 'Warning',
            riskScore: '6.8',
            analysis: 'Medium-high risk due to high value and incomplete documentation. Additional records required.'
        }
    };
    
    const submission = submissions[submissionId] || submissions['SUB001'];
    
    const content = `
        <div class="detail-section">
            <h4>Submission Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Submission ID</div>
                    <div class="detail-value">${submissionId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Patient</div>
                    <div class="detail-value">${submission.patient}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Provider</div>
                    <div class="detail-value">${submission.provider}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${submission.date}</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Claim Details</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Amount</div>
                    <div class="detail-value">${submission.amount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value"><span class="detail-status ${submission.status}">${submission.status.replace('_', ' ').charAt(0).toUpperCase() + submission.status.replace('_', ' ').slice(1)}</span></div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Risk Score</div>
                    <div class="detail-value">${submission.riskScore}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Validation</div>
                    <div class="detail-value"><span class="detail-status ${submission.validation === 'Passed' ? 'approved' : 'flagged'}">${submission.validation}</span></div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Medical Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Diagnosis</div>
                    <div class="detail-value">${submission.diagnosis}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Procedure</div>
                    <div class="detail-value">${submission.procedure}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Insurance</div>
                    <div class="detail-value">${submission.insurance}</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Analysis</h4>
            <div class="detail-item" style="grid-column: 1 / -1;">
                <div class="detail-value">${submission.analysis}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Attached Documents</h4>
            <div class="detail-grid">
                ${submission.documents.map(doc => `
                    <div class="detail-item">
                        <div class="detail-label">Document</div>
                        <div class="detail-value">${doc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="detail-actions">
            <button class="btn btn-primary" onclick="downloadSubmission('${submissionId}')">📥 Download All</button>
            <button class="btn btn-secondary" onclick="printSubmission('${submissionId}')">🖨️ Print</button>
            <button class="btn btn-secondary" onclick="editSubmission('${submissionId}')">✏️ Edit</button>
            <button class="btn btn-secondary" onclick="runDeepAnalysis('${submissionId}')">🔬 Deep Analysis</button>
        </div>
    `;
    
    showModal(`Submission Analysis - ${submissionId}`, content);
};

// Additional Analyst Functions
window.investigateClaim = function(claimId) {
    console.log('Investigating claim:', claimId);
    alert(`Opening detailed investigation for claim ${claimId}...`);
};

window.runAnalysis = function(claimId) {
    console.log('Running analysis on claim:', claimId);
    alert(`Running fraud analysis on claim ${claimId}...`);
};

window.runDeepAnalysis = function(submissionId) {
    console.log('Running deep analysis on submission:', submissionId);
    alert(`Running deep learning analysis on submission ${submissionId}...`);
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

// Content Generation Functions
function generateHomeContent() {
    return `
        <div class="analyst-home">
            <h2>Analyst Dashboard</h2>
            <div class="dashboard-grid">
                <div class="metric-card">
                    <h3>Claims Processed</h3>
                    <div class="metric-value">15,847</div>
                    <div class="metric-change positive">+12.3%</div>
                </div>
                <div class="metric-card">
                    <h3>% Flagged</h3>
                    <div class="metric-value">3.7%</div>
                    <div class="metric-change negative">+0.8%</div>
                </div>
                <div class="metric-card">
                    <h3>False Positives</h3>
                    <div class="metric-value">127</div>
                    <div class="metric-change positive">-15.2%</div>
                </div>
                <div class="metric-card">
                    <h3>Model Accuracy</h3>
                    <div class="metric-value">94.2%</div>
                    <div class="metric-change positive">+2.1%</div>
                </div>
            </div>
            
            <div class="trend-graphs">
                <h3>Claims Processing Trends</h3>
                <div class="chart-container">
                    <canvas id="claimsTrendChart"></canvas>
                </div>
            </div>
            
            <div class="quick-alerts">
                <h3>Quick Alerts</h3>
                <div class="alert-list">
                    <div class="alert-item high">
                        <strong>🚨 High Risk Pattern Detected</strong>
                        <p>Unusual billing activity from Provider PRV045</p>
                        <button class="btn btn-sm" onclick="loadDashboardContent('claims-stream')">Investigate</button>
                    </div>
                    <div class="alert-item medium">
                        <strong>⚠️ Model Drift Alert</strong>
                        <p>Precision drop detected in last 24 hours</p>
                        <button class="btn btn-sm" onclick="loadDashboardContent('model-metrics')">View Metrics</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateClaimsStreamContent() {
    return `
        <div class="claims-stream">
            <h2>Real-Time Claims Stream</h2>
            <div class="stream-dashboard">
                <div class="stream-filters">
                    <h3>Filter Claims</h3>
                    <div class="filter-controls">
                        <select class="form-select" id="riskFilter">
                            <option value="all">All Risk Levels</option>
                            <option value="high">High Risk (>0.8)</option>
                            <option value="medium">Medium Risk (0.5-0.8)</option>
                            <option value="low">Low Risk (<0.5)</option>
                        </select>
                        <select class="form-select" id="statusFilter">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="flagged">Flagged</option>
                            <option value="approved">Approved</option>
                        </select>
                        <input type="text" class="form-input" id="providerFilter" placeholder="Filter by provider ID">
                        <input type="date" class="form-input" id="dateFilter">
                    </div>
                </div>
                
                <div class="claims-table">
                    <h3>Live Claims Stream</h3>
                    <div class="table-container">
                        <table class="claims-stream-table">
                            <thead>
                                <tr>
                                    <th>Claim ID</th>
                                    <th>Timestamp</th>
                                    <th>Provider</th>
                                    <th>Patient</th>
                                    <th>Amount</th>
                                    <th>Risk Score</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="risk-high">
                                    <td><strong>CLM9847</strong></td>
                                    <td>2024-01-15 14:32:18</td>
                                    <td>PRV045</td>
                                    <td>PAT789</td>
                                    <td>$8,450</td>
                                    <td><span class="risk-score high">0.92</span></td>
                                    <td><span class="status-badge flagged">Flagged</span></td>
                                    <td>
                                        <button class="btn btn-sm" onclick="investigateClaim('CLM9847')">🔍 Investigate</button>
                                        <button class="btn btn-sm" onclick="flagClaim('CLM9847')">🚩 Flag</button>
                                    </td>
                                </tr>
                                <tr class="risk-medium">
                                    <td><strong>CLM9846</strong></td>
                                    <td>2024-01-15 14:31:45</td>
                                    <td>PRV023</td>
                                    <td>PAT456</td>
                                    <td>$2,150</td>
                                    <td><span class="risk-score medium">0.67</span></td>
                                    <td><span class="status-badge pending">Pending</span></td>
                                    <td>
                                        <button class="btn btn-sm" onclick="investigateClaim('CLM9846')">🔍 Investigate</button>
                                        <button class="btn btn-sm" onclick="approveClaim('CLM9846')">✅ Approve</button>
                                    </td>
                                </tr>
                                <tr class="risk-low">
                                    <td><strong>CLM9845</strong></td>
                                    <td>2024-01-15 14:30:22</td>
                                    <td>PRV012</td>
                                    <td>PAT123</td>
                                    <td>$450</td>
                                    <td><span class="risk-score low">0.23</span></td>
                                    <td><span class="status-badge approved">Approved</span></td>
                                    <td>
                                        <button class="btn btn-sm" onclick="viewClaim('CLM9845')">👁 View</button>
                                        <button class="btn btn-sm" onclick="downloadClaim('CLM9845')">📥 Download</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="stream-metrics">
                    <h3>Stream Metrics</h3>
                    <div class="metrics-grid">
                        <div class="metric-item">
                            <span class="metric-label">Claims/Minute:</span>
                            <span class="metric-value">24.7</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Avg Processing Time:</span>
                            <span class="metric-value">1.2s</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Flag Rate:</span>
                            <span class="metric-value">3.7%</span>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="streamVolumeChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateFeatureInsightsContent() {
    return `
        <div class="feature-insights">
            <h2>Feature Insights</h2>
            <div class="insights-dashboard">
                <div class="top-indicators">
                    <h3>Top Fraud Indicators</h3>
                    <div class="indicators-grid">
                        <div class="indicator-card">
                            <h4>💰 Amount Anomalies</h4>
                            <div class="indicator-value high">87.3%</div>
                            <p>Claims with unusually high amounts compared to historical patterns</p>
                            <div class="chart-container small">
                                <canvas id="amountAnomalyChart"></canvas>
                            </div>
                        </div>
                        <div class="indicator-card">
                            <h4>👨‍⚕️ Provider Risk Profiles</h4>
                            <div class="indicator-value medium">65.2%</div>
                            <p>Providers with elevated risk scores based on billing patterns</p>
                            <div class="chart-container small">
                                <canvas id="providerRiskChart"></canvas>
                            </div>
                        </div>
                        <div class="indicator-card">
                            <h4>⏰ Time-Based Patterns</h4>
                            <div class="indicator-value medium">58.9%</div>
                            <p>Claims submitted during unusual hours or patterns</p>
                            <div class="chart-container small">
                                <canvas id="timePatternChart"></canvas>
                            </div>
                        </div>
                        <div class="indicator-card">
                            <h4>🔄 Service Frequency</h4>
                            <div class="indicator-value high">72.1%</div>
                            <p>Unusual frequency of specific services for patients</p>
                            <div class="chart-container small">
                                <canvas id="serviceFreqChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="feature-importance">
                    <h3>Feature Importance Analysis</h3>
                    <div class="importance-chart">
                        <div class="chart-container">
                            <canvas id="featureImportanceChart"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="correlation-matrix">
                    <h3>Feature Correlation Matrix</h3>
                    <div class="correlation-grid">
                        <div class="correlation-item">
                            <span class="feature-pair">Amount × Provider Risk</span>
                            <span class="correlation-value high">0.82</span>
                        </div>
                        <div class="correlation-item">
                            <span class="feature-pair">Service Frequency × Time</span>
                            <span class="correlation-value medium">0.64</span>
                        </div>
                        <div class="correlation-item">
                            <span class="feature-pair">Patient History × Amount</span>
                            <span class="correlation-value low">0.31</span>
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
            <div class="graph-dashboard">
                <div class="collusion-networks">
                    <h3>Collusion Ring Detection</h3>
                    <div class="network-visualization">
                        <div class="network-stats">
                            <div class="stat-item">
                                <span class="stat-label">Active Rings:</span>
                                <span class="stat-value">7</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Suspicious Clusters:</span>
                                <span class="stat-value">23</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">High-Risk Connections:</span>
                                <span class="stat-value">156</span>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="collusionNetworkChart"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="suspicious-clusters">
                    <h3>Suspicious Clusters Analysis</h3>
                    <div class="clusters-list">
                        <div class="cluster-item high-risk">
                            <h4>🚨 Cluster A - High Risk</h4>
                            <div class="cluster-details">
                                <div><strong>Members:</strong> 12 providers, 47 patients</div>
                                <div><strong>Pattern:</strong> Circular billing with inflated amounts</div>
                                <div><strong>Total Value:</strong> $2.3M</div>
                                <div><strong>Risk Score:</strong> 0.94</div>
                            </div>
                            <button class="btn btn-primary" onclick="investigateCluster('A')">Investigate Cluster</button>
                        </div>
                        <div class="cluster-item medium-risk">
                            <h4>⚠️ Cluster B - Medium Risk</h4>
                            <div class="cluster-details">
                                <div><strong>Members:</strong> 5 providers, 18 patients</div>
                                <div><strong>Pattern:</strong> Service bundling anomalies</div>
                                <div><strong>Total Value:</strong> $847K</div>
                                <div><strong>Risk Score:</strong> 0.71</div>
                            </div>
                            <button class="btn btn-secondary" onclick="investigateCluster('B')">Investigate Cluster</button>
                        </div>
                    </div>
                </div>
                
                <div class="network-metrics">
                    <h3>Network Metrics</h3>
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <h4>Network Density</h4>
                            <div class="metric-value">0.23</div>
                            <p>Connection density in fraud network</p>
                        </div>
                        <div class="metric-card">
                            <h4>Centrality Score</h4>
                            <div class="metric-value">0.67</div>
                            <p>Importance of central nodes</p>
                        </div>
                        <div class="metric-card">
                            <h4>Clustering Coefficient</h4>
                            <div class="metric-value">0.45</div>
                            <p>Tendency to form clusters</p>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="graphMetricsChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateModelMetricsContent() {
    return `
        <div class="model-metrics">
            <h2>Model Metrics</h2>
            <div class="metrics-dashboard">
                <div class="performance-metrics">
                    <h3>Model Performance</h3>
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <h4>Accuracy</h4>
                            <div class="metric-value good">94.2%</div>
                            <div class="metric-trend positive">+2.1%</div>
                        </div>
                        <div class="metric-card">
                            <h4>Precision</h4>
                            <div class="metric-value good">91.7%</div>
                            <div class="metric-trend negative">-0.8%</div>
                        </div>
                        <div class="metric-card">
                            <h4>Recall</h4>
                            <div class="metric-value good">89.3%</div>
                            <div class="metric-trend positive">+1.5%</div>
                        </div>
                        <div class="metric-card">
                            <h4>F1 Score</h4>
                            <div class="metric-value good">90.5%</div>
                            <div class="metric-trend positive">+0.3%</div>
                        </div>
                    </div>
                </div>
                
                <div class="drift-monitoring">
                    <h3>Drift Monitoring</h3>
                    <div class="drift-indicators">
                        <div class="drift-item">
                            <h4>📊 Data Drift</h4>
                            <div class="drift-status warning">Moderate</div>
                            <p>Input distribution shift detected</p>
                            <div class="chart-container small">
                                <canvas id="dataDriftChart"></canvas>
                            </div>
                        </div>
                        <div class="drift-item">
                            <h4>🎯 Concept Drift</h4>
                            <div class="drift-status good">Low</div>
                            <p>Target patterns remain stable</p>
                            <div class="chart-container small">
                                <canvas id="conceptDriftChart"></canvas>
                            </div>
                        </div>
                        <div class="drift-item">
                            <h4>⚡ Performance Drift</h4>
                            <div class="drift-status warning">Moderate</div>
                            <p>Precision decline in last 24h</p>
                            <div class="chart-container small">
                                <canvas id="performanceDriftChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="explainability-panel">
                    <h3>Explainability Panel</h3>
                    <div class="explainability-content">
                        <div class="feature-importance">
                            <h4>Top Contributing Features</h4>
                            <div class="feature-list">
                                <div class="feature-item">
                                    <span class="feature-name">Claim Amount</span>
                                    <span class="feature-importance high">0.34</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-name">Provider Risk Score</span>
                                    <span class="feature-importance high">0.28</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-name">Service Frequency</span>
                                    <span class="feature-importance medium">0.19</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-name">Time Pattern</span>
                                    <span class="feature-importance medium">0.12</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="shap-explanation">
                            <h4>SHAP Values Analysis</h4>
                            <div class="chart-container">
                                <canvas id="shapChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="modelPerformanceChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function generateFraudSandboxContent() {
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

// Initialize Analyst Dashboard Charts
function initializeHomeCharts() {
    // Claims Volume Chart
    const volumeCtx = document.getElementById('claimsVolumeChart');
    if (volumeCtx) {
        new Chart(volumeCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Claims Volume',
                    data: [120, 135, 118, 142, 158, 135, 145],
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
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Fraud Detection Rate Chart
    const fraudCtx = document.getElementById('fraudDetectionChart');
    if (fraudCtx) {
        new Chart(fraudCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Detection Rate (%)',
                    data: [18.5, 22.1, 19.8, 25.3, 23.5, 20.2, 21.7],
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: '#ef4444',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        max: 30
                    }
                }
            }
        });
    }
}

// Initialize Feature Insights Charts
function initializeFeatureCharts() {
    // Feature Importance Chart
    const featureCtx = document.getElementById('featureImportanceChart');
    if (featureCtx) {
        new Chart(featureCtx, {
            type: 'bar',
            data: {
                labels: ['Claim Amount vs. Average', 'Submission Timing', 'Provider Risk Profile', 'Biometrics Score', 'Service Code Frequency'],
                datasets: [{
                    label: 'Importance Score',
                    data: [85, 78, 72, 65, 58],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(16, 185, 129, 0.6)',
                        'rgba(16, 185, 129, 0.5)',
                        'rgba(16, 185, 129, 0.4)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { max: 100 }
                }
            }
        });
    }

    // Fraud Types Pie Chart
    const pieCtx = document.getElementById('fraudTypesPieChart');
    if (pieCtx) {
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Upcoding', 'Unbundling', 'Phantom Billing', 'Double Billing', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#3b82f6',
                        '#8b5cf6',
                        '#10b981'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Initialize Network Graph
function initializeNetworkGraph() {
    const canvas = document.getElementById('networkGraph');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Network data
    const nodes = generateNetworkNodes();
    const edges = generateNetworkEdges(nodes);
    
    let selectedNode = null;
    let hoveredNode = null;
    let showLabels = true;
    let currentFilter = '';
    let animationFrame = null;
    let zoom = 1;
    let offsetX = 0;
    let offsetY = 0;
    
    // Generate nodes
    function generateNetworkNodes() {
        const nodes = [];
        const nodeTypes = ['client', 'provider', 'claim'];
        const riskLevels = ['low', 'medium', 'high'];
        
        for (let i = 0; i < 47; i++) {
            nodes.push({
                id: i,
                type: nodeTypes[i % 3],
                x: Math.random() * (width - 100) + 50,
                y: Math.random() * (height - 100) + 50,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                risk: riskLevels[Math.floor(Math.random() * 3)],
                label: `${nodeTypes[i % 3].charAt(0).toUpperCase() + nodeTypes[i % 3].slice(1)} ${i + 1}`,
                connections: 0,
                highlighted: false
            });
        }
        return nodes;
    }
    
    // Generate edges
    function generateNetworkEdges(nodes) {
        const edges = [];
        const connectionCount = 156;
        
        for (let i = 0; i < connectionCount; i++) {
            const source = Math.floor(Math.random() * nodes.length);
            const target = Math.floor(Math.random() * nodes.length);
            
            if (source !== target) {
                edges.push({
                    source: source,
                    target: target,
                    strength: Math.random()
                });
                nodes[source].connections++;
                nodes[target].connections++;
            }
        }
        return edges;
    }
    
    // Draw network
    function drawNetwork() {
        ctx.clearRect(0, 0, width, height);
        
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(zoom, zoom);
        
        // Draw edges
        edges.forEach(edge => {
            const sourceNode = nodes[edge.source];
            const targetNode = nodes[edge.target];
            
            // Apply filter
            if (currentFilter && sourceNode.risk !== currentFilter && targetNode.risk !== currentFilter) {
                return;
            }
            
            ctx.beginPath();
            ctx.moveTo(sourceNode.x, sourceNode.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.strokeStyle = `rgba(100, 116, 139, ${edge.strength * 0.3})`;
            ctx.lineWidth = edge.strength * 2;
            ctx.stroke();
        });
        
        // Draw nodes
        nodes.forEach(node => {
            // Apply filter
            if (currentFilter && node.risk !== currentFilter) {
                return;
            }
            
            const radius = 8 + node.connections * 0.5;
            
            // Node color based on type and risk
            let color = '#3b82f6'; // client - blue
            if (node.type === 'provider') color = '#f59e0b'; // provider - orange
            if (node.type === 'claim') color = '#10b981'; // claim - green
            
            // Risk overlay
            if (node.risk === 'high') color = '#ef4444';
            if (node.risk === 'medium' && node.highlighted) color = '#f59e0b';
            
            // Highlight effect
            if (node.highlighted || node === hoveredNode) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = color;
            }
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // Draw labels
            if (showLabels) {
                ctx.fillStyle = '#374151';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y - radius - 5);
            }
        });
        
        ctx.restore();
    }
    
    // Animation loop
    function animate() {
        // Update node positions (simple physics simulation)
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off walls
            if (node.x < 20 || node.x > width - 20) node.vx *= -0.8;
            if (node.y < 20 || node.y > height - 20) node.vy *= -0.8;
            
            // Apply friction
            node.vx *= 0.99;
            node.vy *= 0.99;
        });
        
        drawNetwork();
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Mouse interactions
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - offsetX) / zoom;
        const y = (e.clientY - rect.top - offsetY) / zoom;
        
        hoveredNode = null;
        nodes.forEach(node => {
            const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
            if (dist < 15) {
                hoveredNode = node;
                canvas.style.cursor = 'pointer';
                return;
            }
        });
        
        if (!hoveredNode) {
            canvas.style.cursor = 'default';
        }
    });
    
    canvas.addEventListener('click', (e) => {
        if (hoveredNode) {
            selectedNode = hoveredNode;
            showNodeDetails(selectedNode);
        }
    });
    
    // Start animation
    animate();
    
    // Store network data for other functions
    window.networkData = { nodes, edges, drawNetwork, ctx, canvas, width, height };
}

// Show node details
function showNodeDetails(node) {
    showModal('Node Details', `
        <div class="node-details">
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Node ID:</label>
                    <span>${node.id}</span>
                </div>
                <div class="detail-item">
                    <label>Type:</label>
                    <span>${node.type.charAt(0).toUpperCase() + node.type.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <label>Risk Level:</label>
                    <span class="risk-badge risk-${node.risk}">${node.risk.toUpperCase()}</span>
                </div>
                <div class="detail-item">
                    <label>Connections:</label>
                    <span>${node.connections}</span>
                </div>
                <div class="detail-item">
                    <label>Position:</label>
                    <span>X: ${Math.round(node.x)}, Y: ${Math.round(node.y)}</span>
                </div>
            </div>
            <div class="form-group">
                <label>Investigation Notes:</label>
                <textarea rows="3" placeholder="Add notes about this node..."></textarea>
            </div>
        </div>
    `, 'Save Notes');
}

// Network analysis functions
function resetZoom() {
    if (window.networkData) {
        window.networkData.zoom = 1;
        window.networkData.offsetX = 0;
        window.networkData.offsetY = 0;
        showNotification('Zoom Reset', 'Graph zoom reset to default', 'info');
    }
}

function exportGraph() {
    if (window.networkData && window.networkData.canvas) {
        const canvas = window.networkData.canvas;
        const link = document.createElement('a');
        link.download = 'network-graph.png';
        link.href = canvas.toDataURL();
        link.click();
        showNotification('Graph Exported', 'Network graph snapshot saved', 'success');
    }
}

function filterGraphByRisk(riskLevel) {
    if (window.networkData) {
        window.networkData.currentFilter = riskLevel;
        
        // Update stats
        const filteredNodes = window.networkData.nodes.filter(node => 
            !riskLevel || node.risk === riskLevel
        );
        
        document.getElementById('totalNodes').textContent = filteredNodes.length;
        document.getElementById('highRiskNodes').textContent = 
            filteredNodes.filter(n => n.risk === 'high').length;
        
        showNotification('Graph Filtered', `Showing ${riskLevel || 'all'} risk nodes`, 'info');
    }
}

function investigateCluster(clusterId) {
    showModal('Cluster Investigation', `
        <div class="cluster-investigation">
            <h5>Cluster ${clusterId.toUpperCase()} Analysis</h5>
            <div class="cluster-stats">
                <div class="stat-item">
                    <label>Cluster Size:</label>
                    <span>${clusterId === 'alpha' ? 12 : clusterId === 'beta' ? 8 : 6} nodes</span>
                </div>
                <div class="stat-item">
                    <label>Risk Level:</label>
                    <span class="risk-badge risk-${clusterId === 'alpha' ? 'high' : clusterId === 'beta' ? 'medium' : 'low'}">
                        ${clusterId === 'alpha' ? 'HIGH' : clusterId === 'beta' ? 'MEDIUM' : 'LOW'}
                    </span>
                </div>
                <div class="stat-item">
                    <label>Suspicion Score:</label>
                    <span>${clusterId === 'alpha' ? '0.87' : clusterId === 'beta' ? '0.65' : '0.34'}</span>
                </div>
            </div>
            <div class="form-group">
                <label>Investigation Priority:</label>
                <select>
                    <option value="critical">Critical</option>
                    <option value="high" selected>High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <div class="form-group">
                <label>Action Required:</label>
                <textarea rows="3" placeholder="Describe required investigation actions..."></textarea>
            </div>
        </div>
    `, 'Create Investigation Case');
}

function findShortestPath() {
    if (window.networkData) {
        // Simulate shortest path calculation
        const nodes = window.networkData.nodes.slice(0, 5);
        const path = nodes.map(n => n.label).join(' → ');
        
        showNotification('Path Analysis', `Shortest path found: ${path}`, 'success');
        
        // Highlight path nodes
        nodes.forEach(node => node.highlighted = true);
        setTimeout(() => {
            nodes.forEach(node => node.highlighted = false);
        }, 3000);
    }
}

function detectCommunities() {
    if (window.networkData) {
        // Simulate community detection
        const communities = Math.floor(Math.random() * 5) + 3;
        
        showNotification('Community Detection', `Detected ${communities} distinct communities in the network`, 'success');
        
        // Update cluster count
        document.getElementById('totalClusters').textContent = communities;
    }
}

function calculateCentrality() {
    if (window.networkData) {
        // Simulate centrality calculation
        const centralNode = window.networkData.nodes.reduce((prev, current) => 
            prev.connections > current.connections ? prev : current
        );
        
        showNotification('Centrality Analysis', `Most central node: ${centralNode.label} (${centralNode.connections} connections)`, 'info');
        
        // Highlight central node
        centralNode.highlighted = true;
        setTimeout(() => {
            centralNode.highlighted = false;
        }, 3000);
    }
}

function toggleNodeLabels() {
    if (window.networkData) {
        window.networkData.showLabels = !window.networkData.showLabels;
        showNotification('Labels Toggled', `Node labels ${window.networkData.showLabels ? 'shown' : 'hidden'}`, 'info');
    }
}

function highlightHighRiskNodes() {
    if (window.networkData) {
        const highRiskNodes = window.networkData.nodes.filter(n => n.risk === 'high');
        
        showNotification('High Risk Highlighted', `${highRiskNodes.length} high-risk nodes highlighted in red`, 'warning');
        
        // Highlight high risk nodes
        highRiskNodes.forEach(node => node.highlighted = true);
        setTimeout(() => {
            highRiskNodes.forEach(node => node.highlighted = false);
        }, 5000);
    }
}

function showRiskHeatmap() {
    showModal('Risk Heatmap Analysis', `
        <div class="risk-heatmap">
            <h5>Network Risk Distribution</h5>
            <div class="heatmap-grid">
                <div class="heatmap-row">
                    <div class="heatmap-cell risk-high" style="width: 25%">High Risk: 25%</div>
                    <div class="heatmap-cell risk-medium" style="width: 45%">Medium Risk: 45%</div>
                    <div class="heatmap-cell risk-low" style="width: 30%">Low Risk: 30%</div>
                </div>
            </div>
            <div class="risk-summary">
                <p><strong>Risk Concentration Areas:</strong></p>
                <ul>
                    <li>Provider Network Alpha: 8 high-risk connections</li>
                    <li>Client Cluster Beta: 5 medium-risk nodes</li>
                    <li>Claim Processing Hub: 3 low-risk anomalies</li>
                </ul>
            </div>
        </div>
    `, 'Close');
}

function generateRiskReport() {
    const reportData = {
        timestamp: new Date().toISOString(),
        totalNodes: window.networkData ? window.networkData.nodes.length : 47,
        highRiskNodes: window.networkData ? window.networkData.nodes.filter(n => n.risk === 'high').length : 12,
        clusters: document.getElementById('totalClusters').textContent,
        density: document.getElementById('networkDensity').textContent,
        recommendations: [
            'Investigate high-risk provider clusters immediately',
            'Monitor medium-risk nodes for pattern changes',
            'Review claim processing workflows for anomalies'
        ]
    };
    
    const csvContent = convertToCSV([reportData]);
    exportToCSV([reportData], 'network-risk-report.csv');
    
    showNotification('Report Generated', 'Network risk analysis report exported', 'success');
}

function animateNetwork() {
    if (window.networkData) {
        // Add random velocity to nodes for animation
        window.networkData.nodes.forEach(node => {
            node.vx = (Math.random() - 0.5) * 2;
            node.vy = (Math.random() - 0.5) * 2;
        });
        
        showNotification('Animation Started', 'Network animation activated for 10 seconds', 'info');
        
        // Stop animation after 10 seconds
        setTimeout(() => {
            window.networkData.nodes.forEach(node => {
                node.vx *= 0.1;
                node.vy *= 0.1;
            });
        }, 10000);
    }
}

// Initialize Model Metrics Charts
function initializeModelCharts() {
    // Drift Chart
    const driftCtx = document.getElementById('driftChart');
    if (driftCtx) {
        new Chart(driftCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Current Data',
                    data: [0.82, 0.85, 0.81, 0.83],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3
                }, {
                    label: 'Training Data',
                    data: [0.80, 0.83, 0.82, 0.84],
                    borderColor: '#64748b',
                    backgroundColor: 'rgba(100, 116, 139, 0.1)',
                    borderWidth: 3,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 0.7, max: 0.9 }
                }
            }
        });
    }
}

// Analyst-specific functions
function refreshAlerts() {
    showNotification('Alerts Refreshed', 'Latest alerts have been loaded', 'success');
}

function investigateClaim(claimId) {
    showInvestigationModal(claimId);
}

function sendToInvestigator(claimId) {
    showNotification('Claim Sent', `Claim ${claimId} sent to investigator`, 'success');
}

function markAsLegitimate(claimId) {
    showNotification('Claim Marked', `Claim ${claimId} marked as legitimate`, 'success');
}

function filterClaims() {
    // Implement claims filtering logic
    const providerFilter = document.getElementById('providerFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const amountFilter = document.getElementById('amountFilter').value;
    const riskFilter = document.getElementById('riskFilter').value;
    
    showNotification('Filters Applied', 'Claims filtered successfully', 'info');
}

function pauseStream() {
    showNotification('Stream Paused', 'Real-time updates paused', 'info');
}

function exportClaims() {
    exportToCSV(mockData.claims, 'claims_export.csv');
}

function resetZoom() {
    showNotification('Zoom Reset', 'Graph zoom reset to default', 'info');
}

function exportGraph() {
    showNotification('Graph Exported', 'Network graph snapshot saved', 'success');
}

function filterGraphByRisk(riskLevel) {
    showNotification('Graph Filtered', `Showing ${riskLevel || 'all'} risk nodes`, 'info');
}

function investigateCluster(clusterId) {
    showInvestigationModal(`Cluster ${clusterId}`);
}

function findShortestPath() {
    showNotification('Path Analysis', 'Shortest path calculation completed', 'info');
}

function detectCommunities() {
    showNotification('Community Detection', 'Network communities identified', 'info');
}

function calculateCentrality() {
    showNotification('Centrality Analysis', 'Node centrality scores calculated', 'info');
}

function highlightHighRiskNodes() {
    showNotification('High Risk Highlighted', 'High-risk nodes highlighted in red', 'warning');
}

function showRiskHeatmap() {
    showNotification('Risk Heatmap', 'Risk heatmap overlay applied', 'info');
}

function generateRiskReport() {
    exportToCSV([], 'risk_analysis_report.csv');
    showNotification('Report Generated', 'Risk analysis report exported', 'success');
}

function refreshMetrics() {
    showNotification('Metrics Refreshed', 'Latest model metrics loaded', 'success');
}

function viewFullExplanation(claimId) {
    showModal('XAI Full Report', `
        <div class="xai-report">
            <h5>Complete Explainability Analysis for ${claimId}</h5>
            <div class="xai-details">
                <p><strong>SHAP Values:</strong> Detailed contribution breakdown</p>
                <p><strong>LIME Analysis:</strong> Local interpretation</p>
                <p><strong>Counterfactuals:</strong> What-if scenarios</p>
                <p><strong>Feature Attribution:</strong> Complete feature impact analysis</p>
            </div>
        </div>
    `, 'Close');
}

function generateScenario() {
    const fraudType = document.querySelector('input[name="fraudType"]:checked').value;
    const claimCount = document.getElementById('claimCount').value;
    const severity = document.getElementById('severityLevel').value;
    const providerRisk = document.getElementById('providerRisk').value;
    const timePeriod = document.getElementById('timePeriod').value;
    
    // Update model response viewer
    document.getElementById('detectionRate').textContent = '87.3%';
    document.getElementById('falsePositives').textContent = '2';
    document.getElementById('avgRiskScore').textContent = '0.74';
    document.getElementById('processingTime').textContent = '1.2s';
    
    // Generate mock predictions
    const predictionsList = document.getElementById('predictionsList');
    predictionsList.innerHTML = Array.from({length: Math.min(5, claimCount)}, (_, i) => `
        <div class="prediction-item">
            <span>SIM${String(i + 1).padStart(3, '0')}</span>
            <span class="prediction-${Math.random() > 0.5 ? 'fraud' : 'legitimate'}">
                ${Math.random() > 0.5 ? 'FRAUD' : 'LEGITIMATE'} (${(Math.random() * 0.9 + 0.1).toFixed(2)})
            </span>
        </div>
    `).join('');
    
    showNotification('Scenario Generated', `${fraudType} scenario with ${claimCount} claims created`, 'success');
}

function resetScenario() {
    document.getElementById('claimCount').value = 10;
    document.getElementById('severityLevel').value = 'medium';
    document.getElementById('providerRisk').value = 'clean';
    document.getElementById('timePeriod').value = '1week';
    
    // Reset response viewer
    document.getElementById('detectionRate').textContent = '-';
    document.getElementById('falsePositives').textContent = '-';
    document.getElementById('avgRiskScore').textContent = '-';
    document.getElementById('processingTime').textContent = '-';
    document.getElementById('predictionsList').innerHTML = '<p class="placeholder">Generate a scenario to see model predictions</p>';
    
    showNotification('Scenario Reset', 'All parameters reset to default', 'info');
}

function exportResults() {
    exportToCSV([], 'simulation_results.csv');
    showNotification('Results Exported', 'Simulation results saved to file', 'success');
}

function compareWithBaseline() {
    showNotification('Comparison Ready', 'Baseline comparison data loaded', 'info');
}

function tagError(claimId, errorType) {
    showNotification('Error Tagged', `Claim ${claimId} tagged as ${errorType}`, 'warning');
}

function markCorrect(claimId) {
    showNotification('Marked Correct', `Claim ${claimId} marked as correct prediction`, 'success');
}

function submitFeedback() {
    showNotification('Feedback Submitted', 'Model error feedback sent for retraining', 'success');
}

function previousPage() {
    showNotification('Navigation', 'Previous page', 'info');
}

function nextPage() {
    showNotification('Navigation', 'Next page', 'info');
}
