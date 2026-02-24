import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function UrgencyGraph({ level }) {
  const scoreMap = { low: 1, medium: 2, high: 3 };
  const score = scoreMap[level] || 0;

  const data = {
    labels: ["Urgency Level"],
    datasets: [
      {
        label: "Severity Score",
        data: [score],
        backgroundColor: "#0ea5e9",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    scales: {
      x: { min: 0, max: 3 },
      y: { beginAtZero: true },
    },
    plugins: { legend: { display: false } },
  };

  return <Bar data={data} options={options} />;
}