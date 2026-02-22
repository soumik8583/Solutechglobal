#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class SolutechAPITester:
    def __init__(self, base_url="https://solutech-gst.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failures = []
        
    def run_test(self, test_name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {test_name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            
            print(f"Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)}")
                    return success, response_data
                except:
                    print(f"Response (non-JSON): {response.text[:200]}...")
                    return success, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                print(f"❌ Failed - {error_msg}")
                print(f"Response: {response.text[:200]}...")
                self.failures.append({
                    "test": test_name,
                    "endpoint": endpoint,
                    "error": error_msg,
                    "response": response.text[:200]
                })
                return False, {}
                
        except requests.exceptions.RequestException as e:
            error_msg = f"Request failed: {str(e)}"
            print(f"❌ Failed - {error_msg}")
            self.failures.append({
                "test": test_name,
                "endpoint": endpoint,
                "error": error_msg
            })
            return False, {}
        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            print(f"❌ Failed - {error_msg}")
            self.failures.append({
                "test": test_name,
                "endpoint": endpoint,
                "error": error_msg
            })
            return False, {}
    
    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET", 
            "api/",
            200
        )
    
    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "reason": "Testing the contact form API endpoint",
            "service": "GST Services"
        }
        
        return self.run_test(
            "Contact Form Submission",
            "POST",
            "api/contact",
            200,
            data=test_data
        )
    
    def test_get_contacts(self):
        """Test get contacts endpoint"""
        return self.run_test(
            "Get Contacts",
            "GET",
            "api/contacts",
            200
        )
    
    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test GET status
        get_success, _ = self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )
        
        # Test POST status
        status_data = {
            "client_name": "Test Client"
        }
        post_success, _ = self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,
            data=status_data
        )
        
        return get_success and post_success
    
    def run_all_tests(self):
        """Run all API tests"""
        print("=" * 60)
        print("🚀 Starting Solutech Global Consultancy API Tests")
        print("=" * 60)
        
        # Test API root
        self.test_api_root()
        
        # Test status endpoints
        self.test_status_endpoints()
        
        # Test contact form
        contact_success, contact_response = self.test_contact_form_submission()
        
        # Test get contacts
        self.test_get_contacts()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        if self.failures:
            print("\n❌ FAILED TESTS:")
            for failure in self.failures:
                print(f"  - {failure['test']}: {failure['error']}")
        
        if self.tests_passed == self.tests_run:
            print("\n🎉 ALL TESTS PASSED!")
            return True
        else:
            print(f"\n⚠️  {self.tests_run - self.tests_passed} TESTS FAILED")
            return False

def main():
    tester = SolutechAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())