// import React from "react";
// import "../styles/Sidebar.css";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PersonIcon from "@mui/icons-material/Person";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import LogoutIcon from "@mui/icons-material/Logout";
// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <div className="top">
//         <span className="logo">Cloud</span>
//       </div>
//       <hr />
//       <div className="centre">
//         <ul className="ull">
//           <li>
//             <DashboardIcon />
//             <span>Dashboard</span>
//           </li>
//           <li>
//             <PersonIcon />
//             <span>Users</span>
//           </li>
//           <li>
//             <AccountCircleIcon />
//             <span>Profile</span>
//           </li>
//           <li>
//             <LogoutIcon />
//             <span>Logout</span>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// src/components/Sidebar.jsx
import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">SaavaNimbus.ai</h1>
      </div>
      <hr className="divider" />
      <nav className="menu-container">
        <ul className="menu">
          <li>
            <button className="menu-button">
              <AccountCircleIcon className="menu-icon" />
              <span>Profile</span>
            </button>
          </li>
          <li>
            <button className="menu-button">
              <DashboardIcon className="menu-icon" />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button className="menu-button">
              <NotificationsIcon className="menu-icon" />
              <span>Alerts</span>
            </button>
          </li>
          <li>
            <button className="menu-button logout-button">
              <LogoutIcon className="menu-icon" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
