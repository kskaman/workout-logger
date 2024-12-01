// ../src/scripts/last-workout-view.js

import { renderViewModal } from "../modules/viewModal.mjs";
import { formatDate } from "../modules/utils.mjs";
import { renderEditModal } from "../modules/editModal.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = sessionStorage.getItem("currentUser");

  const users = JSON.parse(localStorage.getItem("users")) || {};

  let lastWorkout = users[currentUser].workouts[0] || [];

  const mainContainer = document.getElementById("main-container");
  const logWorkoutButton = document.createElement("button");
  logWorkoutButton.id = "log-workout-button";
  logWorkoutButton.classList.add("log-workout-button");
  logWorkoutButton.innerHTML = `<span class="plus-icon">+</span>Log Workout`;

  if (lastWorkout.length === 0) {
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `
      <div style="margin: auto">
      <h1 style="max-width: 600px; height: auto; text-align: center">
        Your fitness journey starts with one workout—log it now!
      </h1>
      </div>
    `;

    const h1Element = mainContainer.querySelector("h1");
    h1Element.insertAdjacentElement("afterend", logWorkoutButton);

    logWorkoutButton.classList.add("center");
  } else {
    mainContainer.innerHTML = "";

    mainContainer.innerHTML = `
      <header>
        <h1>Welcome</h1>
      </header>
    `;

    renderLastWorkout(lastWorkout);
    renderStats();
    mainContainer.appendChild(logWorkoutButton);
  }

  logWorkoutButton.addEventListener("click", () => {
    renderEditModal();
  });

  function renderLastWorkout(workout) {
    const lastWorkoutContainer = document.createElement("section");
    lastWorkoutContainer.id = "history-container";
    lastWorkoutContainer.classList.add("sub-container");

    lastWorkoutContainer.innerHTML = "";

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

    mainContainer.appendChild(lastWorkoutContainer);
  }

  function renderStats() {
    const statsContainer = document.createElement("section");
    statsContainer.classList.add("stats-container");

    const stats = users[currentUser].stats;

    // Workout in Last 30 days
    renderStatsContainer(
      "date_range",
      "Workouts in Last 30 Days",
      stats.workoutsInLast30Days
    );

    // Maximum Reps Done
    renderStatsContainer(
      "repeat",
      `Maximum Reps - ${stats.maxRepsExercise}`,
      stats.maxReps
    );

    // Heaviest Weight Lifted
    if (stats.heaviestWeightExercise !== "") {
      renderStatsContainer(
        "fitness_center",
        `Heaviest Weight Lifted(lbs) - ${stats.heaviestWeightExercise}`,
        stats.heaviestWeight
      );
    }

    // Current Streak
    renderStatsContainer(
      "whatshot",
      "Current Streak (days)",
      stats.currentStreak
    );

    // Maximum Streak
    renderStatsContainer("whatshot", "Max Streak (days)", stats.maxStreak);

    function renderStatsContainer(icon, tag, value) {
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

      statsContainer.appendChild(statContainer);
    }

    mainContainer.appendChild(statsContainer);
  }
});
