#!/usr/bin/env python3
import requests
import sys
import json
from datetime import dateti

class TravelBuddyAPITester:
    def __init__(self, base_url="https://travel-connect-v1.preview.emergentagent.com"):
        self.base_url = base_url
        self.admin_token = None
        self.buddy_token = None
        self.traveler_token = None
        self.buddy_id = None
        self.booking_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.critical_failures = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, token=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}" if not endpoint.startswith('http') else endpoint
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if token:
            test_headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            else:
                print(f"❌ Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {"raw": response.text}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                print(f"❌ Failed - {error_msg}")
                print(f"   Response: {response.text[:200]}...")
                self.critical_failures.append(f"{name}: {error_msg}")
                return False, {"error": response.text}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.critical_failures.append(f"{name}: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic health endpoints"""
        success1, _ = self.run_test("API Root", "GET", "", 200)
        success2, _ = self.run_test("Health Check", "GET", "health", 200)
        return success1 and success2

    def test_admin_login(self):
        """Test admin login with provided credentials"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": "admin@travelbuddy.com",
                "password": "Admin123!"
            }
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"✅ Admin token acquired successfully")
            return True
        
        print(f"❌ Admin login failed - no token received")
        return False

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        success, response = self.run_test(
            "Admin Stats", 
            "GET", 
            "admin/stats", 
            200, 
            token=self.admin_token
        )
        
        if success:
            expected_keys = ['total_users', 'total_buddies', 'verified_buddies', 'pending_buddies', 'total_bookings']
            for key in expected_keys:
                if key not in response:
                    print(f"❌ Missing key in stats response: {key}")
                    return False
            print(f"✅ Stats loaded: {response.get('total_users', 0)} users, {response.get('pending_buddies', 0)} pending buddies")
        
        return success

    def test_pending_buddies(self):
        """Test admin pending buddies endpoint"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        success, response = self.run_test(
            "Admin Pending Buddies",
            "GET", 
            "admin/pending-buddies", 
            200, 
            token=self.admin_token
        )
        
        if success:
            buddy_count = len(response) if isinstance(response, list) else 0
            print(f"✅ Found {buddy_count} pending buddies")
            
            # Store a buddy for verification testing
            if buddy_count > 0 and isinstance(response, list):
                self.buddy_id = response[0].get('id')
        
        return success

    def test_buddy_verification(self):
        """Test buddy verification process"""
        if not self.admin_token or not self.buddy_id:
            print("❌ No admin token or buddy ID available for verification")
            return False
            
        success, response = self.run_test(
            "Buddy Verification",
            "PUT",
            f"admin/buddy/{self.buddy_id}/verify?status=verified",
            200,
            token=self.admin_token
        )
        
        return success

    def test_search_buddies(self):
        """Test searching for verified buddies"""
        success, response = self.run_test(
            "Search Verified Buddies",
            "GET",
            "buddies",
            200
        )
        
        if success:
            buddy_count = len(response) if isinstance(response, list) else 0
            print(f"✅ Found {buddy_count} verified buddies")
        
        return success

    def test_user_registration(self):
        """Test traveler registration"""
        test_email = f"test_traveler_{datetime.now().strftime('%H%M%S')}@test.com"
        
        success, response = self.run_test(
            "Traveler Registration",
            "POST",
            "auth/register",
            200,
            data={
                "email": test_email,
                "password": "TestPass123!",
                "role": "traveler"
            }
        )
        
        if success and 'access_token' in response:
            self.traveler_token = response['access_token']
            print(f"✅ Traveler registered and token acquired")
            return True
        
        return False

    def test_buddy_registration(self):
        """Test buddy registration"""
        test_email = f"test_buddy_{datetime.now().strftime('%H%M%S')}@test.com"
        
        success, response = self.run_test(
            "Buddy Registration", 
            "POST",
            "auth/register",
            200,
            data={
                "email": test_email,
                "password": "TestPass123!",
                "role": "buddy"
            }
        )
        
        if success and 'access_token' in response:
            self.buddy_token = response['access_token']
            print(f"✅ Buddy registered and token acquired")
            return True
        
        return False

    def test_booking_creation(self):
        """Test booking creation flow"""
        if not self.traveler_token or not self.buddy_id:
            print("❌ No traveler token or buddy ID for booking test")
            return False
            
        future_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        
        success, response = self.run_test(
            "Create Booking",
            "POST",
            "bookings",
            200,
            data={
                "buddy_id": self.buddy_id,
                "travel_date": future_date,
                "departure_airport": "JFK",
                "arrival_airport": "LAX",
                "flight_number": "AA123",
                "notes": "Test booking",
                "price": 50
            },
            token=self.traveler_token
        )
        
        if success and 'id' in response:
            self.booking_id = response['id']
            print(f"✅ Booking created with ID: {self.booking_id}")
        
        return success

    def test_get_bookings(self):
        """Test getting user bookings"""
        if not self.traveler_token:
            print("❌ No traveler token available")
            return False
            
        success, response = self.run_test(
            "Get My Bookings",
            "GET",
            "bookings",
            200,
            token=self.traveler_token
        )
        
        if success:
            booking_count = len(response) if isinstance(response, list) else 0
            print(f"✅ Found {booking_count} bookings for traveler")
        
        return success

    def run_comprehensive_test(self):
        """Run all test scenarios"""
        print("=" * 50)
        print("🚀 Starting Travel Buddy API Tests")
        print("=" * 50)
        
        # Basic health checks
        print("\n1️⃣ Testing Basic Health Endpoints...")
        health_ok = self.test_health_check()
        
        # Admin authentication and panel functionality
        print("\n2️⃣ Testing Admin Authentication...")
        admin_login_ok = self.test_admin_login()
        
        admin_stats_ok = False
        pending_buddies_ok = False
        verification_ok = False
        
        if admin_login_ok:
            print("\n3️⃣ Testing Admin Panel Features...")
            admin_stats_ok = self.test_admin_stats()
            pending_buddies_ok = self.test_pending_buddies()
            
            if self.buddy_id:
                verification_ok = self.test_buddy_verification()
        
        # Search functionality 
        print("\n4️⃣ Testing Search Features...")
        search_ok = self.test_search_buddies()
        
        # User registration
        print("\n5️⃣ Testing User Registration...")
        traveler_reg_ok = self.test_user_registration()
        buddy_reg_ok = self.test_buddy_registration()
        
        # Booking flow
        booking_ok = False
        bookings_list_ok = False
        
        if traveler_reg_ok:
            print("\n6️⃣ Testing Booking Flow...")
            booking_ok = self.test_booking_creation()
            bookings_list_ok = self.test_get_bookings()
        
        # Results summary
        print("\n" + "=" * 50)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 50)
        
        results = {
            "Health Check": health_ok,
            "Admin Login": admin_login_ok,
            "Admin Stats": admin_stats_ok,
            "Pending Buddies": pending_buddies_ok,
            "Buddy Verification": verification_ok,
            "Search Buddies": search_ok,
            "Traveler Registration": traveler_reg_ok,
            "Buddy Registration": buddy_reg_ok,
            "Booking Creation": booking_ok,
            "Get Bookings": bookings_list_ok
        }
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name}: {status}")
        
        print(f"\n📈 Overall: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.critical_failures:
            print(f"\n🔴 CRITICAL FAILURES:")
            for failure in self.critical_failures:
                print(f"   • {failure}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        if success_rate < 50:
            print(f"\n❌ CRITICAL: Only {success_rate:.1f}% of tests passed")
            return 1
        elif success_rate < 80:
            print(f"\n⚠️  WARNING: {success_rate:.1f}% of tests passed")
            return 1  
        else:
            print(f"\n✅ SUCCESS: {success_rate:.1f}% of tests passed")
            return 0

def main():
    tester = TravelBuddyAPITester()
    return tester.run_comprehensive_test()

if __name__ == "__main__":
    sys.exit(main())