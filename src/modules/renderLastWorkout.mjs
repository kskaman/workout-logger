// ../src/modules/renderLastWorkout.mjs

import { renderViewModal } from "./viewModal.mjs";
import { formatDate } from "./utils.mjs";

function renderLastWorkout(workout) {
  const lastWorkoutContainer = document.getElementById("last-workout");

  lastWorkoutContainer.innerHTML = "";

  if (workout.length === 0) {
    showStats = false;
    lastWorkoutContainer.textContent = "No past workouts found.";
    return;
  }

  // Create Heading
  const heading = document.createElement("h3");
  heading.textContent = "Last Workout";
  lastWorkoutContainer.appendChild(heading);

  // Create last workout table
  const table = document.createElement("table");
  table.classList.add("workout-table");

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Date", "Workout Name"];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");
  const row = document.createElement("tr");
  row.classList.add("workout-item");

  const dataCell = document.createElement("td");
  dataCell.textContent = formatDate(workout.date);

  const nameCell = document.createElement("td");
  nameCell.textContent = workout.name;

  row.appendChild(dataCell);
  row.appendChild(nameCell);

  tbody.appendChild(row);

  table.appendChild(tbody);

  lastWorkoutContainer.appendChild(table);

  // add view functionality ot row
  row.addEventListener("click", () => {
    renderViewModal(workout);
  });
}

export default renderLastWorkout;
