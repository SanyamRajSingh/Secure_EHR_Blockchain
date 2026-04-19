-- Add sample medical records (trigger will auto-create blockchain entries)
INSERT IGNORE INTO medical_record (patient_id, doctor_id, diagnosis, prescription, date) VALUES
(201, 101, 'Hypertension', 'Amlodipine 5mg daily', '2024-11-01'),
(202, 103, 'Viral fever', 'Paracetamol 500mg TID', '2024-11-05'),
(203, 102, 'Migraine', 'Sumatriptan 50mg as needed', '2024-11-10'),
(204, 105, 'Eczema', 'Hydrocortisone cream 1% BD', '2024-11-15'),
(205, 104, 'Knee osteoarthritis', 'Diclofenac gel, physiotherapy', '2024-11-20');

SELECT 'Sample medical records inserted' AS status;
SELECT COUNT(*) AS total_records FROM medical_record;
SELECT COUNT(*) AS total_blockchain FROM blockchain_transaction;
SELECT * FROM medical_record ORDER BY record_id DESC LIMIT 10;
SELECT * FROM blockchain_transaction ORDER BY tx_id DESC LIMIT 10;
