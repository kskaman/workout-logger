// ../src/modules/renderWorkouts.mjs

import { formatDate } from "./utils.mjs";
import { renderViewModal } from "./viewModal.mjs";
import { renderEditModal } from "./editModal.mjs";

export function renderWorkoutHistory(workouts) {
  const historyContainer = document.getElementById("history-container");
  historyContainer.innerHTML = "";

  if (workouts.length === 0) {
    historyContainer.textContent = "No workouts found.";
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
      renderEditModal(workout, index);
    });

    deleteButton.addEventListener("click", () => {
      deleteWorkout(index);
    });
  });

  table.appendChild(tbody);
  historyContainer.appendChild(table);

  function deleteWorkout(index) {
    if (confirm("Are you sure you want to delete this workout?")) {
      workouts.splice(index, 1);
      users[currentUser].workouts = workouts;

      // Update user's exercises list
      updateUserExercises(users[currentUser]);

      // Update user stats
      updateUserStats(users[currentUser]);

      localStorage.setItem("users", JSON.stringify(users));
      alert("Workout deleted successfully.");
      // Re-render the workout history
      renderWorkoutHistory(workouts);
    }
  }
}
