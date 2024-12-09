export function renderStatsContainer(icon, tag, value, parent) {
  const statContainer = document.createElement("div");
  statContainer.classList.add("sub-container");
  statContainer.classList.add("stat-container");

  const iconContainer = document.createElement("div");
  iconContainer.innerHTML = `<span class="material-symbols-outlined">
    ${icon}
    </span>`;
  const valueContainer = document.createElement("div");
  valueContainer.classList.add("value");
  valueContainer.textContent = value;

  const tagContainer = document.createElement("div");
  tagContainer.classList.add("tag");
  tagContainer.textContent = tag;

  statContainer.appendChild(iconContainer);
  statContainer.appendChild(valueContainer);
  statContainer.appendChild(tagContainer);

  parent.appendChild(statContainer);
}

export function renderStatsCanvasContainer(icon, tag, value, maxValue, parent) {
  const statContainer = document.createElement("div");
  statContainer.classList.add("sub-container", "stat-container");

  const iconContainer = document.createElement("div");
  iconContainer.innerHTML = `<span class="material-symbols-outlined">${icon}</span>`;

  // Create a canvas element for the chart
  const canvas = document.createElement("canvas");
  // canvas.min-width = 100;
  // canvas.min-height = 100;

  // Create a container to hold the chart and center the value label
  const chartContainer = document.createElement("div");
  chartContainer.classList.add("value");
  chartContainer.style.position = "relative";
  chartContainer.style.width = "70%";
  chartContainer.style.height = "70%";

  chartContainer.appendChild(canvas);

  // Create a div to display the value in the center of the chart
  const valueLabel = document.createElement("div");
  valueLabel.style.position = "absolute";
  valueLabel.style.top = "50%";
  valueLabel.style.left = "50%";
  valueLabel.style.transform = "translate(-50%, -50%)";
  valueLabel.style.fontSize = "20px";
  valueLabel.style.fontWeight = "bold";
  valueLabel.textContent = value;

  chartContainer.appendChild(valueLabel);

  // Map the value to a color from green to red
  const color = getColorFromValue(value, maxValue);

  // Initialize the Chart.js doughnut chart
  new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [value, maxValue - value],
          backgroundColor: [color, "#e0e0e0"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "75%",
      //rotation: -90,
      //circumference: 180,
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
      },
    },
  });

  const tagContainer = document.createElement("div");
  tagContainer.classList.add("tag");
  tagContainer.textContent = tag;

  statContainer.appendChild(iconContainer);
  statContainer.appendChild(chartContainer);
  statContainer.appendChild(tagContainer);

  parent.appendChild(statContainer);
}

function getColorFromValue(value, maxValue) {
  const percent = value / maxValue;
  const g = Math.round(255 * (1 - percent));
  const r = Math.round(255 * percent);
  const b = 0;
  return `rgb(${r},${g},${b})`;
}
