import Sidebar from "../components/Sidebar";
import Widget from "../components/Widget";
import InstanceWidget from "../components/InstanceWidget";
import React from "react";
import "./dashboard.css";
import Navbar from "../components/Navbar";
import Featured from "../components/Featured";
import Chart from "../components/Chart";
import Radarchart from "../components/Radarchart";
const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget />
          <InstanceWidget />
          <Radarchart />
        </div>
        <div className="charts">
          <Featured />
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
