import {
  getWeightChartInstance,
  getWorkoutChartInstance,
} from "../modules/renderGraphs.mjs";

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

    updateChartsTheme();
  });

  // Load saved theme
  const savedTheme = sessionStorage.getItem("theme");
  if (savedTheme === "Dark Mode") {
    document.body.classList.add("dark-theme");
    themeToggle.classList.add("active");
    themeLabel.textContent = "Dark Mode";
  }
}

function updateChartsTheme() {
  const styles = getComputedStyle(document.documentElement);
  const lineColor = styles.getPropertyValue("--chart-line-color").trim();
  const backgroundColor = styles
    .getPropertyValue("--chart-background-color")
    .trim();
  const axisColor = styles.getPropertyValue("--chart-axis-color").trim();
  const gridColor = styles.getPropertyValue("--chart-grid-color").trim();

  const workoutChart = getWorkoutChartInstance();
  if (workoutChart) {
    const dataset = workoutChart.data.datasets[0];
    dataset.backgroundColor = backgroundColor;
    dataset.borderColor = lineColor;
    workoutChart.options.scales.x.ticks.color = axisColor;
    workoutChart.options.scales.y.ticks.color = axisColor;
    workoutChart.options.plugins.legend.labels.color = axisColor;

    workoutChart.update();
  }

  const weightChart = getWeightChartInstance();
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
}
