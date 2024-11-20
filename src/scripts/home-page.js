// ../src/scripts/last-workout-view.js

import { renderViewModal } from "../modules/viewModal.mjs";
import { formatDate } from "../modules/utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = sessionStorage.getItem("currentUser");

  const users = JSON.parse(localStorage.getItem("users")) || {};

  let lastWorkout = users[currentUser].workouts[0] || [];

  const mainContainer = document.getElementById("main-container");

  if (lastWorkout.length === 0) {
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `
      <h1 style="margin: auto; max-width: 600px; text-align: center">
        You don't have not logged any workout!
      </h1>
    `;
  } else {
    mainContainer.innerHTML = "";

    mainContainer.innerHTML = `
      <header>
        <h1>Welcome</h1>
      </header>
    `;

    renderLastWorkout(lastWorkout);
    renderStats();
  }

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
      "Workouts in Last 30 Days",
      stats.workoutsInLast30Days
    );

    // Maximum Reps Done
    renderStatsContainer(
      `Maximum Reps - ${stats.maxRepsExercise}`,
      stats.maxReps
    );

    // Heaviest Weight Lifted
    if (stats.heaviestWeightExercise !== "") {
      renderStatsContainer(
        `Heaviest Weight Lifted(lbs) - ${stats.heaviestWeightExercise}`,
        stats.heaviestWeight
      );
    }

    // Current Streak
    renderStatsContainer("Current Streak (days)", stats.currentStreak);

    // Maximum Streak
    renderStatsContainer("Max Streak (days)", stats.maxStreak);

    function renderStatsContainer(tag, value) {
      const statContainer = document.createElement("div");
      statContainer.classList.add("sub-container");
      statContainer.classList.add("stat-container");

      const valueContainer = document.createElement("div");
      valueContainer.textContent = value;

      const tagContainer = document.createElement("div");
      tagContainer.textContent = tag;

      statContainer.appendChild(valueContainer);
      statContainer.appendChild(tagContainer);

      statsContainer.appendChild(statContainer);
    }

    mainContainer.appendChild(statsContainer);
  }
});
