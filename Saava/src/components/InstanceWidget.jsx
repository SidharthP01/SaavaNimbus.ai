import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/instancewidget.css";

const InstanceWidget = ({ setSelectedInstance }) => {
  const [instanceIds, setInstanceIds] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/data")
      .then((response) => {
        const ids = response.data.map((item, index) => ({
          fullId: item.InstanceId,
          displayName: `ins${index + 1}`,
        }));
        setInstanceIds(ids);
        if (ids.length > 0) {
          setSelectedInstance(ids[0].fullId);
        }
      })
      .catch((error) => console.error("Error fetching instance IDs:", error));
  }, [setSelectedInstance]);

  return (
    <div className="widget-box">
      <h3>Instance IDs</h3>
      <div className="scroll-box">
        {instanceIds.map(({ fullId, displayName }) => (
          <button
            key={fullId}
            className="instance-button"
            onClick={() => setSelectedInstance(fullId)}
          >
            {displayName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InstanceWidget;
