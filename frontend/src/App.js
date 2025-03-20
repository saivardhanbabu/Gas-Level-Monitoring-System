import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function App() {
  const [sensorData, setSensorData] = useState(null);
  const [background, setBackground] = useState("#f8f9fa");
  const [ppmHistory, setPpmHistory] = useState([]);
  const ESP32_IP = "https://wrapped-nonprofit-partner-bizarre.trycloudflare.com";

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
        setPpmHistory((prev) => [...prev.slice(-9), data.LPG_PPM]);
      } catch (error) {
        console.error("❌ Error fetching sensor data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sensorData && sensorData.Air_Quality !== undefined) {
      changeBackgroundColor(sensorData.Air_Quality);
    }
  }, [sensorData]);

  const changeBackgroundColor = (quality) => {
    let newColor;
    switch (quality) {
      case "Clean":
        newColor = "#2ecc71";
        break;
      case "Moderate":
        newColor = "#f39c12";
        break;
      case "Toxic":
        newColor = "#e74c3c";
        break;
      default:
        newColor = "#f8f9fa";
    }
    setBackground(newColor);
  };

  const getPPMColor = (ppm) => {
    if (ppm <= 100) return "#2ecc71";
    if (ppm <= 500) return "#f39c12";
    return "#e74c3c";
  };

  const chartData = {
    labels: ppmHistory.map((_, i) => `T-${ppmHistory.length - i}`),
    datasets: [
      {
        label: "LPG PPM Levels",
        data: ppmHistory,
        borderColor: "#e74c3c",
        backgroundColor: "rgba(231, 76, 60, 0.2)",
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ["Avg PPM"],
    datasets: [
      {
        label: "Average PPM (Last 10 Readings)",
        data: [ppmHistory.reduce((a, b) => a + b, 0) / ppmHistory.length || 0],
        backgroundColor: "#f39c12",
      },
    ],
  };

  return (
    <div style={{ ...styles.container, backgroundColor: background }}>
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
            <strong>LPG Concentration:</strong>
            <span style={{ ...styles.ppmBadge, backgroundColor: getPPMColor(sensorData.LPG_PPM) }}>
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

      <div style={styles.chartContainer}>
        <h2>Last 10 Gas Level Readings</h2>
        <Line data={chartData} options={{ responsive: true }} />
      </div>
      <div style={styles.chartContainer}>
        <h2>Average Gas Level</h2>
        <Bar data={barData} options={{ responsive: true }} />
      </div>
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
  ppmBadge: {
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
    transition: "background-color 0.5s ease-in-out",
  },
  chartContainer: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default App;
