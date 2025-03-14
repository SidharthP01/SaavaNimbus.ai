import React from "react";
import "./dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Widget from "../components/Widget";
import Featured from "../components/Featured";
import InstanceChartContainer from "../components/InstanceChartContainer";
import InsightsDisplay from "../components/InsightsContainer";
import CombinedGraphs from "../components/CombinedGraphs";
const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-content">
          <div className="widgets">
            <InsightsDisplay />
            <Widget />
          </div>
          {/* <div className="charts">
            <Featured />
            <InstanceChartContainer />
          </div> */}
          <div className="combined-graphs">
            <CombinedGraphs /> {/* Add CombinedGraphs here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
