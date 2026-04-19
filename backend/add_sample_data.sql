-- Phase 4.4: Add sample doctors (only if count < 5)
INSERT IGNORE INTO doctor (doctor_id, first_name, last_name) VALUES
(101, 'Ananya', 'Krishnan'),
(102, 'Rohan', 'Mehta'),
(103, 'Priya', 'Subramaniam'),
(104, 'Vikram', 'Nair'),
(105, 'Deepa', 'Chandrasekaran');

-- Doctor Specializations
INSERT IGNORE INTO doctor_specialization (doctor_id, specialization) VALUES
(101, 'Cardiology'),
(102, 'Neurology'),
(103, 'Pediatrics'),
(104, 'Orthopedics'),
(105, 'Dermatology');

-- Patients (only if count < 5)
INSERT IGNORE INTO patient (patient_id, first_name, last_name, gender) VALUES
(201, 'Karthik', 'Rajan', 'Male'),
(202, 'Meena', 'Pillai', 'Female'),
(203, 'Arjun', 'Bose', 'Male'),
(204, 'Lakshmi', 'Iyer', 'Female'),
(205, 'Suresh', 'Venkatesh', 'Male');

-- Patient Phones
INSERT IGNORE INTO patient_phone (patient_id, phone_number) VALUES
(201, '9876543211'),
(202, '9123456781'),
(203, '9988776656'),
(204, '9001122335'),
(205, '9765432108');

SELECT 'Sample doctors and patients inserted' AS status;
SELECT COUNT(*) AS doctor_count FROM doctor;
SELECT COUNT(*) AS patient_count FROM patient;
