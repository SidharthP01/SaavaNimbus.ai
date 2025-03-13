import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import "../styles/featured.css";
import InstanceWidget from "./InstanceWidget";

const Featured = () => {
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (selectedInstance) {
      axios
        .get(`http://127.0.0.1:5000/api/prediction/${selectedInstance}`)
        .then((response) => {
          const formattedData = response.data.map((item) => ({
            timestamp: item.timestamp,
            predicted_cpu: parseFloat(item.predicted_cpu),
            predicted_network_in: parseFloat(item.predicted_network_in),
            predicted_network_out: parseFloat(item.predicted_network_out),
          }));
          setChartData(formattedData);
        })
        .catch((error) => console.error("Error fetching predicted data:", error));
    }
  }, [selectedInstance]);

  return (
    <div className="featured-container">
      <InstanceWidget setSelectedInstance={setSelectedInstance} />
      <div className="chart-box">
        <h3>Predicted CPU Utilization</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="predicted_cpu" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-box">
        <h3>Predicted Network In</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="predicted_network_in" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-box">
        <h3>Predicted Network Out</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="predicted_network_out" stroke="#ffc658" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Featured;
