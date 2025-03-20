// // src/components/InsightsDisplay.js
// import React, { useState } from "react";
// import axios from "axios";
// import "../styles/insights.css";

// const InsightsDisplay = () => {
//   const [insights, setInsights] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchInsights = async () => {
//     setLoading(true);
//     setError(null);
//     setInsights(""); // Clear previous insights

//     try {
//       const response = await axios.get("http://localhost:5000/api/insights");
//       typeInsights(response.data.insights); // Simulate typing effect
//     } catch (err) {
//       setError("Failed to fetch insights.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const typeInsights = (text) => {
//     let index = 0;
//     const interval = setInterval(() => {
//       setInsights((prev) => prev + text[index]);
//       index++;
//       if (index === text.length) clearInterval(interval);
//     }, 20); // Adjust typing speed
//   };

//   return (
//     <div className="insights-container">
//       <button
//         className="insights-btn"
//         onClick={fetchInsights}
//         disabled={loading}
//       >
//         {loading ? "Generating Insights..." : "Generate Insights"}
//       </button>

//       {error && <p className="error">{error}</p>}

//       <div className="insights-box">
//         {loading ? (
//           <p>Thinking...</p>
//         ) : (
//           <p>{insights || "Click 'Generate Insights' to view."}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InsightsDisplay;

// src/components/InsightsDisplay.js
// InsightsContainer.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/insights.css";

const InsightsDisplay = () => {
  const [insights, setInsights] = useState("");
  const [totalCost, setTotalCost] = useState("--");
  const [loading, setLoading] = useState(false);
  const [costLoading, setCostLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCostData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cost-summary");
        const ec2Cost = response.data.find(item => item.service === "EC2 - Other");
        setTotalCost(ec2Cost ? `$${ec2Cost.total_cost}` : "$--");
      } catch (err) {
        console.error("Error fetching cost data:", err);
      } finally {
        setCostLoading(false);
      }
    };

    fetchCostData();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    setInsights("");

    try {
      const response = await axios.get("http://localhost:5000/api/insights");
      typeInsights(response.data.insights);
    } catch (err) {
      setError("Failed to fetch insights.");
    } finally {
      setLoading(false);
    }
  };

  const typeInsights = (text) => {
    let index = 0;
    setInsights("");
    const interval = setInterval(() => {
      setInsights((prev) => prev + text[index]);
      index++;
      if (index === text.length) clearInterval(interval);
    }, 20);
  };

  return (
    <div className="insights-container">
      <div className="cost-display">
        <div className="cost-label">Current Total Costs:</div>
        <div className="cost-value">
          {costLoading ? "Loading..." : totalCost}
        </div>
      </div>

      <button
        className="insights-btn"
        onClick={fetchInsights}
        disabled={loading}
      >
        {loading ? "Generating Insights..." : "Generate Insights"}
      </button>

      {error && <p className="error">{error}</p>}

      <div className="insights-box fixed-size">
        {loading ? (
          <p>Analyzing cloud metrics...</p>
        ) : (
          <p>{insights || "Click 'Generate Insights' to view optimization recommendations"}</p>
        )}
      </div>
    </div>
  );
};

export default InsightsDisplay;
