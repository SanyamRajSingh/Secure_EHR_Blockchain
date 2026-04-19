import urllib.request
import json
import urllib.error

BASE_URL = "http://127.0.0.1:5000"

def post(path, payload):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        try:
            body = json.loads(e.read().decode('utf-8'))
        except:
            body = e.read().decode('utf-8')
        return e.code, body
    except Exception as e:
        return 500, str(e)

def get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')

print("--- RUNNING DATA QA SUITE ---")

status, res = post("/patients", {"first_name": "Test", "last_name": "Patient", "gender": "Other"})
print(f"Add Patient: {status} -> {res}")
patient_id = res['data']['patient_id'] if status == 201 else 1

status, res = get("/doctors")
print(f"Get Doctors: {status}")
doctors = res.get('data', [])
doctor_id = doctors[0]['doctor_id'] if doctors else 1

print(f"Using Patient ID: {patient_id}, Doctor ID: {doctor_id}")

status, res = post("/records", {
    "patient_id": patient_id,
    "doctor_id": doctor_id,
    "diagnosis": "Automated Test Diagnosis",
    "prescription": "Take rest",
    "date": "2026-04-11"
})
print(f"Add Record: {status} -> {res}")
record_id = res['data'].get('record_id') if status == 201 else None

if record_id:
    print(f"Verifying Record ID: {record_id}")
    status, res = get(f"/records/verify/{record_id}")
    print(f"Verify Output: {status} -> {res}")
else:
    print("Record generation failed, cannot verify.")
