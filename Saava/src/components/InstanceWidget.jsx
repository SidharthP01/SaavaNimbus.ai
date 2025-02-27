// import { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/instancewidget.css";

// const InstanceWidget = ({ setSelectedInstance }) => {
//   const [instanceIds, setInstanceIds] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:5000/api/data") // Adjust API URL if needed
//       .then((response) => {
//         const ids = response.data.map((item) => item.InstanceId);
//         setInstanceIds(ids);

//         // Set the first instance as default selection
//         if (ids.length > 0) {
//           setSelectedInstance(ids[0]);
//         }
//       })
//       .catch((error) => console.error("Error fetching instance IDs:", error));
//   }, []);

//   return (
//     <div className="widget-box">
//       <h3>Instance IDs</h3>
//       <div className="scroll-box">
//         {instanceIds.length > 0 ? (
//           instanceIds.map((id, index) => (
//             <button
//               key={index}
//               className="instance-button"
//               onClick={() => {
//                 console.log("Instance Selected:", id); // Debugging
//                 setSelectedInstance(id);
//               }}
//             >
//               {id}
//             </button>
//           ))
//         ) : (
//           <p>No data available</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InstanceWidget;


import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/instancewidget.css";

const InstanceWidget = ({ setSelectedInstance }) => {
  const [instanceIds, setInstanceIds] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/data")
      .then((response) => {
        const ids = response.data.map((item) => item.InstanceId);
        setInstanceIds(ids);
        if (ids.length > 0) {
          setSelectedInstance(ids[0]);
        }
      })
      .catch((error) => console.error("Error fetching instance IDs:", error));
  }, [setSelectedInstance]);

  return (
    <div className="widget-box">
      <h3>Instance IDs</h3>
      <div className="scroll-box">
        {instanceIds.map((id) => (
          <button
            key={id}
            className="instance-button"
            onClick={() => setSelectedInstance(id)}
          >
            {id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InstanceWidget;