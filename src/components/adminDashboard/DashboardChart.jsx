import React from "react";
import { Chart as ChartJS, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const DashboardChart = () => {
  // Sample data
  const data = {
    labels: ["January", "February", "March", "April", "May"], // X-Axis labels
    datasets: [
      {
        type: "bar", // Bar chart for Water Quality Tests
        label: "Water Quality Tests",
        data: [120, 150, 200, 180, 220], // Y-Axis data for tests
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue color for bars
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        yAxisID: "y1", // Use the left Y-axis
      },
      {
        type: "line", // Line chart for Revenue
        label: "Revenue ($)",
        data: [5000, 6200, 7500, 6800, 8000], // Y-Axis data for revenue
        borderColor: "rgba(255, 99, 132, 1)", // Red color for the line
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        yAxisID: "y2", // Use the right Y-axis
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Legend position
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
    scales: {
      y1: {
        type: "linear",
        display: true,
        position: "left", // Left Y-axis for Water Quality Tests
        title: {
          display: true,
          text: "Water Quality Tests",
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right", // Right Y-axis for Revenue
        title: {
          display: true,
          text: "Revenue ($)",
        },
        grid: {
          drawOnChartArea: false, // Prevent grid lines for the right Y-axis
        },
      },
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  };

  return (
    <div style={{ width: "800px", margin: "0 auto" }}>
      <h2>Monthly Sales and Water Quality Tests</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardChart;