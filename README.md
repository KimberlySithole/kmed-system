# KMED - Healthcare Fraud Detection System

A comprehensive healthcare fraud detection platform with role-based dashboards and real-time analytics.

## 🎨 Theme & Design
- **Primary Colors:** White background with green accents (#10b981)
- **Alert Color:** Red for fraud warnings and critical alerts
- **Layout:** Clean, professional design with sidebar navigation

## 🏗️ Architecture

### Frontend (HTML + CSS + JavaScript)
- **Login Page:** White background, green accents, MFA support
- **Global Layout:** Fixed sidebar, topbar with notifications, main content area
- **Role-Based Dashboards:** Six different user roles with specialized interfaces

### Backend (Python FastAPI)
- **Authentication:** JWT-based authentication with role management
- **APIs:** RESTful endpoints for claims, alerts, analytics
- **Fraud Detection:** Mock risk scoring algorithms
- **Data Management:** In-memory mock database (easily replaceable with PostgreSQL)

## 👥 User Roles & Dashboards

### 🟩 Analyst Dashboard
- **Features:** Claims stream, feature insights, graph analytics, model metrics, sandbox
- **Tools:** Real-time claims table, feature importance charts, fraud network visualization

### 🟩 Investigator Dashboard  
- **Features:** Fraud alerts queue, case files, explainable AI, workflow tools, training
- **Tools:** Alert management, case tracking, workflow automation

### 🟩 Admin Dashboard
- **Features:** Access control, member management, compliance monitoring, system health
- **Tools:** User management, audit logs, system metrics

### 🟩 Provider Dashboard
- **Features:** Claim status tracker, risk score overview, compliance feedback, self-audit
- **Tools:** Claim monitoring, risk assessment, compliance tools

### 🟩 Patient Dashboard
- **Features:** Claim history, appeal tracker, fraud protection, transparency reports
- **Tools:** Timeline view, appeal status, fraud alerts

### 🟩 Regulator Dashboard
- **Features:** Fraud trends, audit logs, bias auditing, blockchain verification, benchmarking
- **Tools:** Regional analytics, compliance reports, industry comparisons

## 🚀 Getting Started

### Prerequisites
- Node.js (for frontend development)
- Python 3.8+ (for backend)
- Modern web browser

### Frontend Setup
1. Open `index.html` in your web browser
2. No build process required - pure HTML/CSS/JS

### Backend Setup
1. Navigate to the `backend` directory
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API server:
   ```bash
   python main.py
   ```
4. API will be available at `http://localhost:8000`

### Demo Login
Use these credentials to test different roles:
- **Username:** analyst, investigator, admin, provider, patient, regulator
- **Password:** password
- **MFA:** Optional (leave blank for demo)

## 📊 Key Features

### Real-time Fraud Detection
- Risk scoring algorithms
- Pattern recognition
- Alert generation
- Case management

### Analytics & Visualization
- Feature importance charts
- Fraud trend analysis
- Model performance metrics
- Regional heatmaps

### Compliance & Audit
- Audit trail logging
- Bias detection
- Regulatory reporting
- Blockchain verification (mock)

### User Management
- Role-based access control
- Authentication & authorization
- Activity monitoring
- Profile management

## 🔧 Technology Stack

### Frontend
- **HTML5:** Semantic structure
- **CSS3:** Styling with Tailwind-inspired classes
- **JavaScript (ES6+):** Dynamic functionality, Chart.js integration
- **Font Awesome:** Icons
- **Chart.js:** Data visualization

### Backend
- **FastAPI:** Modern Python web framework
- **Pydantic:** Data validation
- **JWT:** Authentication tokens
- **SQLAlchemy:** Database ORM (ready for PostgreSQL)
- **Scikit-learn:** Machine learning (fraud detection models)

## 🎯 Security Features
- JWT-based authentication
- Role-based authorization
- MFA support (mock implementation)
- Secure password hashing
- CORS protection

## 📱 Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-friendly controls
- Progressive enhancement

## 🔮 Future Enhancements
- Real database integration (PostgreSQL)
- Advanced ML models
- Real blockchain implementation
- Mobile app development
- Advanced analytics dashboard
- API rate limiting
- Enhanced security features

## 📝 API Documentation
Once the backend is running, visit:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is for demonstration purposes only.
