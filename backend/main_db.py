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
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database imports
from sqlalchemy.orm import Session
from database import get_db, User, Claim, FraudAlert, AuditLog, BlockchainRecord

# Initialize FastAPI app
app = FastAPI(title="KMED Fraud Detection API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic Models
class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    name: str
    is_active: bool
    last_login: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ClaimCreate(BaseModel):
    patient_name: str
    provider_name: str
    amount: float
    date: datetime
    description: Optional[str] = None

class ClaimResponse(BaseModel):
    id: str
    patient_name: str
    provider_name: str
    amount: float
    date: datetime
    risk_score: float
    risk_level: str
    status: str
    description: Optional[str]
    created_at: datetime

class FraudAlertResponse(BaseModel):
    id: str
    claim_id: str
    type: str
    severity: str
    description: str
    confidence_score: Optional[float]
    is_resolved: bool
    created_at: datetime

class AuditLogResponse(BaseModel):
    id: str
    user_id: str
    action: str
    resource_type: str
    resource_id: str
    details: Optional[str]
    created_at: datetime

# Helper Functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
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

def get_current_user(username: str = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

def calculate_risk_score(claim_data: Dict[str, Any]) -> float:
    """Simple risk calculation based on amount and patterns"""
    base_score = 0.3
    
    # Amount-based risk
    amount = claim_data.get("amount", 0)
    if amount > 3000:
        base_score += 0.4
    elif amount > 2000:
        base_score += 0.2
    elif amount > 1000:
        base_score += 0.1
    
    # Provider pattern risk (mock)
    high_risk_providers = ["Dr. Smith"]
    provider_name = claim_data.get("provider_name", "")
    if provider_name in high_risk_providers:
        base_score += 0.2
    
    # Random factor for simulation
    base_score += random.uniform(-0.1, 0.1)
    
    return min(max(base_score, 0.0), 1.0)

def get_risk_level(score: float) -> str:
    if score > 0.7:
        return "high"
    elif score > 0.4:
        return "medium"
    else:
        return "low"

def get_claim_status(score: float) -> str:
    if score > 0.8:
        return "flagged"
    elif score > 0.6:
        return "investigation"
    else:
        return random.choice(["pending", "approved"])

# Authentication Endpoints
@app.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token"""
    user = db.query(User).filter(User.username == user_credentials.username.lower()).first()
    
    if not user or not pwd_context.verify(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}
    )
    
    # Log the login
    audit_log = AuditLog(
        id=f"AUD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}",
        user_id=user.id,
        action="login",
        resource_type="user",
        resource_id=user.id,
        details=f"User {user.username} logged in successfully"
    )
    db.add(audit_log)
    db.commit()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "name": user.name,
            "is_active": user.is_active,
            "last_login": user.last_login
        }
    }

@app.post("/auth/logout")
async def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Logout user (client-side token removal)"""
    # Log the logout
    audit_log = AuditLog(
        id=f"AUD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}",
        user_id=current_user.id,
        action="logout",
        resource_type="user",
        resource_id=current_user.id,
        details=f"User {current_user.username} logged out"
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "Successfully logged out"}

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        role=current_user.role,
        name=current_user.name,
        is_active=current_user.is_active,
        last_login=current_user.last_login
    )

# Claims Endpoints
@app.get("/claims", response_model=List[ClaimResponse])
async def get_claims(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get claims with optional filtering"""
    query = db.query(Claim)
    
    # Apply filters based on user role
    if current_user.role == "provider":
        # Providers can only see their own claims
        query = query.filter(Claim.provider_id == current_user.id)
    elif current_user.role == "patient":
        # Patients can only see their own claims
        query = query.filter(Claim.patient_id == current_user.id)
    
    # Apply additional filters
    if status:
        query = query.filter(Claim.status == status)
    if risk_level:
        query = query.filter(Claim.risk_level == risk_level)
    
    claims = query.offset(skip).limit(limit).all()
    
    return [
        ClaimResponse(
            id=claim.id,
            patient_name=claim.patient_name,
            provider_name=claim.provider_name,
            amount=claim.amount,
            date=claim.date,
            risk_score=claim.risk_score,
            risk_level=claim.risk_level,
            status=claim.status,
            description=claim.description,
            created_at=claim.created_at
        )
        for claim in claims
    ]

@app.post("/claims", response_model=ClaimResponse)
async def create_claim(
    claim_data: ClaimCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new claim"""
    if current_user.role not in ["provider", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create claims"
        )
    
    # Generate claim ID
    claim_id = f"CLM{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}"
    
    # Calculate risk score
    claim_dict = claim_data.dict()
    risk_score = calculate_risk_score(claim_dict)
    risk_level = get_risk_level(risk_score)
    status = get_claim_status(risk_score)
    
    # Create claim
    claim = Claim(
        id=claim_id,
        patient_id="USR005",  # Default patient for demo
        provider_id=current_user.id if current_user.role == "provider" else "USR004",
        patient_name=claim_data.patient_name,
        provider_name=claim_data.provider_name,
        amount=claim_data.amount,
        date=claim_data.date,
        risk_score=risk_score,
        risk_level=risk_level,
        status=status,
        description=claim_data.description
    )
    
    db.add(claim)
    db.commit()
    db.refresh(claim)
    
    # Create fraud alert if high risk
    if risk_score > 0.7:
        alert_id = f"ALT{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}"
        fraud_alert = FraudAlert(
            id=alert_id,
            claim_id=claim.id,
            user_id="USR001",  # Analyst user
            type="fraud",
            severity="high" if risk_score > 0.8 else "medium",
            description=f"High risk claim detected with score {risk_score:.2f}",
            confidence_score=risk_score
        )
        db.add(fraud_alert)
        db.commit()
    
    # Log the action
    audit_log = AuditLog(
        id=f"AUD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}",
        user_id=current_user.id,
        action="create_claim",
        resource_type="claim",
        resource_id=claim.id,
        details=f"Created claim {claim.id} with risk score {risk_score:.2f}"
    )
    db.add(audit_log)
    db.commit()
    
    return ClaimResponse(
        id=claim.id,
        patient_name=claim.patient_name,
        provider_name=claim.provider_name,
        amount=claim.amount,
        date=claim.date,
        risk_score=claim.risk_score,
        risk_level=claim.risk_level,
        status=claim.status,
        description=claim.description,
        created_at=claim.created_at
    )

@app.put("/claims/{claim_id}/status")
async def update_claim_status(
    claim_id: str,
    new_status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update claim status"""
    if current_user.role not in ["admin", "investigator", "regulator"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update claim status"
        )
    
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
        )
    
    old_status = claim.status
    claim.status = new_status
    claim.updated_at = datetime.utcnow()
    db.commit()
    
    # Log the action
    audit_log = AuditLog(
        id=f"AUD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}",
        user_id=current_user.id,
        action="update_status",
        resource_type="claim",
        resource_id=claim.id,
        details=f"Updated claim status from {old_status} to {new_status}"
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": f"Claim {claim_id} status updated to {new_status}"}

@app.post("/claims/{claim_id}/flag")
async def flag_claim(
    claim_id: str,
    reason: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Flag a claim for investigation"""
    if current_user.role not in ["admin", "investigator", "analyst", "regulator"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to flag claims"
        )
    
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
        )
    
    # Update claim status
    claim.status = "flagged"
    claim.updated_at = datetime.utcnow()
    db.commit()
    
    # Create fraud alert
    alert_id = f"ALT{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}"
    fraud_alert = FraudAlert(
        id=alert_id,
        claim_id=claim.id,
        user_id=current_user.id,
        type="fraud",
        severity="high",
        description=reason or "Claim flagged for manual review",
        confidence_score=claim.risk_score
    )
    db.add(fraud_alert)
    db.commit()
    
    # Log the action
    audit_log = AuditLog(
        id=f"AUD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}",
        user_id=current_user.id,
        action="flag_claim",
        resource_type="claim",
        resource_id=claim.id,
        details=f"Flagged claim {claim_id}: {reason or 'Manual review required'}"
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": f"Claim {claim_id} flagged for investigation"}

# Fraud Alerts Endpoints
@app.get("/alerts", response_model=List[FraudAlertResponse])
async def get_alerts(
    skip: int = 0,
    limit: int = 100,
    severity: Optional[str] = None,
    type: Optional[str] = None,
    is_resolved: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get fraud alerts with optional filtering"""
    query = db.query(FraudAlert)
    
    # Apply filters
    if severity:
        query = query.filter(FraudAlert.severity == severity)
    if type:
        query = query.filter(FraudAlert.type == type)
    if is_resolved is not None:
        query = query.filter(FraudAlert.is_resolved == is_resolved)
    
    alerts = query.offset(skip).limit(limit).all()
    
    return [
        FraudAlertResponse(
            id=alert.id,
            claim_id=alert.claim_id,
            type=alert.type,
            severity=alert.severity,
            description=alert.description,
            confidence_score=alert.confidence_score,
            is_resolved=alert.is_resolved,
            created_at=alert.created_at
        )
        for alert in alerts
    ]

# Dashboard Metrics Endpoint
@app.get("/dashboard/metrics")
async def get_dashboard_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard metrics based on user role"""
    
    # Base metrics
    total_claims = db.query(Claim).count()
    high_risk_claims = db.query(Claim).filter(Claim.risk_level == "high").count()
    pending_alerts = db.query(FraudAlert).filter(FraudAlert.is_resolved == False).count()
    
    # Role-specific metrics
    if current_user.role == "provider":
        my_claims = db.query(Claim).filter(Claim.provider_id == current_user.id).count()
        my_flagged = db.query(Claim).filter(
            Claim.provider_id == current_user.id,
            Claim.status == "flagged"
        ).count()
        
        return {
            "total_claims": my_claims,
            "flagged_claims": my_flagged,
            "high_risk_alerts": db.query(FraudAlert).join(Claim).filter(
                Claim.provider_id == current_user.id,
                FraudAlert.is_resolved == False
            ).count(),
            "approval_rate": 0.75,  # Mock calculation
            "avg_claim_amount": 1500.0
        }
    
    elif current_user.role == "patient":
        my_claims = db.query(Claim).filter(Claim.patient_id == current_user.id).count()
        my_approved = db.query(Claim).filter(
            Claim.patient_id == current_user.id,
            Claim.status == "approved"
        ).count()
        
        return {
            "total_claims": my_claims,
            "approved_claims": my_approved,
            "pending_claims": db.query(Claim).filter(
                Claim.patient_id == current_user.id,
                Claim.status == "pending"
            ).count(),
            "approval_rate": my_approved / max(my_claims, 1),
            "total_amount": db.query(Claim).filter(
                Claim.patient_id == current_user.id,
                Claim.status == "approved"
            ).with_entities(Claim.amount).all()[0][0] if my_approved > 0 else 0
        }
    
    elif current_user.role in ["admin", "investigator", "regulator"]:
        return {
            "total_claims": total_claims,
            "high_risk_claims": high_risk_claims,
            "pending_alerts": pending_alerts,
            "resolved_today": db.query(FraudAlert).filter(
                FraudAlert.is_resolved == True,
                FraudAlert.resolved_at >= datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            ).count(),
            "active_users": db.query(User).filter(User.is_active == True).count(),
            "model_accuracy": 0.985,  # Mock ML model accuracy
            "fraud_detection_rate": high_risk_claims / max(total_claims, 1)
        }
    
    else:  # analyst
        return {
            "total_claims": total_claims,
            "high_risk_claims": high_risk_claims,
            "pending_alerts": pending_alerts,
            "cases_assigned": db.query(FraudAlert).filter(
                FraudAlert.user_id == current_user.id,
                FraudAlert.is_resolved == False
            ).count(),
            "cases_resolved_today": db.query(FraudAlert).filter(
                FraudAlert.user_id == current_user.id,
                FraudAlert.is_resolved == True,
                FraudAlert.resolved_at >= datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            ).count()
        }

# Users Endpoint (Admin only)
@app.get("/users", response_model=List[UserResponse])
async def get_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access user list"
        )
    
    users = db.query(User).all()
    
    return [
        UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            role=user.role,
            name=user.name,
            is_active=user.is_active,
            last_login=user.last_login
        )
        for user in users
    ]

# Root endpoint
@app.get("/")
async def root():
    return {"message": "KMED Fraud Detection API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
