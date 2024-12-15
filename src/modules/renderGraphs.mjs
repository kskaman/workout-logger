import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

let weightChartInstance;
let workoutChartInstance;

function getChartColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    lineColor: styles.getPropertyValue("--chart-line-color").trim(),
    backgroundColor: styles.getPropertyValue("--chart-background-color").trim(),
    axisColor: styles.getPropertyValue("--chart-axis-color").trim(),
    gridColor: styles.getPropertyValue("--chart-grid-color").trim(),
  };
}

export function renderWorkoutCountGraph(workoutsByMonth, parent) {
  const workoutGraphContainer = document.createElement("div");
  workoutGraphContainer.classList.add("sub-container");

  workoutGraphContainer.innerHTML =
    '<canvas id="workoutsByMonthChart"></canvas>';
  parent.appendChild(workoutGraphContainer);

  const labels = Object.keys(workoutsByMonth);
  const data = Object.values(workoutsByMonth);

  workoutChartInstance = new Chart(
    document.getElementById("workoutsByMonthChart").getContext("2d"),
    {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Number of Workouts",
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
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: 31,
            ticks: {
              stepSize: 5,
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: { display: true },
        },
      },
    }
  );
}

export function renderWeightChart(weightHistory, chartContainer) {
  const { lineColor, backgroundColor, axisColor, gridColor } = getChartColors();

  const labels = weightHistory.map((entry) => entry.date);
  const dataPoints = weightHistory.map((entry) => entry.weight);
  const dateObjects = weightHistory.map((e) => new Date(e.date));
  const minDate = new Date(Math.min(...dateObjects));
  const maxDate = new Date(Math.max(...dateObjects));

  let xMin, xMax;

  if (weightHistory.length === 1) {
    // For a single point, center it:
    // Add some buffer around the single date (e.g., 7 days before and after)
    const singleDate = minDate;
    const bufferDays = 7;
    xMin = new Date(singleDate);
    xMin.setDate(xMin.getDate() - bufferDays);

    xMax = new Date(singleDate);
    xMax.setDate(xMax.getDate() + bufferDays);
  } else {
    const dateBufferDays = 3;
    xMin = new Date(minDate);
    xMin.setDate(xMin.getDate() - dateBufferDays);

    xMax = new Date(maxDate);
    xMax.setDate(xMax.getDate() + dateBufferDays);
  }

  chartContainer.innerHTML = '<canvas id="weightChart"></canvas>';
  chartContainer.marginBottom = "1em";
  const ctx = document.getElementById("weightChart").getContext("2d");

  weightChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Weight",
          data: dataPoints,
          borderColor: lineColor,
          backgroundColor: backgroundColor,
          borderWidth: 2,
          tension: 0.1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
          min: xMin,
          max: xMax,

          ticks: {
            display: false,
          },
          grid: {
            color: gridColor,
          },
        },
        y: {
          beginAtZero: false,
          ticks: {
            stepSize: 1,
            color: axisColor,
          },
          grid: {
            color: gridColor,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: axisColor,
          },
        },
      },
    },
  });
}

export function getWeightChartInstance() {
  return weightChartInstance;
}

export function getWorkoutChartInstance() {
  return workoutChartInstance;
}
