from fastapi import FastAPI, HTTPException, Depends, status, Request
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
import time
from dotenv import load_dotenv
import logging

# Import error handlers
from error_handlers import (
    KMEDException, AuthenticationError, AuthorizationError, 
    ValidationError, DatabaseError, BusinessLogicError,
    setup_error_handlers, log_api_request, log_api_response,
    log_business_action, log_security_event, log_system_error,
    create_error_response, create_success_response
)

# Load environment variables
load_dotenv()

# Database imports
from sqlalchemy.orm import Session
from database import get_db, User, Claim, FraudAlert, AuditLog, BlockchainRecord

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('kmed.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="KMED Fraud Detection API", 
    version="1.0.0",
    description="Healthcare Fraud Detection System API"
)

# Setup error handlers
setup_error_handlers(app)

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
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
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

# Middleware for logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests and responses"""
    start_time = time.time()
    
    # Get user info if available
    user_id = None
    if "authorization" in request.headers:
        try:
            token = request.headers["authorization"].replace("Bearer ", "")
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
        except:
            pass
    
    log_api_request(request, user_id)
    
    response = await call_next(request)
    
    log_api_response(request, response.status_code, user_id)
    
    # Add processing time header
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

# Helper Functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    try:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        log_system_error("Token creation failed", {"error": str(e)})
        raise KMEDException("Failed to create authentication token", "TOKEN_ERROR")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            log_security_event("Invalid token - no username", details={"token": credentials.credentials[:20] + "..."})
            raise AuthenticationError("Invalid authentication credentials")
        return username
    except jwt.ExpiredSignatureError:
        log_security_event("Token expired", details={"token": credentials.credentials[:20] + "..."})
        raise AuthenticationError("Authentication token has expired")
    except jwt.PyJWTError as e:
        log_security_event("Invalid token", details={"error": str(e), "token": credentials.credentials[:20] + "..."})
        raise AuthenticationError("Invalid authentication token")

def get_current_user(username: str = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current user from database"""
    try:
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            log_security_event("User not found", details={"username": username})
            raise AuthenticationError("User not found")
        
        if not user.is_active:
            log_security_event("Inactive user attempted access", details={"username": username, "user_id": user.id})
            raise AuthenticationError("Account is disabled")
            
        return user
    except Exception as e:
        if isinstance(e, KMEDException):
            raise
        log_system_error("Database error getting user", {"username": username, "error": str(e)})
        raise DatabaseError("Failed to retrieve user information")

def check_role_permission(required_role: str, current_role: str):
    """Check if user has required role permission"""
    role_hierarchy = {
        "patient": 0,
        "provider": 1,
        "analyst": 2,
        "investigator": 3,
        "regulator": 4,
        "admin": 5
    }
    
    if role_hierarchy.get(current_role, 0) < role_hierarchy.get(required_role, 0):
        log_security_event("Insufficient permissions", details={
            "required_role": required_role,
            "current_role": current_role
        })
        raise AuthorizationError(f"Insufficient permissions. Required role: {required_role}")

def calculate_risk_score(claim_data: Dict[str, Any]) -> float:
    """Calculate risk score for claim"""
    try:
        base_score = 0.3
        
        # Amount-based risk
        amount = claim_data.get("amount", 0)
        if amount > 3000:
            base_score += 0.4
        elif amount > 2000:
            base_score += 0.2
        elif amount > 1000:
            base_score += 0.1
        
        # Provider pattern risk
        high_risk_providers = ["Dr. Smith"]
        provider_name = claim_data.get("provider_name", "")
        if provider_name in high_risk_providers:
            base_score += 0.2
        
        # Random factor for simulation
        base_score += random.uniform(-0.1, 0.1)
        
        return min(max(base_score, 0.0), 1.0)
    except Exception as e:
        log_system_error("Risk calculation failed", {"claim_data": claim_data, "error": str(e)})
        raise BusinessLogicError("Failed to calculate risk score")

# Authentication Endpoints
@app.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token"""
    try:
        user = db.query(User).filter(User.username == user_credentials.username.lower()).first()
        
        if not user or not pwd_context.verify(user_credentials.password, user.password_hash):
            log_security_event("Login failed", details={
                "username": user_credentials.username,
                "ip_address": request.client.host
            })
            raise AuthenticationError("Incorrect username or password")
        
        if not user.is_active:
            log_security_event("Login attempt on disabled account", details={
                "username": user_credentials.username,
                "user_id": user.id
            })
            raise AuthenticationError("Account is disabled")
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}
        )
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Log successful login
        log_business_action("user_login", user.id, details={
            "username": user.username,
            "role": user.role,
            "ip_address": request.client.host
        })
        
        # Create audit log
        audit_log = AuditLog(
            id=f"AUD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}",
            user_id=user.id,
            action="login",
            resource_type="user",
            resource_id=user.id,
            details=f"User {user.username} logged in successfully",
            ip_address=request.client.host
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
        
    except KMEDException:
        raise
    except Exception as e:
        log_system_error("Login process failed", {"username": user_credentials.username, "error": str(e)})
        raise DatabaseError("Authentication service temporarily unavailable")

@app.post("/auth/logout")
async def logout(request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Logout user"""
    try:
        # Log the logout
        log_business_action("user_logout", current_user.id, details={
            "username": current_user.username,
            "ip_address": request.client.host
        })
        
        audit_log = AuditLog(
            id=f"AUD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}",
            user_id=current_user.id,
            action="logout",
            resource_type="user",
            resource_id=current_user.id,
            details=f"User {current_user.username} logged out",
            ip_address=request.client.host
        )
        db.add(audit_log)
        db.commit()
        
        return create_success_response(message="Successfully logged out")
        
    except Exception as e:
        log_system_error("Logout process failed", {"user_id": current_user.id, "error": str(e)})
        raise DatabaseError("Logout service temporarily unavailable")

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
    try:
        query = db.query(Claim)
        
        # Apply filters based on user role
        if current_user.role == "provider":
            query = query.filter(Claim.provider_id == current_user.id)
        elif current_user.role == "patient":
            query = query.filter(Claim.patient_id == current_user.id)
        
        # Apply additional filters
        if status:
            query = query.filter(Claim.status == status)
        if risk_level:
            query = query.filter(Claim.risk_level == risk_level)
        
        claims = query.offset(skip).limit(limit).all()
        
        log_business_action("view_claims", current_user.id, details={
            "count": len(claims),
            "filters": {"status": status, "risk_level": risk_level}
        })
        
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
        
    except Exception as e:
        log_system_error("Failed to retrieve claims", {"user_id": current_user.id, "error": str(e)})
        raise DatabaseError("Failed to retrieve claims")

@app.post("/claims", response_model=ClaimResponse)
async def create_claim(
    claim_data: ClaimCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new claim"""
    try:
        # Check permissions
        if current_user.role not in ["provider", "admin"]:
            log_security_event("Unauthorized claim creation attempt", details={
                "user_id": current_user.id,
                "role": current_user.role
            })
            raise AuthorizationError("Not authorized to create claims")
        
        # Validate claim data
        if claim_data.amount <= 0:
            raise ValidationError("Claim amount must be positive")
        
        if claim_data.date > datetime.utcnow():
            raise ValidationError("Claim date cannot be in the future")
        
        # Generate claim ID
        claim_id = f"CLM{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}"
        
        # Calculate risk score
        claim_dict = claim_data.dict()
        risk_score = calculate_risk_score(claim_dict)
        
        # Determine risk level and status
        risk_level = "high" if risk_score > 0.7 else "medium" if risk_score > 0.4 else "low"
        status = "flagged" if risk_score > 0.8 else "investigation" if risk_score > 0.6 else "pending"
        
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
        log_business_action("create_claim", current_user.id, claim.id, details={
            "amount": claim_data.amount,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "status": status
        })
        
        audit_log = AuditLog(
            id=f"AUD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100, 999)}",
            user_id=current_user.id,
            action="create_claim",
            resource_type="claim",
            resource_id=claim.id,
            details=f"Created claim {claim.id} with risk score {risk_score:.2f}",
            ip_address=request.client.host
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
        
    except KMEDException:
        raise
    except Exception as e:
        log_system_error("Claim creation failed", {"user_id": current_user.id, "error": str(e)})
        raise DatabaseError("Failed to create claim")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return create_success_response(data={
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }, message="Service is running")

# Root endpoint
@app.get("/")
async def root():
    return create_success_response(data={
        "message": "KMED Fraud Detection API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }, message="API service is running")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
