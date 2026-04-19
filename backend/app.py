from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db_connection
import hashlib
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ------------------------
# Home
# ------------------------
@app.route("/")
def home():
    return "Backend running"


# ------------------------
# Login
# ------------------------
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Request body required"}), 400

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username:
        return jsonify({"success": False, "error": "Missing required field: username"}), 400
    if not password:
        return jsonify({"success": False, "error": "Missing required field: password"}), 400

    # Hash password with SHA256 (same algorithm used to store hashes)
    password_hash = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT user_id, username, role, linked_id FROM user_login WHERE username = %s AND password_hash = %s",
            (username, password_hash)
        )
        user = cursor.fetchone()
        conn.close()

        if not user:
            return jsonify({"success": False, "error": "Invalid username or password"}), 401

        return jsonify({
            "success": True,
            "data": {
                "user_id": user["user_id"],
                "username": user["username"],
                "role": user["role"],
                "linked_id": user["linked_id"]
            }
        }), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Get all users
# ------------------------
@app.route("/users", methods=["GET"])
def get_users():

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT user_id, username, role, linked_id FROM user_login")
        users = cursor.fetchall()
        conn.close()
        return jsonify({"success": True, "data": users}), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Get all doctors
# ------------------------
@app.route("/doctors", methods=["GET"])
def get_doctors():

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT d.doctor_id, d.first_name, d.last_name,
                   GROUP_CONCAT(ds.specialization SEPARATOR ', ') AS specialization
            FROM doctor d
            LEFT JOIN doctor_specialization ds ON d.doctor_id = ds.doctor_id
            GROUP BY d.doctor_id, d.first_name, d.last_name
            ORDER BY d.last_name, d.first_name
        """)
        doctors = cursor.fetchall()
        conn.close()
        return jsonify({"success": True, "data": doctors}), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Get all patients
# ------------------------
@app.route("/patients", methods=["GET"])
def get_patients():

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT p.patient_id, p.first_name, p.last_name, p.gender,
                   pp.phone_number
            FROM patient p
            LEFT JOIN patient_phone pp ON p.patient_id = pp.patient_id
            ORDER BY p.last_name, p.first_name
        """)
        patients = cursor.fetchall()
        conn.close()
        return jsonify({"success": True, "data": patients}), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Get patient by ID
# ------------------------
@app.route("/patients/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT p.patient_id, p.first_name, p.last_name, p.gender,
                   pp.phone_number
            FROM patient p
            LEFT JOIN patient_phone pp ON p.patient_id = pp.patient_id
            WHERE p.patient_id = %s
        """, (patient_id,))
        patient = cursor.fetchone()
        conn.close()

        if not patient:
            return jsonify({"success": False, "error": "Patient not found"}), 404

        return jsonify({"success": True, "data": patient}), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Add patient
# ------------------------
@app.route("/patients", methods=["POST"])
def add_patient():

    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Request body required"}), 400

    first_name = data.get("first_name", "").strip()
    last_name  = data.get("last_name", "").strip()
    gender     = data.get("gender", "").strip()

    if not first_name:
        return jsonify({"success": False, "error": "Missing required field: first_name"}), 400
    if not last_name:
        return jsonify({"success": False, "error": "Missing required field: last_name"}), 400
    if not gender:
        return jsonify({"success": False, "error": "Missing required field: gender"}), 400
    if gender not in ("Male", "Female", "Other"):
        return jsonify({"success": False, "error": "gender must be Male, Female, or Other"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO patient (first_name, last_name, gender) VALUES (%s, %s, %s)",
            (first_name, last_name, gender)
        )
        conn.commit()
        patient_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "data": {
                "message": "Patient created successfully",
                "patient_id": patient_id,
                "first_name": first_name,
                "last_name": last_name,
                "gender": gender
            }
        }), 201

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Add user / doctor
# ------------------------
@app.route("/users", methods=["POST"])
def add_user():

    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Request body required"}), 400

    username  = data.get("username", "").strip()
    password  = data.get("password", "").strip()
    role      = data.get("role", "").strip()
    linked_id = data.get("linked_id", 0)

    if not username:
        return jsonify({"success": False, "error": "Missing required field: username"}), 400
    if not password:
        return jsonify({"success": False, "error": "Missing required field: password"}), 400
    if not role:
        return jsonify({"success": False, "error": "Missing required field: role"}), 400

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO user_login (username, password_hash, role, linked_id) VALUES (%s, %s, %s, %s)",
            (username, password_hash, role, linked_id)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "data": {
                "message": "User created successfully",
                "user_id": user_id,
                "username": username,
                "role": role
            }
        }), 201

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Signup
# ------------------------
@app.route("/api/signup", methods=["POST"])
def signup():

    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Request body required"}), 400

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    role     = data.get("role", "").strip().lower()

    if not username or not password or not role:
        return jsonify({"success": False, "error": "All fields are required"}), 400

    if role not in ["doctor", "patient", "admin"]:
        return jsonify({"success": False, "error": "Invalid role"}), 400

    if len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters"}), 400

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check duplicate
        cursor.execute("SELECT user_id FROM user_login WHERE username = %s", (username,))
        if cursor.fetchone():
            conn.close()
            return jsonify({"success": False, "error": "Username already exists"}), 409

        cursor.execute(
            "INSERT INTO user_login (username, password_hash, role, linked_id, is_verified) VALUES (%s, %s, %s, NULL, TRUE)",
            (username, password_hash, role)
        )
        conn.commit()
        conn.close()

        return jsonify({"success": True, "message": "Account created successfully"}), 201

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Dashboard summary
# ------------------------
@app.route("/dashboard", methods=["GET"])
def dashboard_summary():

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) AS total_patients FROM patient")
        total_patients = cursor.fetchone()["total_patients"]

        cursor.execute("SELECT COUNT(*) AS total_records FROM medical_record")
        total_records = cursor.fetchone()["total_records"]

        cursor.execute("SELECT COUNT(*) AS total_doctors FROM doctor")
        total_doctors = cursor.fetchone()["total_doctors"]

        cursor.execute("""
            SELECT
                m.record_id,
                CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
                CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
                m.patient_id,
                m.doctor_id,
                m.diagnosis,
                m.prescription,
                m.date,
                b.tx_id,
                b.block_hash,
                b.timestamp AS blockchain_timestamp
            FROM medical_record m
            LEFT JOIN patient p ON m.patient_id = p.patient_id
            LEFT JOIN doctor d ON m.doctor_id = d.doctor_id
            LEFT JOIN blockchain_transaction b ON m.record_id = b.record_id
            ORDER BY m.record_id DESC
            LIMIT 10
        """)
        latest_records = cursor.fetchall()
        conn.close()

        return jsonify({
            "success": True,
            "data": {
                "total_patients": total_patients,
                "total_records": total_records,
                "total_doctors": total_doctors,
                "latest_records": latest_records
            }
        }), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Add medical record
# (Trigger handles blockchain_transaction insert automatically)
# ------------------------
@app.route("/records", methods=["POST"])
def add_record():

    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Request body required"}), 400

    patient_id   = data.get("patient_id")
    doctor_id    = data.get("doctor_id")
    diagnosis    = data.get("diagnosis", "").strip() if data.get("diagnosis") else ""
    prescription = data.get("prescription", "").strip() if data.get("prescription") else ""
    date         = data.get("date", "").strip() if data.get("date") else ""

    if patient_id is None:
        return jsonify({"success": False, "error": "Missing required field: patient_id"}), 400
    if doctor_id is None:
        return jsonify({"success": False, "error": "Missing required field: doctor_id"}), 400
    if not diagnosis:
        return jsonify({"success": False, "error": "Missing required field: diagnosis"}), 400
    if not prescription:
        return jsonify({"success": False, "error": "Missing required field: prescription"}), 400

    try:
        patient_id = int(patient_id)
        doctor_id  = int(doctor_id)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "patient_id and doctor_id must be integers"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Verify patient exists
        cursor.execute("SELECT patient_id FROM patient WHERE patient_id = %s", (patient_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({"success": False, "error": "Patient not found"}), 404

        # Verify doctor exists
        cursor.execute("SELECT doctor_id FROM doctor WHERE doctor_id = %s", (doctor_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({"success": False, "error": "Doctor not found"}), 404

        cursor = conn.cursor()
        sql = """
            INSERT INTO medical_record (patient_id, doctor_id, diagnosis, prescription, date)
            VALUES (%s, %s, %s, %s, %s)
        """
        record_date = date if date else None

        cursor.execute(sql, (patient_id, doctor_id, diagnosis, prescription, record_date))
        conn.commit()
        record_id = cursor.lastrowid

        # Retrieve the blockchain entry the trigger created
        cursor2 = conn.cursor(dictionary=True)
        cursor2.execute(
            "SELECT tx_id, block_hash, timestamp FROM blockchain_transaction WHERE record_id = %s ORDER BY tx_id DESC LIMIT 1",
            (record_id,)
        )
        blockchain = cursor2.fetchone()
        conn.close()

        return jsonify({
            "success": True,
            "data": {
                "message": "Medical record added and blockchain entry created",
                "record_id": record_id,
                "patient_id": patient_id,
                "doctor_id": doctor_id,
                "diagnosis": diagnosis,
                "prescription": prescription,
                "tx_id": blockchain["tx_id"] if blockchain else None,
                "block_hash": blockchain["block_hash"] if blockchain else None
            }
        }), 201

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Get all records (with patient/doctor names and blockchain hash)
# ------------------------
@app.route("/records", methods=["GET"])
def get_all_records():

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                m.record_id,
                CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
                CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
                m.patient_id,
                m.doctor_id,
                m.diagnosis,
                m.prescription,
                m.date,
                b.tx_id,
                b.block_hash,
                b.timestamp AS blockchain_timestamp
            FROM medical_record m
            LEFT JOIN patient p ON m.patient_id = p.patient_id
            LEFT JOIN doctor d ON m.doctor_id = d.doctor_id
            LEFT JOIN blockchain_transaction b ON m.record_id = b.record_id
            ORDER BY m.date DESC, m.record_id DESC
        """)
        records = cursor.fetchall()
        conn.close()

        return jsonify({"success": True, "data": records}), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Get records of a specific patient
# ------------------------
@app.route("/records/<int:patient_id>", methods=["GET"])
def get_records(patient_id):

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Verify patient exists
        cursor.execute("SELECT patient_id FROM patient WHERE patient_id = %s", (patient_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({"success": False, "error": "Patient not found"}), 404

        cursor.execute("""
            SELECT
                m.record_id,
                CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
                CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
                m.patient_id,
                m.doctor_id,
                m.diagnosis,
                m.prescription,
                m.date,
                b.tx_id,
                b.block_hash,
                b.timestamp AS blockchain_timestamp
            FROM medical_record m
            LEFT JOIN patient p ON m.patient_id = p.patient_id
            LEFT JOIN doctor d ON m.doctor_id = d.doctor_id
            LEFT JOIN blockchain_transaction b ON m.record_id = b.record_id
            WHERE m.patient_id = %s
            ORDER BY m.date DESC
        """, (patient_id,))
        records = cursor.fetchall()
        conn.close()

        return jsonify({"success": True, "data": records}), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Get blockchain log
# ------------------------
@app.route("/blockchain", methods=["GET"])
def get_blockchain():

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                b.tx_id,
                b.record_id,
                b.patient_id,
                CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
                b.block_hash,
                b.timestamp
            FROM blockchain_transaction b
            LEFT JOIN patient p ON b.patient_id = p.patient_id
            ORDER BY b.timestamp DESC
        """)
        entries = cursor.fetchall()
        conn.close()

        return jsonify({"success": True, "data": entries}), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Verify record integrity
# ------------------------
@app.route("/records/verify/<int:record_id>", methods=["GET"])
def verify_record(record_id):

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT patient_id, doctor_id, diagnosis, prescription, date
            FROM medical_record
            WHERE record_id = %s
        """, (record_id,))
        record = cursor.fetchone()

        if not record:
            conn.close()
            return jsonify({"success": False, "error": "Record not found"}), 404

        cursor.execute("""
            SELECT tx_id, block_hash, timestamp
            FROM blockchain_transaction
            WHERE record_id = %s
            ORDER BY tx_id ASC
            LIMIT 1
        """, (record_id,))
        blockchain = cursor.fetchone()
        conn.close()

        if not blockchain:
            return jsonify({"success": False, "error": "Blockchain record not found"}), 404

        # Recompute hash using the same formula as the trigger:
        # SHA2(CONCAT(record_id, patient_id, diagnosis, date), 256) with date as stored
        import hashlib
        raw = f"{record_id}{record['patient_id']}{record['diagnosis']}{record['date']}"
        recalculated_hash = hashlib.sha256(raw.encode()).hexdigest()

        status = "VALID" if recalculated_hash == blockchain["block_hash"] else "TAMPERED"

        return jsonify({
            "success": True,
            "data": {
                "record_id": record_id,
                "status": status,
                "stored_hash": blockchain["block_hash"],
                "recalculated_hash": recalculated_hash,
                "tx_id": blockchain["tx_id"],
                "timestamp": str(blockchain["timestamp"])
            }
        }), 200

    except Exception as e:
        print("[DATABASE ERROR]", traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500


# ------------------------
# Run server
# ------------------------
if __name__ == "__main__":
    app.run(debug=True)