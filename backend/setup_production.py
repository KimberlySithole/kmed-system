"""
Production Setup Script for KMED Backend
Configures database, runs migrations, and initializes data
"""

import os
import sys
import subprocess
from dotenv import load_dotenv

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}")
    print(f"Command: {command}")
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            print(f"✅ {description} - SUCCESS")
            if result.stdout:
                print(f"Output: {result.stdout}")
        else:
            print(f"❌ {description} - FAILED")
            print(f"Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"❌ {description} - TIMEOUT")
        return False
    except Exception as e:
        print(f"❌ {description} - ERROR: {e}")
        return False
    
    return True

def check_environment():
    """Check if environment is properly configured"""
    print("🔍 Checking Environment Configuration")
    
    # Load environment variables
    load_dotenv()
    
    required_vars = ["DATABASE_URL", "SECRET_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("Please set these in your .env file")
        return False
    
    print("✅ Environment variables configured")
    return True

def setup_database():
    """Setup database and run migrations"""
    print("\n🗄️ Setting Up Database")
    
    # Check database connection
    if not run_command("python -c \"from database import engine; engine.connect()\"", "Testing Database Connection"):
        return False
    
    # Create tables
    if not run_command("python database.py", "Creating Database Tables"):
        return False
    
    # Initialize Alembic
    if not run_command("alembic init migrations", "Initializing Alembic"):
        print("⚠️ Alembic may already be initialized")
    
    # Create initial migration
    if not run_command("alembic revision --autogenerate -m \"Initial migration\"", "Creating Initial Migration"):
        print("⚠️ Migration may already exist")
    
    # Run migrations
    if not run_command("alembic upgrade head", "Running Database Migrations"):
        return False
    
    # Initialize sample data
    if not run_command("python init_data.py", "Initializing Sample Data"):
        return False
    
    print("✅ Database setup completed")
    return True

def test_backend():
    """Test backend functionality"""
    print("\n🧪 Testing Backend")
    
    # Start backend in background
    print("🚀 Starting backend server...")
    import subprocess
    import time
    import requests
    
    # Start backend process
    backend_process = subprocess.Popen(
        [sys.executable, "main_production.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for server to start
    time.sleep(5)
    
    try:
        # Test health endpoint
        response = requests.get("http://localhost:8000/health", timeout=10)
        if response.status_code == 200:
            print("✅ Backend is running and responding")
        else:
            print(f"❌ Backend responded with status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend connection failed: {e}")
        return False
    finally:
        # Stop backend process
        backend_process.terminate()
        backend_process.wait()
        print("🛑 Backend server stopped")
    
    return True

def run_production_tests():
    """Run end-to-end tests"""
    print("\n🧪 Running Production Tests")
    
    return run_command("python end_to_end_test.py", "End-to-End Tests")

def main():
    """Main setup function"""
    print("🚀 KMED Production Setup")
    print("=" * 50)
    
    # Check environment
    if not check_environment():
        print("\n❌ Environment check failed. Please fix issues and retry.")
        return 1
    
    # Setup database
    if not setup_database():
        print("\n❌ Database setup failed. Please fix issues and retry.")
        return 1
    
    # Test backend
    if not test_backend():
        print("\n❌ Backend test failed. Please fix issues and retry.")
        return 1
    
    # Run production tests
    if not run_production_tests():
        print("\n❌ Production tests failed. Please fix issues and retry.")
        return 1
    
    print("\n" + "=" * 50)
    print("🎉 PRODUCTION SETUP COMPLETED SUCCESSFULLY!")
    print("=" * 50)
    print("\n📋 Next Steps:")
    print("1. Start backend: python main_production.py")
    print("2. Open frontend: Open index.html in browser")
    print("3. Login with test credentials")
    print("4. Verify all dashboards work correctly")
    
    print("\n🔑 Login Credentials:")
    print("- Analyst: analyst / password")
    print("- Admin: admin / password")
    print("- Provider: provider / password")
    print("- Patient: patient / password")
    print("- Regulator: regulator / password")
    
    return 0

if __name__ == "__main__":
    exit(main())
