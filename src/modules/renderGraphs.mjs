import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

let weightChartInstance;
let workoutChartInstance;

function getChartColors() {
  const theme = sessionStorage.getItem("theme");

  let lineColor = "rgba(75, 192, 192, 1)";
  let backgroundColor = "rgba(75, 192, 192, 0.2)";
  let axisColor = "rgba(0, 0, 0, 0.8)";
  let gridColor = "rgba(200, 200, 200, 0.2)";

  let tooltipBackground = "#212529";
  let tooltipColor = "#f8f9fa";

  if (theme === "Dark Mode") {
    backgroundColor = "rgba(255, 255, 255, 0.5)";
    axisColor = "rgba(255, 255, 255, 0.8)";
    gridColor = "rgba(255, 255, 255, 0.2)";
    tooltipBackground = "#e0e0e0";
    tooltipColor = "#121212";
  }

  return {
    lineColor,
    backgroundColor,
    axisColor,
    gridColor,
    tooltipBackground,
    tooltipColor,
  };
}

export function renderWorkoutCountGraph(workoutsByMonth, parent) {
  const {
    lineColor,
    backgroundColor,
    axisColor,
    gridColor,
    tooltipBackground,
    tooltipColor,
  } = getChartColors();

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
            backgroundColor: backgroundColor,
            borderColor: lineColor,
            borderWidth: 1,
            grid: {
              color: "red",
            },
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
              color: gridColor,
            },
            ticks: {
              color: axisColor,
            },
            border: {
              color: axisColor,
            },
          },
          y: {
            beginAtZero: true,
            max: 31,
            ticks: {
              stepSize: 5,
              color: axisColor,
            },
            grid: {
              display: false,
              borderColor: axisColor,
            },
            border: {
              color: axisColor,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            color: gridColor,
          },

          tooltip: {
            backgroundColor: tooltipBackground,
            titleColor: tooltipColor,
            bodyColor: tooltipColor,
          },
        },
      },
    }
  );
}

export function renderWeightChart(weightHistory, chartContainer) {
  const {
    lineColor,
    backgroundColor,
    axisColor,
    gridColor,
    tooltipBackground,
    tooltipColor,
  } = getChartColors();

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
  chartContainer.style.marginBottom = "1em";
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
            borderColor: axisColor,
          },
          border: {
            color: axisColor,
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
            borderColor: axisColor,
          },
          border: {
            color: axisColor,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: axisColor,
          },
        },
        tooltip: {
          backgroundColor: tooltipBackground,
          titleColor: tooltipColor,
          bodyColor: tooltipColor,
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
