import {
  getWeightChartInstance,
  getWorkoutChartInstance,
} from "../modules/renderGraphs.mjs";
import {
  getCurrentStreakInstance,
  getWorkoutNumInstance,
} from "../modules/renderStats.mjs";

const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.querySelector(".theme-label");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeToggle.classList.toggle("active");
    const theme = document.body.classList.contains("dark-theme")
      ? "Dark Mode"
      : "Light Mode";
    themeLabel.textContent = theme;
    sessionStorage.setItem("theme", theme);

    updateChartsTheme(theme);
  });

  // Load saved theme
  const savedTheme = sessionStorage.getItem("theme");
  if (savedTheme === "Dark Mode") {
    document.body.classList.add("dark-theme");
    themeToggle.classList.add("active");
    themeLabel.textContent = "Dark Mode";
  }
}

function updateChartsTheme(theme) {
  let lineColor = "rgba(75, 192, 192, 1)";
  let backgroundColor = "rgba(75, 192, 192, 0.2)";
  let axisColor = "rgba(0, 0, 0, 0.8)";
  let gridColor = "rgba(200, 200, 200, 0.2)";

  let rColor = "#e0e0e0";

  if (theme === "Dark Mode") {
    backgroundColor = "rgba(255, 255, 255, 0.5)";
    axisColor = "rgba(255, 255, 255, 0.8)";
    gridColor = "rgba(255, 255, 255, 0.2)";
    rColor = "rgba(255, 255, 255, 0.2)";
  }

  const workoutChart = getWorkoutChartInstance();
  console.log(workoutChart.options.scales.x);
  if (workoutChart) {
    const dataset = workoutChart.data.datasets[0];
    dataset.backgroundColor = backgroundColor;
    dataset.borderColor = lineColor;
    workoutChart.options.scales.x.ticks.color = axisColor;
    workoutChart.options.scales.y.ticks.color = axisColor;
    workoutChart.options.scales.x.grid.color = gridColor;
    workoutChart.options.scales.y.grid.color = gridColor;
    workoutChart.options.plugins.legend.labels.color = axisColor;

    workoutChart.update();
  }

  const weightChart = getWeightChartInstance();
  //console.log(weightChart);
  if (weightChart) {
    const dataset = weightChart.data.datasets[0];
    dataset.borderColor = lineColor;
    dataset.backgroundColor = backgroundColor;
    weightChart.options.scales.x.ticks.color = axisColor;
    weightChart.options.scales.y.ticks.color = axisColor;
    weightChart.options.scales.x.grid.color = gridColor;
    weightChart.options.scales.y.grid.color = gridColor;
    weightChart.options.plugins.legend.labels.color = axisColor;
    weightChart.update();
  }

  const currentStreakChart = getCurrentStreakInstance();
  if (currentStreakChart) {
    currentStreakChart.data.datasets[0].backgroundColor[1] = rColor;
    currentStreakChart.update();
  }

  const workoutNumChart = getWorkoutNumInstance();
  if (workoutNumChart) {
    workoutNumChart.data.datasets[0].backgroundColor[1] = rColor;
    workoutNumChart.update();
  }
}
