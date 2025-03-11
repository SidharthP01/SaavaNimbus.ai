from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS
import json
from datetime import datetime, timedelta
from openai import OpenAI
import os
from dotenv import load_dotenv


load_dotenv()  # Load environment variables

api_key = os.getenv("OPENAI_API_KEY")
print(api_key)  # Just for testing (remove this in production)


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

client = OpenAI(
  api_key="OPENAI_API_KEY")


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

# New Route 7: Fetch all data from Prediction table and send to ChatGPT
# Route 8: Fetch and display raw Prediction table data
@app.route("/api/predictions", methods=["GET"])
def get_raw_prediction_data():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prediction LIMIT 100")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({"predictions": rows})


# Route 9: Fetch predictions and display only AI-generated insights
@app.route("/api/insights", methods=["GET"])
def get_prediction_insights():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prediction LIMIT 100")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    insights = generate_insights(rows)
    return jsonify({"insights": insights})

def generate_insights(data):
    prompt = ("You are a cloud cost optimization assistant. Analyze the following cloud cost prediction data: \n"
              "Each entry contains InstanceId, cpu_anomaly, cpu_cost, network_in_anomaly, network_in_cost, "
              "network_out_anomaly, network_out_cost, predicted_cpu, predicted_network_in, predicted_network_out, "
              "scaling_recommendation, timestamp, and total_cost.\n"
              "Identify patterns, highlight cost spikes, explain scaling recommendations, and suggest strategies to optimize CPU "
              "and network usage. Focus on reducing costs without compromising performance.\n\n"
              f"Data: {data}")
    
    response = client.chat.completions.create(
      model="gpt-4o-mini",
      messages=[{"role": "system", "content": "You are a cloud cost optimization assistant."},
                {"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
if __name__ == "_main_":
    app.run(host="0.0.0.0", port=5000,debug=True)