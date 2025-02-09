import React from "react";
import "../styles/radarchart.css";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    subject: "CPU",
    A: 90,
    B: 80,
    fullMark: 100,
  },
  {
    subject: "GPU",
    A: 98,
    B: 100,
    fullMark: 100,
  },
  {
    subject: "NetIN",
    A: 86,
    B: 130,
    fullMark: 100,
  },
  {
    subject: "NetOut",
    A: 99,
    B: 100,
    fullMark: 100,
  },
  {
    subject: "PacketIN",
    A: 85,
    B: 90,
    fullMark: 100,
  },
  {
    subject: "PacketOut",
    A: 65,
    B: 85,
    fullMark: 100,
  },
];

const Radarchart = () => {
  return (
    <div className="radarchart">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="Instance 1"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Radarchart;
