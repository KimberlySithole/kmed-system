from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import hashlib
import random
import json

# Initialize FastAPI app
app = FastAPI(title="KMED Fraud Detection API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"

# Models
class User(BaseModel):
    id: str
    username: str
    email: str
    role: str
    name: str

class LoginCredentials(BaseModel):
    username: str
    password: str
    mfaCode: Optional[str] = None

class Claim(BaseModel):
    id: str
    patient: str
    provider: str
    amount: float
    date: str
    risk: str
    status: str

class FraudAlert(BaseModel):
    id: str
    type: str
    severity: str
    claim: str
    description: str
    timestamp: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Mock Database
MOCK_USERS = {
    "analyst": {
        "id": "USR001",
        "username": "analyst",
        "email": "analyst@kmed.com",
        "role": "analyst",
        "name": "John Analyst",
        "password": pwd_context.hash("password")
    },
    "investigator": {
        "id": "USR002",
        "username": "investigator",
        "email": "investigator@kmed.com",
        "role": "investigator",
        "name": "Sarah Investigator",
        "password": pwd_context.hash("password")
    },
    "admin": {
        "id": "USR003",
        "username": "admin",
        "email": "admin@kmed.com",
        "role": "admin",
        "name": "Mike Admin",
        "password": pwd_context.hash("password")
    },
    "provider": {
        "id": "USR004",
        "username": "provider",
        "email": "provider@kmed.com",
        "role": "provider",
        "name": "Dr. Smith",
        "password": pwd_context.hash("password")
    },
    "patient": {
        "id": "USR005",
        "username": "patient",
        "email": "patient@kmed.com",
        "role": "patient",
        "name": "Jane Patient",
        "password": pwd_context.hash("password")
    },
    "regulator": {
        "id": "USR006",
        "username": "regulator",
        "email": "regulator@kmed.com",
        "role": "regulator",
        "name": "Robert Regulator",
        "password": pwd_context.hash("password")
    }
}

MOCK_CLAIMS = [
    {
        "id": "CLM001",
        "patient": "John Doe",
        "provider": "Dr. Smith",
        "amount": 2500.0,
        "date": "2024-01-15",
        "risk": "high",
        "status": "flagged"
    },
    {
        "id": "CLM002",
        "patient": "Jane Smith",
        "provider": "Dr. Johnson",
        "amount": 1200.0,
        "date": "2024-01-14",
        "risk": "medium",
        "status": "pending"
    },
    {
        "id": "CLM003",
        "patient": "Bob Wilson",
        "provider": "Dr. Brown",
        "amount": 800.0,
        "date": "2024-01-13",
        "risk": "low",
        "status": "approved"
    },
    {
        "id": "CLM004",
        "patient": "Alice Davis",
        "provider": "Dr. Smith",
        "amount": 3500.0,
        "date": "2024-01-12",
        "risk": "high",
        "status": "investigation"
    },
    {
        "id": "CLM005",
        "patient": "Charlie Brown",
        "provider": "Dr. Davis",
        "amount": 600.0,
        "date": "2024-01-11",
        "risk": "low",
        "status": "approved"
    }
]

MOCK_ALERTS = [
    {
        "id": "ALT001",
        "type": "fraud",
        "severity": "high",
        "claim": "CLM001",
        "description": "Unusual billing pattern detected",
        "timestamp": "2024-01-15 10:30"
    },
    {
        "id": "ALT002",
        "type": "compliance",
        "severity": "medium",
        "claim": "CLM002",
        "description": "Missing documentation",
        "timestamp": "2024-01-15 09:15"
    },
    {
        "id": "ALT003",
        "type": "fraud",
        "severity": "high",
        "claim": "CLM004",
        "description": "Potential duplicate billing",
        "timestamp": "2024-01-14 16:45"
    }
]

# Helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_user(username: str) -> Optional[User]:
    user_data = MOCK_USERS.get(username)
    if user_data:
        return User(**user_data)
    return None

def calculate_risk_score(claim: Dict[str, Any]) -> float:
    """Simple risk calculation based on amount and patterns"""
    base_score = 0.3
    
    # Amount-based risk
    if claim["amount"] > 3000:
        base_score += 0.4
    elif claim["amount"] > 2000:
        base_score += 0.2
    elif claim["amount"] > 1000:
        base_score += 0.1
    
    # Provider pattern risk (mock)
    high_risk_providers = ["Dr. Smith"]
    if claim["provider"] in high_risk_providers:
        base_score += 0.2
    
    # Random factor for simulation
    base_score += random.uniform(-0.1, 0.1)
    
    return min(max(base_score, 0.0), 1.0)

# API Endpoints
@app.get("/")
async def root():
    return {"message": "KMED Fraud Detection API"}

@app.post("/auth/login", response_model=Token)
async def login(credentials: LoginCredentials):
    user_data = MOCK_USERS.get(credentials.username.lower())
    if not user_data or not pwd_context.verify(credentials.password, user_data["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(hours=24)
    access_token = create_access_token(
        data={"sub": user_data["username"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=User)
async def get_current_user(username: str = Depends(verify_token)):
    user = get_user(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/claims", response_model=List[Claim])
async def get_claims(username: str = Depends(verify_token)):
    """Get claims with risk assessment"""
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate risk scores for claims
    claims_with_risk = []
    for claim in MOCK_CLAIMS:
        risk_score = calculate_risk_score(claim)
        if risk_score > 0.7:
            risk_level = "high"
        elif risk_score > 0.4:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        claim_copy = claim.copy()
        claim_copy["risk"] = risk_level
        claims_with_risk.append(Claim(**claim_copy))
    
    return claims_with_risk

@app.get("/alerts", response_model=List[FraudAlert])
async def get_alerts(username: str = Depends(verify_token)):
    """Get fraud alerts"""
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return [FraudAlert(**alert) for alert in MOCK_ALERTS]

@app.get("/analytics/feature-importance")
async def get_feature_importance(username: str = Depends(verify_token)):
    """Get feature importance for fraud detection model"""
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "features": [
            {"name": "Billing Frequency", "importance": 0.85},
            {"name": "Amount Deviation", "importance": 0.78},
            {"name": "Provider History", "importance": 0.72},
            {"name": "Patient Pattern", "importance": 0.65},
            {"name": "Time of Day", "importance": 0.58}
        ]
    }

@app.get("/analytics/fraud-trends")
async def get_fraud_trends(username: str = Depends(verify_token)):
    """Get fraud trends over time"""
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "fraud_cases": [45, 52, 48, 58, 63, 55],
        "total_claims": [1200, 1350, 1180, 1420, 1580, 1350]
    }

@app.get("/analytics/model-metrics")
async def get_model_metrics(username: str = Depends(verify_token)):
    """Get model performance metrics"""
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "precision": 0.95,
        "recall": 0.92,
        "f1_score": 0.93,
        "accuracy": 0.94,
        "auc_roc": 0.96
    }

@app.get("/users", response_model=List[User])
async def get_users(username: str = Depends(verify_token)):
    """Get all users (admin only)"""
    user = get_user(username)
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return [User(**user_data) for user_data in MOCK_USERS.values()]

@app.get("/dashboard/metrics")
async def get_dashboard_metrics(username: str = Depends(verify_token)):
    """Get dashboard metrics"""
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    total_claims = len(MOCK_CLAIMS)
    high_risk_alerts = len([alert for alert in MOCK_ALERTS if alert["severity"] == "high"])
    
    return {
        "total_claims": total_claims,
        "high_risk_alerts": high_risk_alerts,
        "model_accuracy": 0.985,
        "pending_investigations": 3,
        "cases_closed_today": 12
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
