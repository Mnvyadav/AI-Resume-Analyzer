import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SkillsChart() {
  const data = {
    labels: [
      "React",
      "JavaScript",
      "Node.js",
      "Cloud",
      "Docker",
    ],
    datasets: [
      {
        label: "Skill Score",
        data: [90, 85, 75, 65, 20],
      },
    ],
  };

  return (
    <div>
      <Bar data={data} />
    </div>
  );
}

export default SkillsChart;