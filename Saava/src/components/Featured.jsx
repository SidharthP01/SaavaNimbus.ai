import React from "react";
import "../styles/featured.css";

const data = [
  { title: "CPU Usage", value: 70 },
  { title: "Memory Usage", value: 60 },
  { title: "Disk Usage", value: 50 },
];

const Featured = () => {
  return (
    <div className="featured-container">
      {data.map((item, index) => (
        <div className="featured-box" key={index}>
          <h2>{item.title}</h2>
          <p>{item.value}%</p>
        </div>
      ))}
    </div>
  );
};

export default Featured;
