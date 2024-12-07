import { Chart } from "chart.js";

export function renderWorkoutCountGraph(workoutsByMonth, parent) {
  const graphContainer = document.createElement("div");
  graphContainer.classList.add("sub-container");

  graphContainer.innerHTML =
    '<canvas id="workoutsByMonthChart" style="max-width: 600px; height: 400px;"></canvas>';
  parent.appendChild(graphContainer);

  const labels = Object.keys(workoutsByMonth);
  const data = Object.values(workoutsByMonth);

  new Chart(document.getElementById("workoutsByMonthChart").getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Workouts in the Last 6 Months",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 31,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: { display: true },
      },
    },
  });
}
