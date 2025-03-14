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
import "../styles/Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">SaavaNimbus.ai</span>
      </div>
      <hr />
      <div className="center">
        <ul className="menu">
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <li>
            <PersonIcon className="icon" />
            <span>Users</span>
          </li>
          <li>
            <AccountCircleIcon className="icon" />
            <span>Profile</span>
          </li>
          <li>
            <LogoutIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
