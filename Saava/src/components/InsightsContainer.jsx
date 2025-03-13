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
import React, { useState } from "react";
import axios from "axios";
import "../styles/insights.css";

const InsightsDisplay = () => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    setInsights(""); // Clear previous insights before fetching new ones

    try {
      const response = await axios.get("http://localhost:5000/api/insights");

      typeInsights(response.data.insights); // Simulate typing effect
    } catch (err) {
      setError("Failed to fetch insights.");
    } finally {
      setLoading(false);
    }
  };

  const typeInsights = (text) => {
    let index = 0;
    setInsights(""); // Clear displayed text before typing new insights
    const interval = setInterval(() => {
      setInsights((prev) => prev + text[index]);
      index++;
      if (index === text.length) clearInterval(interval);
    }, 20); // Adjust typing speed
  };

  return (
    <div className="insights-container">
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
          <p>Thinking...</p>
        ) : (
          <p>{insights || "Click 'Generate Insights' to view."}</p>
        )}
      </div>
    </div>
  );
};

export default InsightsDisplay;
