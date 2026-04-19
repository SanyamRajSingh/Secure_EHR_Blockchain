import urllib.request
import json
import urllib.error

BASE_URL = "http://127.0.0.1:5000/api"

def run_test(name, path, payload, expected_status):
    url = path if path.startswith("http") else f"{BASE_URL}{path}"
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        status = e.code
        body = e.read().decode('utf-8')
    except Exception as e:
        print(f"[{name}] CRITICAL FAILURE: {e}")
        return False
        
    passed = status == expected_status
    print(f"[{'PASS' if passed else 'FAIL'}] {name} (Expected {expected_status}, Got {status})")
    if not passed:
        print(f"  Response: {body}\n")
    return passed

print("--- RUNNING AUTH QA SUITE ---")
# 1. Valid Signup
run_test("Signup - Valid New User", "/signup", {"username": "final_test_patient", "password": "Final123!", "role": "patient"}, 201)
# 2. Signup Missing Field
run_test("Signup - Missing Field", "/signup", {"username": "missing_field_user", "role": "patient"}, 400)
# 3. Signup Duplicate
run_test("Signup - Duplicate Username", "/signup", {"username": "final_test_patient", "password": "Final123!", "role": "patient"}, 409)
# 4. Signup Invalid Role
run_test("Signup - Invalid Role", "/signup", {"username": "bad_role_user", "password": "Final123!", "role": "hacker"}, 400)

print("\--- RUNNING LOGIN QA SUITE ---\n")
# 5. Valid Login
run_test("Login - Correct Credentials", "http://127.0.0.1:5000/login", {"username": "final_test_patient", "password": "Final123!"}, 200)
# 6. Wrong Password
run_test("Login - Wrong Password", "http://127.0.0.1:5000/login", {"username": "final_test_patient", "password": "wrongpassword"}, 401)
# 7. Non-Existent User
run_test("Login - Ghost User", "http://127.0.0.1:5000/login", {"username": "ghost_user_xyz", "password": "anything"}, 401)
