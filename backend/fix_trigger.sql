DROP TRIGGER IF EXISTS after_record_insert;
DROP TRIGGER IF EXISTS after_medical_record_insert;

DELIMITER //
CREATE TRIGGER after_medical_record_insert
AFTER INSERT ON medical_record
FOR EACH ROW
BEGIN
  INSERT INTO blockchain_transaction (block_hash, timestamp, record_id, patient_id)
  VALUES (
    SHA2(CONCAT(NEW.record_id, NEW.patient_id, NEW.diagnosis, IFNULL(NEW.date, 'None')), 256),
    NOW(),
    NEW.record_id,
    NEW.patient_id
  );
END;
//
DELIMITER ;

SELECT 'Trigger after_medical_record_insert created successfully' AS status;
SHOW TRIGGERS;
