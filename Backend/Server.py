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
  api_key = api_key)


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
    cursor.execute("SELECT * FROM prediction ORDER BY timestamp DESC LIMIT 100")
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


@app.route("/api/prediction/<instance_id>", methods=["GET"])
def get_predicted_metrics(instance_id):
    print(f"Received request for predicted data of instance: {instance_id}")
    
    start_time = datetime(2025, 1, 30)
    end_time = datetime(2025, 2, 9)
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT timestamp, predicted_cpu, predicted_network_in, predicted_network_out 
        FROM prediction 
        WHERE InstanceId = %s 
        AND timestamp >= %s 
        AND timestamp < %s
        ORDER BY timestamp
    """, (instance_id, start_time, end_time))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    print(f"Fetched {len(rows)} rows from prediction table")
    for row in rows:
        row["predicted_cpu"] = float(row["predicted_cpu"]) if row["predicted_cpu"] else 0.0
        row["predicted_network_in"] = float(row["predicted_network_in"]) if row["predicted_network_in"] else 0.0
        row["predicted_network_out"] = float(row["predicted_network_out"]) if row["predicted_network_out"] else 0.0
        
        if isinstance(row["timestamp"], datetime):
            row["timestamp"] = row["timestamp"].strftime('%Y-%m-%d %H:%M:%S')
    
    response_json = json.dumps(rows, indent=2)
    print(response_json[:1000])
    return jsonify(rows)

@app.route("/api/anomalies/<instance_id>", methods=["GET"])
def get_anomaly_and_avg_cpu(instance_id):
    print(f"Fetching anomaly data and avg CPU for instance: {instance_id} on 9th Feb 2025")

    target_date = datetime(2025, 2, 9)

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)

    # Fetch the latest anomaly data for Feb 9, 2025
    cursor.execute("""
        SELECT cpu_anomaly, network_in_anomaly, network_out_anomaly, timestamp 
        FROM prediction 
        WHERE InstanceId = %s 
        AND DATE(timestamp) = %s 
        ORDER BY timestamp DESC 
        LIMIT 1
    """, (instance_id, target_date.date()))
    latest_anomaly = cursor.fetchone()

    # Fetch the average predicted CPU for Feb 9, 2025
    cursor.execute("""
        SELECT AVG(predicted_cpu) as avg_predicted_cpu 
        FROM prediction 
        WHERE InstanceId = %s 
        AND DATE(timestamp) = %s
    """, (instance_id, target_date.date()))
    avg_predicted_cpu = cursor.fetchone()

    cursor.close()
    conn.close()

    # Determine anomaly status
    anomaly_status = {
        "cpu_anomaly": "Anomaly detected" if latest_anomaly and latest_anomaly["cpu_anomaly"] != 0 else "No anomaly",
        "network_in_anomaly": "Anomaly detected" if latest_anomaly and latest_anomaly["network_in_anomaly"] != 0 else "No anomaly",
        "network_out_anomaly": "Anomaly detected" if latest_anomaly and latest_anomaly["network_out_anomaly"] != 0 else "No anomaly"
    }

    response = {
        "latest_timestamp": latest_anomaly["timestamp"] if latest_anomaly else None,
        "cpu_anomaly_status": anomaly_status["cpu_anomaly"],
        "network_in_anomaly_status": anomaly_status["network_in_anomaly"],
        "network_out_anomaly_status": anomaly_status["network_out_anomaly"],
        "avg_predicted_cpu_9_feb": round(avg_predicted_cpu["avg_predicted_cpu"], 2) if avg_predicted_cpu and avg_predicted_cpu["avg_predicted_cpu"] else 0.0
    }

    return jsonify(response)

@app.route("/api/anomalies/all", methods=["GET"])
def get_all_anomalies_and_avg_cpu():
    INSTANCE_MAP = {
        "i-0bd423f94480ad306": "1",
        "i-02293990e2fd9c785": "2",
        "i-0821f01cd4fd41778": "3",
        "i-0c1b807831b124a06": "4"
    }
    
    target_date = datetime(2025, 2, 9)
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)

    try:
        instance_ids = list(INSTANCE_MAP.keys())
        params = [target_date.strftime('%Y-%m-%d')] + instance_ids
        
        # Get latest anomalies
        query_anomalies = f"""
            SELECT p.InstanceId, p.cpu_anomaly, p.network_in_anomaly,
                   p.network_out_anomaly, p.timestamp
            FROM prediction p
            INNER JOIN (
                SELECT InstanceId, MAX(timestamp) as max_ts
                FROM prediction
                WHERE DATE(timestamp) = %s
                AND InstanceId IN ({','.join(['%s']*len(instance_ids))})
                GROUP BY InstanceId
            ) latest ON p.InstanceId = latest.InstanceId AND p.timestamp = latest.max_ts
        """
        
        cursor.execute(query_anomalies, params)
        latest_anomalies = {
            INSTANCE_MAP[row['InstanceId']]: row for row in cursor.fetchall()
        }

        # Get average CPU
        query_avg = f"""
            SELECT InstanceId, 
                   ROUND(AVG(CAST(predicted_cpu AS DECIMAL(10,2))), 2) as avg_predicted_cpu
            FROM prediction
            WHERE DATE(timestamp) = %s
            AND InstanceId IN ({','.join(['%s']*len(instance_ids))})
            GROUP BY InstanceId
        """
        
        cursor.execute(query_avg, params)
        avg_cpu = {
            INSTANCE_MAP[row['InstanceId']]: row['avg_predicted_cpu']
            for row in cursor.fetchall()
        }

    except Exception as e:
        print(f"Database error: {str(e)}")
        return jsonify({
            "error": "Database operation failed",
            "details": str(e)
        }), 500
    finally:
        cursor.close()
        conn.close()

    # Build response with fallback values
    response = {}
    for instance_num in ['1', '2', '3', '4']:
        anomaly = latest_anomalies.get(instance_num, {})
        avg = avg_cpu.get(instance_num, 0.0)
        
        response[instance_num] = {
            "latest_timestamp": anomaly.get('timestamp'),
            "cpu_anomaly_status": "Anomaly detected" if anomaly.get('cpu_anomaly', 0) != 0 else "No anomaly",
            "network_in_anomaly_status": "Anomaly detected" if anomaly.get('network_in_anomaly', 0) != 0 else "No anomaly",
            "network_out_anomaly_status": "Anomaly detected" if anomaly.get('network_out_anomaly', 0) != 0 else "No anomaly",
            "avg_predicted_cpu_9_feb": float(avg) if avg else 0.0
        }

    return jsonify(response)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)