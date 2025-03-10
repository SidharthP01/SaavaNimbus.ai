from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Allow frontend to fetch data

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

# Route 1: Fetch all data from the ec2_metrics table (Limited to 100 rows)
@app.route("/data", methods=["GET"])
def get_all_data():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ec2_metrics LIMIT 100")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

# Route 2: Fetch only InstanceId values
@app.route("/api/data", methods=["GET"])
def get_instance_ids():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT DISTINCT InstanceId FROM ec2_metrics")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

# Route 3: Fetch CPU utilization data for a specific instance (last 7 days)
@app.route("/api/cpu/<instance_id>", methods=["GET"])
def get_cpu_data(instance_id):
    print(f"Received request for instance: {instance_id}")
    one_week_ago = datetime.now() - timedelta(days=7)

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT Timestamp_IST, CPUUtilization_Avg 
        FROM ec2_metrics 
        WHERE InstanceId = %s 
        AND Timestamp_IST >= %s
        ORDER BY Timestamp_IST
    """, (instance_id, one_week_ago))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    print(f"Fetched {len(rows)} rows from DB")
    for row in rows:
        row["CPUUtilization_Avg"] = float(row["CPUUtilization_Avg"]) if row["CPUUtilization_Avg"] else 0.0
        if isinstance(row["Timestamp_IST"], datetime):
            row["Timestamp_IST"] = row["Timestamp_IST"].strftime('%Y-%m-%d %H:%M:%S')

    response_json = json.dumps(rows, indent=2)
    print(response_json[:1000])
    return jsonify(rows)

# Route 4: Test API
@app.route("/api/cpu/test", methods=["GET"])
def test_api():
    test_data = [{"Timestamp_IST": "2025-02-09 16:45:00", "CPUUtilization_Avg": 45.5}]
    return jsonify(test_data)

# Route 5: Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

# Route 6: Sign Up
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Registration successful"})
    except mysql.connector.Error as err:
        cursor.close()
        conn.close()
        return jsonify({"success": False, "message": str(err)}), 400

# New Route 7: Fetch all data from the Prediction table (Limited to 100 rows)
@app.route("/prediction_data", methods=["GET"])
def get_prediction_data():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prediction LIMIT 100")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)