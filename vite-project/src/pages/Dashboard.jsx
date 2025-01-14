import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"

const Dashboard = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <Sidebar />
      </div>
    </>
  );
};

export default Dashboard;
