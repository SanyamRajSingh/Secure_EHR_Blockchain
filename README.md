# 🏥 Secure Electronic Health Record Management System Using Blockchain

![React](https://img.shields.io/badge/Frontend-React-blue)
![Flask](https://img.shields.io/badge/Backend-Flask-black)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![Solidity](https://img.shields.io/badge/Blockchain-Solidity-purple)
![Hardhat](https://img.shields.io/badge/Framework-Hardhat-yellow)
![Ethereum](https://img.shields.io/badge/Network-Ethereum-grey)
![License](https://img.shields.io/badge/License-MIT-green)

A **blockchain-secured healthcare system** that ensures medical records cannot be secretly modified.

The system stores medical data in **MySQL** while storing a **SHA-256 cryptographic hash on the Ethereum blockchain** (simulated or real). If the database record is modified directly, the system detects tampering by comparing hashes.

---

## 📌 Key Idea

Instead of storing full medical records on the blockchain (which is expensive and slow), the system stores **only the cryptographic fingerprint (hash).**

```
Medical Record → SHA-256 Hash → Blockchain
```

If someone edits the database record directly, the hash changes, and the system detects it instantly.

---

## 🌍 Why This Project Matters

Healthcare data breaches and integrity issues are a major global concern.

This project demonstrates how **blockchain can guarantee medical record integrity** while still allowing fast database queries.

The hybrid approach provides:
- **Tamper-proof Verification**
- **Fast Database Performance**
- **Low Blockchain Storage Cost**
- **Transparent Record Auditing**

---

## 🧠 System Architecture

![System Architecture](image-1.png)

```text
       [ React Dashboard ]
                │
                ▼
       [ Flask REST API ]
                │
                ▼
      [ MySQL Database ] ──(Trigger)──> [ SHA-256 Hash Generation ]
      (Medical Records)                             │
                                                    ▼
                                     [ Ethereum Smart Contract ]
                                                    │
                                                    ▼
                                        [ Blockchain Ledger ]
```

This architecture ensures:
✔ Fast database queries  
✔ Tamper-proof verification  
✔ Low blockchain storage cost  

---

## 🚀 Features

### 📊 Dashboard & UI
- **Modern, Animated UI**: Built using React, TailwindCSS, and GSAP for fluid, lifecycle-safe animations.
- **Dark/Light Mode**: Persistent theme toggle feature to improve accessibility and user experience.
- Total patients, medical records, and live blockchain activity monitor.

### 🧾 Medical Record Management
- Secure patient and doctor registration.
- Add and view patient medical history.
- Searchable patient record tables with enhanced contrast.

### 🔐 Blockchain Integrity Protection
- Automatic SHA-256 hashing of medical records upon creation via database triggers.
- Hash storage on a blockchain environment.
- Single-click record verification system that instantly highlights tampered data.

### 📄 Comprehensive Architecture Documentation
- A full **Database Architecture report** (`EHR_Database_Documentation.md`) generated from the live schema, featuring Entity Analysis, ER modeling, and Normalization checks!

---

## ⚙️ Tech Stack

### Frontend
- **React (Vite)**
- **TailwindCSS**
- **GSAP** (Animations)
- **React Router & Axios**

### Backend
- **Python Flask**
- **Flask-CORS**
- **MySQL Connector**

### Database
- **MySQL 8.0**
- *Trigger-based cryptographic hashing*

---

## ⚡ Running Process (Step-by-Step)

Follow these instructions to run the application locally on your machine.

### 1. Clone Repository & Setup Database
```bash
git clone https://github.com/SanyamRajSingh/Secure_EHR_Blockchain.git
cd Secure_EHR_Blockchain
```
- Open MySQL and create the database:
  ```sql
  CREATE DATABASE ehr_system;
  ```
- Import the schema and routines from the SQL files provided in the `backend/` folder (run them in MySQL Workbench or via shell).

### 2. Backend Setup
Navigate to the backend directory, set up your virtual environment, and install dependencies:
```bash
cd backend
python -m venv venv

# For Windows:
venv\Scripts\activate
# For Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

Verify your MySQL credentials inside `backend/db.py`:
```python
# db.py
host="localhost",
user="root",
password="your_password", # Update this
database="ehr_system"
```

Start the Flask Server:
```bash
python app.py
```
*(The backend runs on `http://127.0.0.1:5000`)*

### 3. Frontend Setup
Open a new terminal window/tab:
```bash
cd frontend/ehr-frontend
npm install
npm run dev
```
*(The frontend will start on your localhost, typically `http://localhost:5173`)*

Open your browser and navigate to the frontend URL. You can now register as an admin, doctor, or patient, login, and start adding records!

---

## 🧪 Example Workflow: Tamper Detection

1. **Add Record:** A doctor logs in and prescribes medicine for a patient.
2. **Blockchain Stamp:** A database trigger automatically generates a SHA-256 hash of this record and saves it securely as a "blockchain transaction".
3. **Tamper Test:** Manually open your MySQL database and alter the prescription or diagnosis of that record directly.
4. **Verification:** Go to the **Verify Records** page on the dashboard and verify the record. The system will flag it as **TAMPERED** in red because the new computed hash no longer matches the original blockchain hash!

---

## 🗄 Database Documentation

For an in-depth, professional breakdown of the system schema (including 1NF-BCNF Normalization Analysis, Relationships, ER Model, and constraints), see the included documentation:  
👉 **[EHR Database Documentation](EHR_Database_Documentation.md)**

---

## 👨‍💻 Author

**Sanyam Raj Singh Dodiya**  
*Secure Electronic Health Record Management System Using Blockchain*

---

⭐ **If you found this project interesting, consider starring the repository!**