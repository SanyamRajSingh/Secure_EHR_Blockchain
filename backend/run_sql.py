import mysql.connector
import sys

def execute_sql_file(filename):
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='1@Dodiddone',
        database='ehr_system'
    )
    cursor = conn.cursor()
    with open(filename, 'r') as f:
        sql = f.read()
    
    # We are dropping DELIMITER lines since mysql.connector 
    # executes fully parsed blocks or single statements.
    # For procedures and triggers, we can just split by DELIMITER if needed,
    # but actually we can just pass the CREATE statement directly.
    import re
    # Extract the CREATE TRIGGER / CREATE PROCEDURE block
    block = re.search(r'(CREATE TRIGGER.*?END;)', sql, re.DOTALL)
    if not block:
        block = re.search(r'(CREATE PROCEDURE.*?END;)', sql, re.DOTALL)
        
    if "DROP TRIGGER" in sql:
        cursor.execute("DROP TRIGGER IF EXISTS after_medical_record_insert;")
    if "DROP PROCEDURE" in sql:
        cursor.execute("DROP PROCEDURE IF EXISTS show_diagnosis;")
        
    if block:
        stmt = block.group(1)
        print("Executing:\n", stmt)
        cursor.execute(stmt)
        conn.commit()
        print("Success for", filename)
    else:
        print("Could not parse block")

if __name__ == '__main__':
    for file in sys.argv[1:]:
        execute_sql_file(file)
