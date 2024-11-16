// ../src/modules/renderWorkouts.mjs

import { formatDate } from "./utils.mjs";
import { renderViewModal } from "./viewModal.mjs";
import { renderEditModal } from "./editModal.mjs";
import { deleteWorkout } from "./deleteWorkout.mjs";

export function renderWorkoutHistory({ currentUser }) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const workouts = users[currentUser].workouts || [];

  const historyContainer = document.getElementById("history-container");
  historyContainer.innerHTML = "";

  if (workouts.length === 0) {
    historyContainer.textContent = "No past workouts found.";
    return;
  }

  // Create table
  const table = document.createElement("table");
  table.classList.add("workout-table");

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Date", "Workout Name", ""];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  workouts.forEach((workout, index) => {
    const row = document.createElement("tr");
    row.classList.add("workout-item");

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(workout.date);

    const nameCell = document.createElement("td");
    nameCell.textContent = workout.name;

    const actionCell = document.createElement("td");
    actionCell.classList.add("workout-actions");

    // Create action buttons
    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.classList.add("btn-secondary");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn-secondary");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn-secondary");

    // Append buttons to action cell
    actionCell.appendChild(viewButton);
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(dateCell);
    row.appendChild(nameCell);
    row.appendChild(actionCell);

    tbody.appendChild(row);

    // Event listeners for buttons
    viewButton.addEventListener("click", () => {
      renderViewModal(workout);
    });

    editButton.addEventListener("click", () => {
      renderEditModal({ workout, index, users, currentUser, workouts });
    });

    deleteButton.addEventListener("click", () => {
      deleteWorkout({ index, users, currentUser, workouts });
    });
  });

  table.appendChild(tbody);
  historyContainer.appendChild(table);
}
