// import React from "react";
// import "../styles/chart.css";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const initialData = [
//   { name: "Page A", timestamp: 4000, cpuUtilization: 2400, amt: 2400 },
//   { name: "Page B", timestamp: 3000, cpuUtilization: 1398, amt: 2210 },
//   { name: "Page C", timestamp: 2000, cpuUtilization: 9800, amt: 2290 },
//   { name: "Page D", timestamp: 2780, cpuUtilization: 3908, amt: 2000 },
//   { name: "Page E", timestamp: 1890, cpuUtilization: 4800, amt: 2181 },
//   { name: "Page F", timestamp: 2390, cpuUtilization: 3800, amt: 2500 },
//   { name: "Page G", timestamp: 3490, cpuUtilization: 4300, amt: 2100 },
// ];
// const Chart = ({ data = initialData }) => {
//   return (
//     <div className="chart">
//       {" "}
//       <ResponsiveContainer width="100%" height="100%">
//         {" "}
//         <AreaChart
//           width={730}
//           height={250}
//           data={data}
//           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//         >
//           {" "}
//           <defs>
//             {" "}
//             <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
//               {" "}
//               <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />{" "}
//               <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />{" "}
//             </linearGradient>{" "}
//             <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
//               {" "}
//               <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />{" "}
//               <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />{" "}
//             </linearGradient>{" "}
//           </defs>{" "}
//           <XAxis dataKey="name" /> <YAxis />{" "}
//           <CartesianGrid strokeDasharray="3 3" /> <Tooltip />{" "}
//           <Area
//             type="monotone"
//             dataKey="uv"
//             stroke="#8884d8"
//             fillOpacity={1}
//             fill="url(#colorUv)"
//           />{" "}
//           <Area
//             type="monotone"
//             dataKey="pv"
//             stroke="#82ca9d"
//             fillOpacity={1}
//             fill="url(#colorPv)"
//           />{" "}
//         </AreaChart>{" "}
//       </ResponsiveContainer>{" "}
//     </div>
//   );
// };

// export default Chart;
import React from "react";
import "../styles/chart.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Template data matching the API data structure
const initialData = [
  { timestamp: "2025-01-31 03:26:47", cpuUtilization: 3.42 },
  { timestamp: "2025-01-31 03:31:47", cpuUtilization: 3.36 },
  { timestamp: "2025-01-31 03:36:48", cpuUtilization: 3.28 },
  { timestamp: "2025-01-31 03:41:48", cpuUtilization: 3.33 },
  { timestamp: "2025-01-31 03:46:49", cpuUtilization: 3.3 },
  { timestamp: "2025-01-31 03:51:50", cpuUtilization: 3.41 },
  { timestamp: "2025-01-31 03:56:50", cpuUtilization: 3.4 },
];

const Chart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : initialData;

  return (
    <div className="chart" style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
  dataKey="timestamp"
  angle={-45}
  label={{ value: "Timestamp (IST) ", angle: 0, position: "Center" }}
  textAnchor="end"
  height={60}
  interval={4}
  tick={{ fill: '#FFFFFF' }}
  axisLine={{ stroke: '#FFFFFF' }}
  tickLine={{ stroke: '#FFFFFF' }}
  background={{ fill: '#FFFFFF' }}
/>
          <YAxis
            label={{
              value: "CPU Utilization (%)",
              angle: -90,
              position: "insideLeft",
            }}
            domain={[0, 5]}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="cpuUtilization"
            stroke="#8884d8"
            fill="url(#colorCpu)"
            name="CPU Utilization"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
