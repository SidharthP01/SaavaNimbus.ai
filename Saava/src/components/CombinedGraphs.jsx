// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import InstanceWidget from "./InstanceWidget";
// import "../styles/combinedgraph.css";

// const CombinedGraphs = () => {
//   const [selectedInstance, setSelectedInstance] = useState(null);
//   const [chartData, setChartData] = useState({
//     cpuData: [],
//     predictedData: [],
//   });
//   const [zoomedGraph, setZoomedGraph] = useState(null);

//   useEffect(() => {
//     if (selectedInstance) {
//       fetchCpuData(selectedInstance);
//       fetchPredictionData(selectedInstance);
//     }
//   }, [selectedInstance]);

//   const fetchCpuData = async (instance) => {
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:5000/api/cpu/${instance}`
//       );
//       const formattedData = response.data.map((item) => ({
//         timestamp: item.Timestamp_IST,
//         cpuUtilization: parseFloat(item.CPUUtilization_Avg),
//       }));
//       setChartData((prevData) => ({ ...prevData, cpuData: formattedData }));
//     } catch (error) {
//       console.error("Error fetching CPU data:", error);
//     }
//   };

//   const fetchPredictionData = async (instance) => {
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:5000/api/prediction/${instance}`
//       );
//       const formattedData = response.data.map((item) => ({
//         timestamp: item.timestamp,
//         predicted_cpu: parseFloat(item.predicted_cpu),
//         predicted_network_in: parseFloat(item.predicted_network_in),
//         predicted_network_out: parseFloat(item.predicted_network_out),
//       }));
//       setChartData((prevData) => ({
//         ...prevData,
//         predictedData: formattedData,
//       }));
//     } catch (error) {
//       console.error("Error fetching predicted data:", error);
//     }
//   };

//   const handleGraphClick = (graphType) => {
//     setZoomedGraph(graphType);
//   };

//   const renderGraph = (title, dataKey, strokeColor, data) => (
//     <div
//       className={`featured-box ${zoomedGraph === dataKey ? "zoomed" : ""}`}
//       onClick={() => handleGraphClick(dataKey)}
//     >
//       <h3>{title}</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey={dataKey}
//             stroke={strokeColor}
//             strokeWidth={2}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );

//   return (
//     <div
//       className={`featured-container grid-layout ${
//         zoomedGraph ? "zoomed-container" : ""
//       }`}
//     >
//       <div className="first-row">
//         <div className="instance-widget">
//           <InstanceWidget setSelectedInstance={setSelectedInstance} />
//         </div>
//         {renderGraph(
//           "CPU Utilization",
//           "cpuUtilization",
//           "#8884d8",
//           chartData.cpuData
//         )}
//       </div>

//       <div className="second-row">
//         {renderGraph(
//           "Predicted CPU Utilization",
//           "predicted_cpu",
//           "#82ca9d",
//           chartData.predictedData
//         )}
//         {renderGraph(
//           "Predicted Network In",
//           "predicted_network_in",
//           "#ffc658",
//           chartData.predictedData
//         )}
//         {renderGraph(
//           "Predicted Network Out",
//           "predicted_network_out",
//           "#ff7300",
//           chartData.predictedData
//         )}
//       </div>
//     </div>
//   );
// };

// export default CombinedGraphs;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import InstanceWidget from "./InstanceWidget";
import "../styles/combinedgraph.css";

const CombinedGraphs = () => {
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [chartData, setChartData] = useState({
    cpuData: [],
    predictedData: [],
  });
  const [zoomedGraph, setZoomedGraph] = useState(null);

  useEffect(() => {
    if (selectedInstance) {
      fetchCpuData(selectedInstance);
      fetchPredictionData(selectedInstance);
    }
  }, [selectedInstance]);

  const fetchCpuData = async (instance) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/cpu/${instance}`
      );
      const formattedData = response.data.map((item) => ({
        timestamp: item.Timestamp_IST,
        cpuUtilization: parseFloat(item.CPUUtilization_Avg),
      }));
      setChartData((prevData) => ({ ...prevData, cpuData: formattedData }));
    } catch (error) {
      console.error("Error fetching CPU data:", error);
    }
  };

  const fetchPredictionData = async (instance) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/prediction/${instance}`
      );
      const formattedData = response.data.map((item) => ({
        timestamp: item.timestamp,
        predicted_cpu: parseFloat(item.predicted_cpu),
        predicted_network_in: parseFloat(item.predicted_network_in),
        predicted_network_out: parseFloat(item.predicted_network_out),
      }));
      setChartData((prevData) => ({
        ...prevData,
        predictedData: formattedData,
      }));
    } catch (error) {
      console.error("Error fetching predicted data:", error);
    }
  };

  const handleGraphClick = (graphType) => {
    setZoomedGraph(graphType);
  };

  const renderGraph = (
    title,
    dataKey,
    strokeColor,
    data,
    isAreaChart = false
  ) => (
    <div
      className={`featured-box ${zoomedGraph === dataKey ? "zoomed" : ""}`}
      onClick={() => handleGraphClick(dataKey)}
    >
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {isAreaChart ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id={`color${dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              fill={`url(#color${dataKey})`}
              strokeWidth={2}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={2}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );

  return (
    <div
      className={`featured-container grid-layout ${
        zoomedGraph ? "zoomed-container" : ""
      }`}
    >
      <div className="first-row">
        <div className="instance-widget">
          <InstanceWidget setSelectedInstance={setSelectedInstance} />
        </div>
        {renderGraph(
          "CPU Utilization",
          "cpuUtilization",
          "#8884d8",
          chartData.cpuData,
          true // Render as AreaChart
        )}
      </div>

      <div className="second-row">
        {renderGraph(
          "Predicted CPU Utilization",
          "predicted_cpu",
          "#82ca9d",
          chartData.predictedData
        )}
        {renderGraph(
          "Predicted Network In",
          "predicted_network_in",
          "#ffc658",
          chartData.predictedData
        )}
        {renderGraph(
          "Predicted Network Out",
          "predicted_network_out",
          "#ff7300",
          chartData.predictedData
        )}
      </div>
    </div>
  );
};

export default CombinedGraphs;
