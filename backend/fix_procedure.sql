DROP PROCEDURE IF EXISTS show_diagnosis;

DELIMITER //

CREATE PROCEDURE show_diagnosis(IN p_id INT)
BEGIN
    SELECT m.date, m.diagnosis, m.prescription, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name
    FROM medical_record m
    LEFT JOIN doctor d ON m.doctor_id = d.doctor_id
    WHERE m.patient_id = p_id
    ORDER BY m.date DESC;
END;
//

DELIMITER ;

SELECT 'Procedure show_diagnosis created successfully' AS status;
