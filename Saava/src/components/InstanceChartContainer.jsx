import { useState, useEffect } from "react";
import axios from "axios";
import InstanceWidget from "./InstanceWidget"; // Instance selector
import Chart from "./Chart"; // Graph component

const InstanceChartContainer = () => {
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [cpuData, setCpuData] = useState([]);

  // Fetch instances initially and set the first one as default
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/data")  // This can be used to fetch all data for instance selection
      .then((response) => {
        if (response.data.length > 0) {
          const firstInstance = response.data[0].InstanceId;
          setSelectedInstance(firstInstance); // Set the first instance by default
        }
      })
      .catch((error) => console.error("Error fetching instance IDs:", error));
  }, []);

  // Fetch CPU utilization data when an instance is selected
  useEffect(() => {
    if (selectedInstance) {
      axios
        .get(`http://127.0.0.1:5000/api/cpu/${selectedInstance}`)
        .then((response) => {
          const formattedData = response.data.map((item) => ({
            timestamp: item.Timestamp_IST,
            cpuUtilization: parseFloat(item.CPUUtilization_Avg) || 0, // Ensure it's a float
          }));
          console.log("Fetched CPU Data:", formattedData); // Debugging
          setCpuData(formattedData);
        })
        .catch((error) => console.error("Error fetching CPU data:", error));
    }
  }, [selectedInstance]);
  
  return (
    <div>
      <InstanceWidget setSelectedInstance={setSelectedInstance} />
      {cpuData.length > 0 ? <Chart data={cpuData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default InstanceChartContainer;
