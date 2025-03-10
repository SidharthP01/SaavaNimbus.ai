import React, { useState } from "react";
import "../styles/login.css"; // Import the CSS file
import axios from "axios"; // For making API requests
import { useNavigate } from "react-router-dom"; // For navigation after login

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        username,
        password,
      });
      if (response.data.success) {
        setError("Registration successful! Please log in.");
        setIsLogin(true); // Switch to Login form after successful sign-up
      }
    } catch (err) {
      setError("Username already exists or registration failed.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="toggle-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(""); // Clear error when toggling
            }}
          >
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;