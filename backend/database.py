from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://kmed_user:password@localhost:5432/kmed_db")

# Create engine
engine = create_engine(DATABASE_URL)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class
Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    patient_claims = relationship("Claim", foreign_keys="Claim.patient_id", back_populates="patient")
    provider_claims = relationship("Claim", foreign_keys="Claim.provider_id", back_populates="provider")
    created_alerts = relationship("FraudAlert", foreign_keys="FraudAlert.user_id", back_populates="creator")
    resolved_alerts = relationship("FraudAlert", foreign_keys="FraudAlert.resolved_by", back_populates="resolver")
    audit_logs = relationship("AuditLog", back_populates="user")
    blockchain_records = relationship("BlockchainRecord", back_populates="verifier")

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(String, primary_key=True)
    patient_id = Column(String, ForeignKey("users.id"), nullable=False)
    provider_id = Column(String, ForeignKey("users.id"), nullable=False)
    patient_name = Column(String, nullable=False)
    provider_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)  # low, medium, high
    status = Column(String, nullable=False)  # pending, approved, denied, flagged, investigation
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patient = relationship("User", foreign_keys=[patient_id], back_populates="patient_claims")
    provider = relationship("User", foreign_keys=[provider_id], back_populates="provider_claims")
    alerts = relationship("FraudAlert", back_populates="claim")

class FraudAlert(Base):
    __tablename__ = "fraud_alerts"
    
    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # fraud, compliance, bias
    severity = Column(String, nullable=False)  # low, medium, high, critical
    description = Column(Text, nullable=False)
    confidence_score = Column(Float, nullable=True)
    is_resolved = Column(Boolean, default=False)
    resolved_by = Column(String, ForeignKey("users.id"), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    # Relationships
    claim = relationship("Claim", back_populates="alerts")
    creator = relationship("User", foreign_keys=[user_id], back_populates="created_alerts")
    resolver = relationship("User", foreign_keys=[resolved_by], back_populates="resolved_alerts")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)  # login, view_claim, update_status, etc.
    resource_type = Column(String, nullable=False)  # claim, alert, user
    resource_id = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")

class BlockchainRecord(Base):
    __tablename__ = "blockchain_records"
    
    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False)
    hash_value = Column(String, unique=True, nullable=False)
    previous_hash = Column(String, nullable=True)
    block_number = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_verified = Column(Boolean, default=False)
    verified_by = Column(String, ForeignKey("users.id"), nullable=True)
    verification_timestamp = Column(DateTime, nullable=True)
    
    # Relationships
    claim = relationship("Claim")
    verifier = relationship("User")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Drop tables (for testing)
def drop_tables():
    Base.metadata.drop_all(bind=engine)

if __name__ == "__main__":
    # Create all tables
    create_tables()
    print("Database tables created successfully!")
