import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1@Dodiddone",
        database="ehr_system",
        autocommit=True,
        connection_timeout=30
    )
    return connection