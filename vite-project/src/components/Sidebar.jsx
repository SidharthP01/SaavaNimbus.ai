import React from "react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <a href="/" className="sidebar-logo">
          LOGO
        </a>
      </div>
      <nav className="sidebar-menu">
        <a href="/" className="sidebar-link">
          Home
        </a>
        <a href="/dashboard" className="sidebar-link">
          Dashboard
        </a>
        <a href="/settings" className="sidebar-link">
          Settings
        </a>
        <a href="/about" className="sidebar-link">
          About
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
