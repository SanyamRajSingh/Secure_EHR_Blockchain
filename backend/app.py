from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db_connection
import hashlib
import subprocess
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ------------------------
# Home
# ------------------------
@app.route("/")
def home():
    return "Backend running"


# ------------------------
# Get all users
# ------------------------
@app.route("/users", methods=["GET"])
def get_users():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM USER_LOGIN")
    users = cursor.fetchall()

    conn.close()

    return jsonify(users)


# ------------------------
# Get all patients
# ------------------------
@app.route("/patients", methods=["GET"])
def get_patients():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM PATIENT")
    patients = cursor.fetchall()

    conn.close()

    return jsonify(patients)

# ------------------------
# Add patient
# ------------------------
@app.route("/patients", methods=["POST"])
def add_patient():

    data = request.get_json()

    user_id = data["user_id"]
    age = data["age"]
    gender = data["gender"]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO PATIENT (user_id, age, gender)
        VALUES (%s,%s,%s)
        """,
        (user_id, age, gender)
    )

    conn.commit()

    patient_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "message": "Patient created successfully",
        "patient_id": patient_id
    })

# ------------------------
# Add user / doctor
# ------------------------
@app.route("/users", methods=["POST"])
def add_user():

    data = request.get_json()

    name = data["name"]
    role = data["role"]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO USER_LOGIN (name, role)
        VALUES (%s,%s)
        """,
        (name, role)
    )

    conn.commit()

    user_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "message": "User created",
        "user_id": user_id
    })


# ------------------------
# Dashboard summary
# ------------------------
@app.route("/dashboard", methods=["GET"])
def dashboard_summary():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # total patients
    cursor.execute("SELECT COUNT(*) AS total_patients FROM PATIENT")
    total_patients = cursor.fetchone()["total_patients"]

    # total records
    cursor.execute("SELECT COUNT(*) AS total_records FROM MEDICAL_RECORD")
    total_records = cursor.fetchone()["total_records"]

    # latest records + blockchain hash
    cursor.execute("""
        SELECT
            m.record_id,
            m.patient_id,
            m.doctor_id,
            m.diagnosis,
            m.prescription,
            m.date,
            b.block_hash
        FROM MEDICAL_RECORD m
        LEFT JOIN BLOCKCHAIN_TRANSACTION b
        ON m.record_id = b.record_id
        ORDER BY m.record_id DESC
        LIMIT 10
    """)

    latest_records = cursor.fetchall()

    conn.close()

    return jsonify({
        "total_patients": total_patients,
        "total_records": total_records,
        "latest_records": latest_records
    })


# ------------------------
# Add medical record
# ------------------------
@app.route("/records", methods=["POST"])
def add_record():

    data = request.get_json()

    patient_id = data["patient_id"]
    doctor_id = data["doctor_id"]
    diagnosis = data["diagnosis"]
    prescription = data["prescription"]

    # Create SHA256 hash
    raw_data = f"{patient_id}{doctor_id}{diagnosis}{prescription}"
    record_hash = hashlib.sha256(raw_data.encode()).hexdigest()

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO MEDICAL_RECORD
        (patient_id, doctor_id, diagnosis, prescription, date)
        VALUES (%s, %s, %s, %s, CURDATE())
    """

    try:

        cursor.execute(
            query,
            (patient_id, doctor_id, diagnosis, prescription)
        )

        conn.commit()

    except Exception as e:

        print("DATABASE ERROR:", e)
        conn.close()

        return jsonify({"error": str(e)}), 500

    record_id = cursor.lastrowid

    conn.close()

    # ------------------------
    # Store hash on Blockchain
    # ------------------------
    try:

        env = os.environ.copy()
        env["PATIENT_ID"] = str(patient_id)
        env["RECORD_HASH"] = record_hash

        result = subprocess.run(

            ["npx.cmd", "hardhat", "run", "scripts/storeHash.js", "--network", "localhost"],

            cwd=r"..\blockchain",

            env=env,

            capture_output=True,
            text=True,
            shell=True
        )

        if "BLOCKCHAIN_SUCCESS" not in result.stdout:

            return jsonify({
                "error": "Blockchain storage failed",
                "details": result.stderr
            }), 500

    except Exception as e:

        return jsonify({
            "error": "Blockchain invocation error",
            "details": str(e)
        }), 500


    # ------------------------
    # Store blockchain record
    # ------------------------
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO BLOCKCHAIN_TRANSACTION
        (block_hash, timestamp, record_id, patient_id)
        VALUES (%s, NOW(), %s, %s)
        """,
        (record_hash, record_id, patient_id)
    )

    conn.commit()
    conn.close()

    return jsonify({

        "message": "Medical record added successfully",
        "record_id": record_id,
        "patient_id": patient_id,
        "record_hash": record_hash

    }), 201


# ------------------------
# Get records of a patient
# ------------------------
@app.route("/records/<int:patient_id>", methods=["GET"])
def get_records(patient_id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT
            m.record_id,
            m.patient_id,
            m.doctor_id,
            m.diagnosis,
            m.prescription,
            m.date,
            b.block_hash
        FROM MEDICAL_RECORD m
        LEFT JOIN BLOCKCHAIN_TRANSACTION b
        ON m.record_id = b.record_id
        WHERE m.patient_id = %s
    """

    cursor.execute(query, (patient_id,))
    records = cursor.fetchall()

    conn.close()

    return jsonify(records)


# ------------------------
# Verify record integrity
# ------------------------
@app.route("/records/verify/<int:record_id>", methods=["GET"])
def verify_record(record_id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            patient_id,
            doctor_id,
            diagnosis,
            prescription
        FROM MEDICAL_RECORD
        WHERE record_id = %s
        """,
        (record_id,)
    )

    record = cursor.fetchone()

    if not record:
        conn.close()
        return jsonify({"error": "Record not found"}), 404


    cursor.execute(
        """
        SELECT block_hash
        FROM BLOCKCHAIN_TRANSACTION
        WHERE record_id = %s
        """,
        (record_id,)
    )

    blockchain = cursor.fetchone()

    conn.close()

    if not blockchain:
        return jsonify({"error": "Blockchain record not found"}), 404


    raw_data = f"{record['patient_id']}{record['doctor_id']}{record['diagnosis']}{record['prescription']}"
    recalculated_hash = hashlib.sha256(raw_data.encode()).hexdigest()

    status = "VALID" if recalculated_hash == blockchain["block_hash"] else "TAMPERED"

    return jsonify({

        "record_id": record_id,
        "status": status,
        "stored_hash": blockchain["block_hash"],
        "recalculated_hash": recalculated_hash

    })


# ------------------------
# Run server
# ------------------------
if __name__ == "__main__":
    app.run(debug=True)