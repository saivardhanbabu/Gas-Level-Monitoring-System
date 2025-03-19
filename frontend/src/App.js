import React, { useState, useEffect } from "react";

function App() {
  const [sensorData, setSensorData] = useState(null);
  const [background, setBackground] = useState("#f8f9fa"); // Default background
  const ESP32_IP = "https://protective-currency-female-historic.trycloudflare.com"; // Replace with your ESP32 IP

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ESP32_IP}/data`, {
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Sensor Data Received:", data);
        setSensorData(data);
      } catch (error) {
        console.error("❌ Error fetching sensor data:", error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Effect to watch for Air_Quality changes and update background color
  useEffect(() => {
    if (sensorData && sensorData.Air_Quality !== undefined) {
      console.log("🔄 Air_Quality Updated:", sensorData.Air_Quality);
      changeBackgroundColor(sensorData.Air_Quality);
    }
  }, [sensorData]); // Runs when sensorData updates

  // Function to change background color based on Air_Quality
  const changeBackgroundColor = (quality) => {
    let newColor;
    switch (quality) {
      case "Clean":
        newColor = "#2ecc71"; // Green (Clean Air)
        break;
      case "Moderate":
        newColor = "#f39c12"; // Orange (Moderate)
        break;
      case "Toxic":
        newColor = "#e74c3c"; // Red (Toxic)
        break;
      default:
        newColor = "#f8f9fa"; // Default Color
    }
    console.log("🎨 Setting Background Color:", newColor);
    setBackground(newColor);
  };

  // Function to get dynamic PPM color
  const getPPMColor = (ppm) => {
    if (ppm <= 100) return "#2ecc71"; // Green for low concentration
    if (ppm <= 500) return "#f39c12"; // Orange for moderate concentration
    return "#e74c3c"; // Red for high concentration
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: background,
        transition: "background-color 1s ease-in-out",
      }}
    >
      <h1>MQ-6 Gas Sensor Readings</h1>
      {sensorData ? (
        <div style={styles.card}>
          <p>
            <strong>Resistance (Rs):</strong> {sensorData.Rs.toFixed(2)} kΩ
          </p>
          <p>
            <strong>Ratio (Rs/Ro):</strong> {sensorData.Ratio.toFixed(2)}
          </p>
          <p>
            <strong>LPG Concentration:</strong>{" "}
            <span
              style={{
                color: "#fff",
                backgroundColor: getPPMColor(sensorData.LPG_PPM),
                padding: "5px 10px",
                borderRadius: "5px",
                fontWeight: "bold",
                transition: "background-color 0.5s ease-in-out",
              }}
            >
              {sensorData.LPG_PPM} ppm
            </span>
          </p>
          <p>
            <strong>Air Quality:</strong> {sensorData.Air_Quality}
          </p>
          <p>
            <strong>Time to Toxic Level:</strong> {sensorData.Time_To_Toxic.toFixed(2)} minutes
          </p>
        </div>
      ) : (
        <p>Loading sensor data...</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    minHeight: "100vh",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    display: "inline-block",
    textAlign: "left",
  },
};

export default App;


// import React, { useState, useEffect } from "react";

// function App() {
//   const [sensorData, setSensorData] = useState(null);
//   const ESP32_IP = "10.28.167.178"; // Replace with your ESP32 IP

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://${ESP32_IP}/data`, {
//           mode: "cors",
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP Error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Sensor Data Received:", data);
//         setSensorData(data);
//       } catch (error) {
//         console.error("Error fetching sensor data:", error);
//       }
//     };

//     fetchData();
//     const interval = setInterval(fetchData, 5000);
//     return () => clearInterval(interval);
//   }, [ESP32_IP]);

//   // Function to determine background color based on air quality
//   const getBackgroundColor = (quality) => {
//     if (quality === 0) return "#2ecc71"; // Green (Clean)
//     if (quality === 1) return "#f39c12"; // Yellow/Orange (Moderate)
//     if (quality === 2) return "#e74c3c"; // Red (Toxic)
//     return "#232526"; // Default Dark Background (Fix for white screen)
//   };

//   return (
//     <div style={{ ...styles.container, backgroundColor: sensorData ? getBackgroundColor(sensorData.Air_Quality) : "#232526" }}>
//       <h1 style={styles.heading}>MQ-6 Gas Sensor Readings</h1>
//       {sensorData ? (
//         <div
//           style={{
//             ...styles.card,
//             borderColor: sensorData.Air_Quality === 2 ? "red" : "transparent",
//           }}
//         >
//           <p><strong>Resistance (Rs):</strong> {sensorData.Rs.toFixed(2)} kΩ</p>
//           <p><strong>Ratio (Rs/Ro):</strong> {sensorData.Ratio.toFixed(2)}</p>
//           <p><strong>LPG Concentration:</strong> {sensorData.LPG_PPM} ppm</p>
//           <p><strong>Air Quality:</strong> {sensorData.Air_Quality === 0 ? "Clean" : sensorData.Air_Quality === 1 ? "Moderate" : "Toxic"}</p>
//           <p>
//             <strong>Time to Toxic Level:</strong>
//             {sensorData.Air_Quality === 0 ? " You are Safe" : `${sensorData.Time_To_Toxic.toFixed(2)} minutes`}
//           </p>
//           {sensorData.Air_Quality === 2 && <div style={styles.flame}></div>}
//         </div>
//       ) : (
//         <p style={styles.loading}>Loading sensor data...</p>
//       )}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     textAlign: "center",
//     fontFamily: "Arial, sans-serif",
//     color: "white",
//     padding: "20px",
//     minHeight: "100vh",
//     transition: "background-color 0.5s ease-in-out",
//   },
//   heading: {
//     fontSize: "2rem",
//     marginBottom: "20px",
//     textShadow: "2px 2px 10px rgba(255, 255, 255, 0.5)",
//   },
//   card: {
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//     padding: "20px",
//     borderRadius: "10px",
//     border: "3px solid transparent",
//     boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.3)",
//     display: "inline-block",
//     textAlign: "left",
//     transition: "all 0.3s ease-in-out",
//     position: "relative",
//   },
//   flame: {
//     width: "50px",
//     height: "70px",
//     background: "radial-gradient(circle, orange 20%, red 70%, transparent)",
//     position: "absolute",
//     bottom: "-30px",
//     left: "50%",
//     transform: "translateX(-50%)",
//     borderRadius: "50%",
//     animation: "flicker 0.5s infinite alternate",
//   },
//   loading: {
//     fontSize: "1.2rem",
//     fontStyle: "italic",
//   },
// };

// export default App;
