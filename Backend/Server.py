from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

# MySQL Database Configuration
db_config = {
    "host": "3.82.157.209",
    "user": "metrics_user",
    "password": "2692001",
    "database": "mysql_server",
    "port": 3306
}

# Function to establish a database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/mem")
def hello_cloud():
    return "<p>Hello, Cloud</p>"

@app.route("/data")
def get_data():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ec2_metrics")  # Replace with your actual table name
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(rows)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
