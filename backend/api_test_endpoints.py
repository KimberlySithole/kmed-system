"""
API Testing Script for KMED Backend
Test all endpoints with sample requests
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8000"

def test_endpoint(method, endpoint, data=None, headers=None):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers)
        else:
            print(f"Unsupported method: {method}")
            return None
            
        print(f"\n{'='*50}")
        print(f"TEST: {method} {endpoint}")
        print(f"STATUS: {response.status_code}")
        print(f"HEADERS: {dict(response.headers)}")
        
        try:
            print(f"RESPONSE: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"RESPONSE: {response.text}")
            
        return response
        
    except requests.exceptions.RequestException as e:
        print(f"ERROR: {e}")
        return None

def main():
    print("🚀 KMED API Testing Suite")
    print("=" * 50)
    
    # Test 1: Root endpoint
    test_endpoint("GET", "/")
    
    # Test 2: Login with different users
    users = [
        {"username": "analyst", "password": "password"},
        {"username": "admin", "password": "password"},
        {"username": "provider", "password": "password"},
        {"username": "patient", "password": "password"},
        {"username": "regulator", "password": "password"}
    ]
    
    tokens = {}
    
    for user in users:
        print(f"\n🔐 Testing login for {user['username']}")
        response = test_endpoint("POST", "/auth/login", user)
        
        if response and response.status_code == 200:
            token_data = response.json()
            tokens[user['username']] = token_data['access_token']
            print(f"✅ Login successful for {user['username']}")
        else:
            print(f"❌ Login failed for {user['username']}")
    
    # Test 3: Test authenticated endpoints with each user role
    for username, token in tokens.items():
        print(f"\n👤 Testing endpoints for {username}")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get current user info
        test_endpoint("GET", "/auth/me", headers=headers)
        
        # Get dashboard metrics
        test_endpoint("GET", "/dashboard/metrics", headers=headers)
        
        # Get claims (filtered by role)
        test_endpoint("GET", "/claims", headers=headers)
        
        # Get alerts
        test_endpoint("GET", "/alerts", headers=headers)
        
        # Role-specific tests
        if username == "admin":
            # Get all users
            test_endpoint("GET", "/users", headers=headers)
            
            # Create a claim
            claim_data = {
                "patient_name": "Test Patient",
                "provider_name": "Dr. Test",
                "amount": 1500.0,
                "date": "2024-01-20T10:00:00",
                "description": "Test claim creation"
            }
            test_endpoint("POST", "/claims", claim_data, headers=headers)
        
        elif username == "provider":
            # Create a claim as provider
            claim_data = {
                "patient_name": "Provider Test Patient",
                "provider_name": "Dr. Smith",
                "amount": 2000.0,
                "date": "2024-01-20T11:00:00",
                "description": "Provider test claim"
            }
            test_endpoint("POST", "/claims", claim_data, headers=headers)
        
        elif username in ["admin", "investigator", "regulator"]:
            # Update claim status
            test_endpoint("PUT", "/claims/CLM001/status", "approved", headers=headers)
            
            # Flag a claim
            test_endpoint("POST", "/claims/CLM002/flag", {"reason": "Test flagging"}, headers=headers)
    
    # Test 4: Error handling
    print(f"\n🚨 Testing error handling")
    
    # Invalid login
    test_endpoint("POST", "/auth/login", {"username": "invalid", "password": "wrong"})
    
    # Access without token
    test_endpoint("GET", "/claims")
    
    # Invalid token
    test_endpoint("GET", "/claims", headers={"Authorization": "Bearer invalid_token"})
    
    # Test 5: Logout
    if tokens:
        username = list(tokens.keys())[0]
        token = tokens[username]
        headers = {"Authorization": f"Bearer {token}"}
        test_endpoint("POST", "/auth/logout", headers=headers)
    
    print(f"\n✅ API Testing Complete!")

if __name__ == "__main__":
    main()
