// import { useState, useEffect } from "react";
// import axios from "axios";
// import InstanceWidget from "./InstanceWidget";
// import Chart from "./Chart";

// const InstanceChartContainer = () => {
//   const [selectedInstance, setSelectedInstance] = useState(null);
//   const [cpuData, setCpuData] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:5000/api/data")
//       .then((response) => {
//         if (response.data.length > 0) {
//           const firstInstance = response.data[0].InstanceId;
//           setSelectedInstance(firstInstance);
//         }
//       })
//       .catch((error) => console.error("Error fetching instance IDs:", error));
//   }, []);

//   useEffect(() => {
//     if (selectedInstance) {
//       axios
//         .get(`http://127.0.0.1:5000/api/cpu/${selectedInstance}`)
//         .then((response) => {
//           const formattedData = response.data.map((item) => ({
//             timestamp: item.Timestamp_IST,
//             cpuUtilization: parseFloat(item.CPUUtilization_Avg),
//           }));
//           setCpuData(formattedData);
//         })
//         .catch((error) => console.error("Error fetching CPU data:", error));
//     }
//   }, [selectedInstance]);

//   return (
//     <div>
//       <InstanceWidget setSelectedInstance={setSelectedInstance} />
//       <Chart data={cpuData} />
//     </div>
//   );
// };

// export default InstanceChartContainer;


import { useState, useEffect } from "react";
import axios from "axios";
import InstanceWidget from "./InstanceWidget";
import Chart from "./Chart";

const InstanceChartContainer = () => {
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [cpuData, setCpuData] = useState([]);

  useEffect(() => {
    if (selectedInstance) {
      axios
        .get(`http://127.0.0.1:5000/api/cpu/${selectedInstance}`)
        .then((response) => {
          const formattedData = response.data.map((item) => ({
            timestamp: item.Timestamp_IST,
            cpuUtilization: parseFloat(item.CPUUtilization_Avg),
          }));
          setCpuData(formattedData);
        })
        .catch((error) => console.error("Error fetching CPU data:", error));
    }
  }, [selectedInstance]);

  return (
    <div>
      <InstanceWidget setSelectedInstance={setSelectedInstance} />
      <Chart data={cpuData} />
    </div>
  );
};

export default InstanceChartContainer;