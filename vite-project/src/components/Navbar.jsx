import React from "react";
import "../styles/Navbar.css";
const Navbar = () => {
  return (
    <>
      <header className="header">
        <a href="/" className="logo">
          LOGO
        </a>
        <nav className="navbar">
          <a href="/">Login</a>
          <a href="/">Home</a>
          <a href="/">Dashboard</a>
          <a href="/">About</a>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
