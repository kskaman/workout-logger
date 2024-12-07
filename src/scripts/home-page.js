// ../src/scripts/last-workout-view.js

import { renderLastWorkout } from "../modules/renderLastWorkout.mjs";
import { renderEditModal } from "../modules/editModal.mjs";
import {
  renderStatsContainer,
  renderStatsCanvasContainer,
} from "../modules/renderStats.mjs";
import { renderWorkoutCountGraph } from "../modules/renderGraphs.mjs";

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

  function renderStats() {
    const statsContainer = document.createElement("div");
    statsContainer.classList.add("stats-container");

    const stats = users[currentUser].stats;

    // Workout in Last 30 days
    renderStatsCanvasContainer(
      "date_range",
      "Workouts in Last 30 Days",
      stats.workoutsInLast30Days,
      30,
      statsContainer
    );

    // Maximum Reps Done
    renderStatsContainer(
      "repeat",
      `Maximum Reps - ${stats.maxRepsExercise}`,
      stats.maxReps.statsContainer,
      statsContainer
    );

    // Heaviest Weight Lifted
    if (stats.heaviestWeightExercise !== "") {
      renderStatsContainer(
        "fitness_center",
        `Heaviest Weight Lifted(lbs) - ${stats.heaviestWeightExercise}`,
        stats.heaviestWeight,
        statsContainer
      );
    }

    // Current Streak
    renderStatsCanvasContainer(
      "whatshot",
      "Current Streak",
      stats.currentStreak,
      365,
      statsContainer
    );

    // Maximum Streak
    renderStatsCanvasContainer(
      "whatshot",
      "Max Streak",
      stats.maxStreak,
      365,
      statsContainer
    );

    mainContainer.appendChild(statsContainer);

    renderWorkoutCountGraph(stats.workoutsByMonth, mainContainer);
  }
});
