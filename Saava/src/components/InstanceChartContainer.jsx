import { useState, useEffect } from "react";
import axios from "axios";
import Chart from "./Chart";

const InstanceChartContainer = ({ selectedInstance }) => {
  const [cpuData, setCpuData] = useState([]);

  // Fetch CPU utilization data when selectedInstance changes
  useEffect(() => {
    if (selectedInstance) {
      axios
        .get(`http://127.0.0.1:5000/data/${selectedInstance}`)
        .then((response) => {
          const formattedData = response.data.map((item) => ({
            timestamp: item.Timestamp_IST,
            cpuUtilization: item.CPUUtilization_Avg || 0,
          }));
          setCpuData(formattedData);
        })
        .catch((error) => console.error("Error fetching CPU data:", error));
    }
  }, [selectedInstance]);

  return <Chart data={cpuData} />;
};

export default InstanceChartContainer;
