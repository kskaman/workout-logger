// ../src/modules/renderWorkouts.mjs

import { formatDate } from "./utils.mjs";
import { renderViewModal } from "./viewModal.mjs";
import { renderEditModal } from "./editModal.mjs";
import { updateUserExercises, updateUserStats } from "./stats.mjs"; // Import missing functions

export function renderWorkoutHistory(workouts = null) {
  if (!workouts) {
    const currentUser = sessionStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    workouts = users[currentUser].workouts || [];
  }
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

    const editButton = document.createElement("button");

    editButton.innerHTML = `
      <span class="material-symbols-outlined">edit</span>
    `;
    editButton.classList.add("action-btn");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `
      <span class="material-symbols-outlined">delete</span>
    `;
    deleteButton.classList.add("action-btn");

    // Append buttons to action cell
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
    // Append cells to row
    row.appendChild(dateCell);
    row.appendChild(nameCell);
    row.appendChild(actionCell);

    row.addEventListener("click", () => renderViewModal(workout));

    tbody.appendChild(row);

    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      renderEditModal(workout, index);
    });

    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteWorkout(index);
    });
  });

  table.appendChild(tbody);
  historyContainer.appendChild(table);

  function deleteWorkout(index) {
    if (confirm("Are you sure you want to delete this workout?")) {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      const currentUser = sessionStorage.getItem("currentUser");
      const userWorkouts = users[currentUser].workouts || [];

      // Remove the workout
      userWorkouts.splice(index, 1);
      users[currentUser].workouts = userWorkouts;

      // Update user's exercises list
      updateUserExercises(users[currentUser]);

      // Update user stats
      updateUserStats(users[currentUser]);

      // Save changes to localStorage
      localStorage.setItem("users", JSON.stringify(users));

      // Re-render the workout history
      renderWorkoutHistory(userWorkouts);
    }
  }
}
