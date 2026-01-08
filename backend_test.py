#!/usr/bin/env python3
"""
Axecraft Backend API Testing Suite
Tests all backend endpoints for the Minecraft server website
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, List

class AxecraftAPITester:
    def __init__(self, base_url="https://axecraft-realm.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.results = {}

    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}: PASSED")
        else:
            print(f"❌ {test_name}: FAILED - {details}")
            self.failed_tests.append({"test": test_name, "error": details})
        
        self.results[test_name] = {
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            if success and "message" in data:
                self.log_result("API Root", True, f"Message: {data['message']}")
            else:
                self.log_result("API Root", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("API Root", False, str(e))
            return False

    def test_server_stats(self):
        """Test server stats endpoint"""
        try:
            response = requests.get(f"{self.api_url}/stats", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ["online_players", "max_players", "server_ip", "status", "uptime_percentage"]
                
                if all(field in data for field in required_fields):
                    if data["online_players"] == 4 and data["server_ip"] == "play.axecraft.fr":
                        self.log_result("Server Stats", True, f"Players: {data['online_players']}/{data['max_players']}")
                    else:
                        self.log_result("Server Stats", False, "Incorrect stats data")
                else:
                    self.log_result("Server Stats", False, "Missing required fields")
            else:
                self.log_result("Server Stats", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("Server Stats", False, str(e))
            return False

    def test_minigames(self):
        """Test minigames endpoints"""
        try:
            # Test get all minigames
            response = requests.get(f"{self.api_url}/minigames", timeout=10)
            success = response.status_code == 200
            
            if success:
                games = response.json()
                if isinstance(games, list) and len(games) >= 5:
                    # Check for expected games
                    game_names = [game["name"] for game in games]
                    expected_games = ["BedWars", "SkyWars", "Build Battle", "Survival", "UHC"]
                    
                    if all(game in game_names for game in expected_games):
                        self.log_result("Minigames List", True, f"Found {len(games)} games")
                        
                        # Test individual game endpoint
                        bedwars_game = next((g for g in games if g["id"] == "bedwars"), None)
                        if bedwars_game:
                            game_response = requests.get(f"{self.api_url}/minigames/bedwars", timeout=10)
                            if game_response.status_code == 200:
                                self.log_result("Individual Game", True, "BedWars game retrieved")
                            else:
                                self.log_result("Individual Game", False, f"Status: {game_response.status_code}")
                        else:
                            self.log_result("Individual Game", False, "BedWars game not found")
                    else:
                        self.log_result("Minigames List", False, "Missing expected games")
                else:
                    self.log_result("Minigames List", False, f"Expected list with 5+ games, got {len(games) if isinstance(games, list) else 'not a list'}")
            else:
                self.log_result("Minigames List", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("Minigames List", False, str(e))
            return False

    def test_staff(self):
        """Test staff endpoint"""
        try:
            response = requests.get(f"{self.api_url}/staff", timeout=10)
            success = response.status_code == 200
            
            if success:
                staff = response.json()
                if isinstance(staff, list) and len(staff) >= 4:
                    # Check for expected staff roles
                    roles = [member["role"] for member in staff]
                    if "Fondateur" in roles and "Admin" in roles:
                        self.log_result("Staff List", True, f"Found {len(staff)} staff members")
                    else:
                        self.log_result("Staff List", False, "Missing expected roles")
                else:
                    self.log_result("Staff List", False, f"Expected 4+ staff members, got {len(staff) if isinstance(staff, list) else 'not a list'}")
            else:
                self.log_result("Staff List", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("Staff List", False, str(e))
            return False

    def test_shop(self):
        """Test shop endpoints"""
        try:
            # Test get all shop items
            response = requests.get(f"{self.api_url}/shop", timeout=10)
            success = response.status_code == 200
            
            if success:
                items = response.json()
                if isinstance(items, list) and len(items) >= 5:
                    # Check for VIP grades
                    item_names = [item["name"] for item in items]
                    expected_items = ["VIP", "VIP+", "MVP"]
                    
                    if all(item in item_names for item in expected_items):
                        self.log_result("Shop Items", True, f"Found {len(items)} shop items")
                        
                        # Test category filter
                        grades_response = requests.get(f"{self.api_url}/shop/grades", timeout=10)
                        if grades_response.status_code == 200:
                            grades = grades_response.json()
                            if len(grades) >= 3:
                                self.log_result("Shop Categories", True, f"Found {len(grades)} grade items")
                            else:
                                self.log_result("Shop Categories", False, f"Expected 3+ grades, got {len(grades)}")
                        else:
                            self.log_result("Shop Categories", False, f"Status: {grades_response.status_code}")
                    else:
                        self.log_result("Shop Items", False, "Missing expected VIP grades")
                else:
                    self.log_result("Shop Items", False, f"Expected 5+ items, got {len(items) if isinstance(items, list) else 'not a list'}")
            else:
                self.log_result("Shop Items", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("Shop Items", False, str(e))
            return False

    def test_reviews(self):
        """Test reviews endpoints"""
        try:
            # Test get reviews
            response = requests.get(f"{self.api_url}/reviews", timeout=10)
            success = response.status_code == 200
            
            if success:
                reviews = response.json()
                if isinstance(reviews, list) and len(reviews) >= 4:
                    # Check review structure
                    first_review = reviews[0]
                    required_fields = ["id", "username", "rating", "comment", "date"]
                    
                    if all(field in first_review for field in required_fields):
                        self.log_result("Reviews List", True, f"Found {len(reviews)} reviews")
                        
                        # Test create review
                        new_review = {
                            "username": "TestPlayer",
                            "rating": 5,
                            "comment": "Test review from automated testing"
                        }
                        
                        create_response = requests.post(f"{self.api_url}/reviews", json=new_review, timeout=10)
                        if create_response.status_code == 200:
                            self.log_result("Create Review", True, "Review created successfully")
                        else:
                            self.log_result("Create Review", False, f"Status: {create_response.status_code}")
                    else:
                        self.log_result("Reviews List", False, "Missing required fields in review")
                else:
                    self.log_result("Reviews List", False, f"Expected 4+ reviews, got {len(reviews) if isinstance(reviews, list) else 'not a list'}")
            else:
                self.log_result("Reviews List", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("Reviews List", False, str(e))
            return False

    def test_leaderboard(self):
        """Test leaderboard endpoint"""
        try:
            response = requests.get(f"{self.api_url}/leaderboard", timeout=10)
            success = response.status_code == 200
            
            if success:
                leaderboard = response.json()
                if isinstance(leaderboard, list) and len(leaderboard) >= 10:
                    # Check leaderboard structure
                    first_entry = leaderboard[0]
                    required_fields = ["rank", "username", "score", "game", "wins", "kills"]
                    
                    if all(field in first_entry for field in required_fields):
                        # Test game filter
                        bedwars_response = requests.get(f"{self.api_url}/leaderboard?game=BedWars", timeout=10)
                        if bedwars_response.status_code == 200:
                            self.log_result("Leaderboard", True, f"Found {len(leaderboard)} entries")
                        else:
                            self.log_result("Leaderboard", False, "Game filter failed")
                    else:
                        self.log_result("Leaderboard", False, "Missing required fields")
                else:
                    self.log_result("Leaderboard", False, f"Expected 10+ entries, got {len(leaderboard) if isinstance(leaderboard, list) else 'not a list'}")
            else:
                self.log_result("Leaderboard", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("Leaderboard", False, str(e))
            return False

    def test_rules(self):
        """Test rules endpoint"""
        try:
            response = requests.get(f"{self.api_url}/rules", timeout=10)
            success = response.status_code == 200
            
            if success:
                rules = response.json()
                if isinstance(rules, list) and len(rules) >= 8:
                    # Check rule structure
                    first_rule = rules[0]
                    required_fields = ["id", "title", "description", "category", "severity"]
                    
                    if all(field in first_rule for field in required_fields):
                        categories = set(rule["category"] for rule in rules)
                        expected_categories = {"Comportement", "Jeu", "Chat"}
                        
                        if expected_categories.issubset(categories):
                            self.log_result("Rules", True, f"Found {len(rules)} rules in {len(categories)} categories")
                        else:
                            self.log_result("Rules", False, "Missing expected rule categories")
                    else:
                        self.log_result("Rules", False, "Missing required fields in rule")
                else:
                    self.log_result("Rules", False, f"Expected 8+ rules, got {len(rules) if isinstance(rules, list) else 'not a list'}")
            else:
                self.log_result("Rules", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("Rules", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting Axecraft API Tests")
        print(f"📡 Testing API at: {self.api_url}")
        print("=" * 50)
        
        # Run all tests
        tests = [
            self.test_api_root,
            self.test_server_stats,
            self.test_minigames,
            self.test_staff,
            self.test_shop,
            self.test_reviews,
            self.test_leaderboard,
            self.test_rules
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ {test.__name__}: CRITICAL ERROR - {str(e)}")
                self.failed_tests.append({"test": test.__name__, "error": str(e)})
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests ({len(self.failed_tests)}):")
            for failure in self.failed_tests:
                print(f"  • {failure['test']}: {failure['error']}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = AxecraftAPITester()
    
    try:
        success = tester.run_all_tests()
        
        # Save results to file
        with open('/app/backend_test_results.json', 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
                'failed_tests': tester.failed_tests,
                'detailed_results': tester.results
            }, f, indent=2)
        
        return 0 if success else 1
        
    except Exception as e:
        print(f"💥 Critical test failure: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())