from sqlalchemy.orm import Session
from database import SessionLocal, User, Claim, FraudAlert, AuditLog, BlockchainRecord
from passlib.context import CryptContext
from datetime import datetime, timedelta
import uuid
import random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_sample_data():
    db = SessionLocal()
    try:
        # Create Users
        users = [
            User(
                id="USR001",
                username="analyst",
                email="analyst@kmed.com",
                role="analyst",
                name="John Analyst",
                password_hash=pwd_context.hash("password"),
                is_active=True
            ),
            User(
                id="USR002",
                username="investigator",
                email="investigator@kmed.com",
                role="investigator",
                name="Sarah Investigator",
                password_hash=pwd_context.hash("password"),
                is_active=True
            ),
            User(
                id="USR003",
                username="admin",
                email="admin@kmed.com",
                role="admin",
                name="Mike Admin",
                password_hash=pwd_context.hash("password"),
                is_active=True
            ),
            User(
                id="USR004",
                username="provider",
                email="provider@kmed.com",
                role="provider",
                name="Dr. Smith",
                password_hash=pwd_context.hash("password"),
                is_active=True
            ),
            User(
                id="USR005",
                username="patient",
                email="patient@kmed.com",
                role="patient",
                name="Jane Patient",
                password_hash=pwd_context.hash("password"),
                is_active=True
            ),
            User(
                id="USR006",
                username="regulator",
                email="regulator@kmed.com",
                role="regulator",
                name="Robert Regulator",
                password_hash=pwd_context.hash("password"),
                is_active=True
            )
        ]
        
        # Add users to database
        for user in users:
            db.add(user)
        db.commit()
        
        # Create Claims
        claims_data = [
            {
                "id": "CLM001",
                "patient_name": "John Doe",
                "provider_name": "Dr. Smith",
                "amount": 2500.0,
                "date": datetime(2024, 1, 15),
                "description": "Emergency room visit with X-ray and lab tests"
            },
            {
                "id": "CLM002",
                "patient_name": "Jane Smith",
                "provider_name": "Dr. Johnson",
                "amount": 1200.0,
                "date": datetime(2024, 1, 14),
                "description": "Specialist consultation and follow-up tests"
            },
            {
                "id": "CLM003",
                "patient_name": "Bob Wilson",
                "provider_name": "Dr. Brown",
                "amount": 800.0,
                "date": datetime(2024, 1, 13),
                "description": "Routine check-up and vaccinations"
            },
            {
                "id": "CLM004",
                "patient_name": "Alice Davis",
                "provider_name": "Dr. Smith",
                "amount": 3500.0,
                "date": datetime(2024, 1, 12),
                "description": "Surgical procedure and hospital stay"
            },
            {
                "id": "CLM005",
                "patient_name": "Charlie Brown",
                "provider_name": "Dr. Davis",
                "amount": 600.0,
                "date": datetime(2024, 1, 11),
                "description": "Dental cleaning and minor procedures"
            },
            {
                "id": "CLM006",
                "patient_name": "Eva Martinez",
                "provider_name": "Dr. Wilson",
                "amount": 1800.0,
                "date": datetime(2024, 1, 10),
                "description": "MRI scan and radiology consultation"
            },
            {
                "id": "CLM007",
                "patient_name": "Frank Chen",
                "provider_name": "Dr. Smith",
                "amount": 4200.0,
                "date": datetime(2024, 1, 9),
                "description": "Emergency surgery and intensive care"
            },
            {
                "id": "CLM008",
                "patient_name": "Grace Lee",
                "provider_name": "Dr. Johnson",
                "amount": 950.0,
                "date": datetime(2024, 1, 8),
                "description": "Physical therapy sessions"
            }
        ]
        
        claims = []
        for claim_data in claims_data:
            # Calculate risk score
            base_score = 0.3
            if claim_data["amount"] > 3000:
                base_score += 0.4
            elif claim_data["amount"] > 2000:
                base_score += 0.2
            elif claim_data["amount"] > 1000:
                base_score += 0.1
            
            # Provider pattern risk
            if claim_data["provider_name"] in ["Dr. Smith"]:
                base_score += 0.2
            
            # Random factor
            base_score += random.uniform(-0.1, 0.1)
            risk_score = min(max(base_score, 0.0), 1.0)
            
            # Determine risk level
            if risk_score > 0.7:
                risk_level = "high"
            elif risk_score > 0.4:
                risk_level = "medium"
            else:
                risk_level = "low"
            
            # Determine status
            if risk_score > 0.8:
                status = "flagged"
            elif risk_score > 0.6:
                status = "investigation"
            else:
                status = random.choice(["pending", "approved"])
            
            claim = Claim(
                id=claim_data["id"],
                patient_id="USR005",  # Jane Patient
                provider_id="USR004",  # Dr. Smith
                patient_name=claim_data["patient_name"],
                provider_name=claim_data["provider_name"],
                amount=claim_data["amount"],
                date=claim_data["date"],
                risk_score=risk_score,
                risk_level=risk_level,
                status=status,
                description=claim_data["description"]
            )
            claims.append(claim)
            db.add(claim)
        
        db.commit()
        
        # Create Fraud Alerts
        alerts_data = [
            {
                "id": "ALT001",
                "claim_id": "CLM001",
                "type": "fraud",
                "severity": "high",
                "description": "Unusual billing pattern detected for this provider",
                "confidence_score": 0.85
            },
            {
                "id": "ALT002",
                "claim_id": "CLM002",
                "type": "compliance",
                "severity": "medium",
                "description": "Missing documentation for specialist consultation",
                "confidence_score": 0.65
            },
            {
                "id": "ALT003",
                "claim_id": "CLM004",
                "type": "fraud",
                "severity": "high",
                "description": "Potential duplicate billing detected",
                "confidence_score": 0.92
            },
            {
                "id": "ALT004",
                "claim_id": "CLM007",
                "type": "fraud",
                "severity": "critical",
                "description": "Extremely high billing amount for emergency surgery",
                "confidence_score": 0.95
            },
            {
                "id": "ALT005",
                "claim_id": "CLM006",
                "type": "bias",
                "severity": "medium",
                "description": "Potential demographic bias in claim approval",
                "confidence_score": 0.72
            }
        ]
        
        for alert_data in alerts_data:
            alert = FraudAlert(
                id=alert_data["id"],
                claim_id=alert_data["claim_id"],
                user_id="USR001",  # John Analyst
                type=alert_data["type"],
                severity=alert_data["severity"],
                description=alert_data["description"],
                confidence_score=alert_data["confidence_score"]
            )
            db.add(alert)
        
        db.commit()
        
        # Create Audit Logs
        audit_logs = [
            {
                "user_id": "USR001",
                "action": "login",
                "resource_type": "user",
                "resource_id": "USR001",
                "details": "User logged in successfully"
            },
            {
                "user_id": "USR002",
                "action": "view_claim",
                "resource_type": "claim",
                "resource_id": "CLM001",
                "details": "Investigator viewed high-risk claim"
            },
            {
                "user_id": "USR003",
                "action": "update_status",
                "resource_type": "claim",
                "resource_id": "CLM004",
                "details": "Admin updated claim status to investigation"
            }
        ]
        
        for log_data in audit_logs:
            audit_log = AuditLog(
                id=str(uuid.uuid4()),
                user_id=log_data["user_id"],
                action=log_data["action"],
                resource_type=log_data["resource_type"],
                resource_id=log_data["resource_id"],
                details=log_data["details"],
                created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 24))
            )
            db.add(audit_log)
        
        db.commit()
        
        # Create Blockchain Records
        for claim in claims:
            # Generate mock hash
            import hashlib
            hash_input = f"{claim.id}{claim.amount}{claim.date}{random.random()}"
            hash_value = hashlib.sha256(hash_input.encode()).hexdigest()
            
            blockchain_record = BlockchainRecord(
                id=str(uuid.uuid4()),
                claim_id=claim.id,
                hash_value=hash_value,
                block_number=random.randint(1000, 9999),
                is_verified=random.choice([True, False])
            )
            db.add(blockchain_record)
        
        db.commit()
        
        print("Sample data created successfully!")
        print(f"Created {len(users)} users")
        print(f"Created {len(claims)} claims")
        print(f"Created {len(alerts_data)} fraud alerts")
        print(f"Created {len(audit_logs)} audit logs")
        print(f"Created {len(claims)} blockchain records")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
