import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/instancewidget.css"; // Ensure this file is linked

const Widget = () => {
  const [instanceIds, setInstanceIds] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/data") // Adjust API URL if needed
      .then(response => {
        const ids = response.data.map(item => item.InstanceId);
        setInstanceIds(ids);
      })
      .catch(error => console.error("Error fetching instance IDs:", error));
  }, []);

  return (
    <div className="widget-box">
      <h3>Instance IDs</h3>
      <div className="scroll-box">
        {instanceIds.length > 0 ? (
          instanceIds.map((id, index) => <p key={index} className="instance-item">{id}</p>)
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default Widget;
