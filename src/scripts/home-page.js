// ../src/scripts/last-workout-view.js

import { renderLastWorkout } from "../modules/renderLastWorkout.mjs";
import { renderEditModal } from "../modules/editModal.mjs";
import { renderWeightContainer } from "../modules/renderWeight.mjs";
import {
  renderStatsContainer,
  renderStatsCanvasContainer,
} from "../modules/renderStats.mjs";
import {
  renderWeightChart,
  renderWorkoutCountGraph,
} from "../modules/renderGraphs.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = sessionStorage.getItem("currentUser");

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const user = users[currentUser];
  let lastWorkout = user.workouts[0] || [];

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

    renderLastWorkout(lastWorkout, mainContainer);

    const mainContent = document.createElement("div");
    mainContent.id = "main-content";
    mainContainer.appendChild(mainContent);

    const leftColumn = document.createElement("div");
    leftColumn.id = "left-column";
    const rightColumn = document.createElement("div");
    rightColumn.id = "right-column";

    mainContent.appendChild(leftColumn);
    mainContent.appendChild(rightColumn);

    renderWeightContainer(rightColumn);
    if (user.weightHistory) {
      renderWeightChart(user.weightHistory, rightColumn);
    }

    const stats = user.stats;

    const numStats = document.createElement("div");
    numStats.id = "num-stats";
    leftColumn.appendChild(numStats);

    // Maximum Reps Done
    renderStatsContainer(
      "repeat",
      `Maximum Reps - ${stats.maxRepsExercise}`,
      stats.maxReps,
      numStats
    );

    // Heaviest Weight Lifted
    if (stats.heaviestWeightExercise !== "") {
      renderStatsContainer(
        "fitness_center",
        `Heaviest Weight Lifted (lbs) - ${stats.heaviestWeightExercise}`,
        stats.heaviestWeight,
        numStats
      );
    }
    // Workout in Last 30 days
    renderStatsCanvasContainer(
      "date_range",
      "Workouts in Last 30 Days",
      stats.workoutsInLast30Days,
      30,
      numStats
    );

    const streakStats = document.createElement("div");
    streakStats.id = "streak-stats";

    leftColumn.appendChild(streakStats);
    // Current Streak
    renderStatsCanvasContainer(
      "whatshot",
      "Current Streak",
      stats.currentStreak,
      stats.maxStreak,
      streakStats
    );

    // Maximum Streak
    renderStatsContainer(
      "whatshot",
      "Max Streak",
      stats.maxStreak,
      streakStats
    );

    renderWorkoutCountGraph(user.stats.workoutsByMonth, rightColumn);
    mainContainer.appendChild(logWorkoutButton);
  }

  logWorkoutButton.addEventListener("click", () => {
    renderEditModal();
  });
});
