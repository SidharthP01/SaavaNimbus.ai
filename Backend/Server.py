from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS
import json
from datetime import datetime

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

# Route 1: Fetch all data from the table (Limited to 100 rows)
@app.route("/data", methods=["GET"])
def get_all_data():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ec2_metrics LIMIT 100")  # Limited for efficiency
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
    cursor.execute("SELECT DISTINCT InstanceId FROM ec2_metrics")  # Fetch only InstanceId
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(rows)

# Route 3: Fetch CPU utilization data for a specific instance with optional pagination
@app.route("/api/cpu/<instance_id>", methods=["GET"])
def get_cpu_data(instance_id):
    print(f"Received request for instance: {instance_id}")

    # Pagination parameters
    limit = request.args.get("limit", default=50, type=int)  # Default: 50 rows
    offset = request.args.get("offset", default=0, type=int)

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    # cursor.execute("""
    #     SELECT Timestamp_IST, CPUUtilization_Avg 
    #     FROM ec2_metrics 
    #     WHERE InstanceId = %s
    #     ORDER BY Timestamp_IST
    #     LIMIT %s OFFSET %s
    # """, (instance_id, limit, offset))
    cursor.execute("""
        SELECT Timestamp_IST, CPUUtilization_Avg 
        FROM ec2_metrics 
        WHERE InstanceId = %s
        ORDER BY Timestamp_IST
    """, (instance_id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    print(f"Fetched {len(rows)} rows from DB")

    # Convert CPUUtilization_Avg to float and Timestamp_IST to string format
    for row in rows:
        row["CPUUtilization_Avg"] = float(row["CPUUtilization_Avg"]) if row["CPUUtilization_Avg"] else 0.0
        if isinstance(row["Timestamp_IST"], datetime):
            row["Timestamp_IST"] = row["Timestamp_IST"].strftime('%Y-%m-%d %H:%M:%S')  # Convert to string

    response_json = json.dumps(rows, indent=2)  # Pretty-print JSON
    print(response_json[:1000])  # Print only the first 1000 characters for debugging

    return jsonify(rows)

# Route 4: Test API to verify server response
@app.route("/api/cpu/test", methods=["GET"])
def test_api():
    test_data = [{"Timestamp_IST": "2025-02-09 16:45:00", "CPUUtilization_Avg": 45.5}]
    return jsonify(test_data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    