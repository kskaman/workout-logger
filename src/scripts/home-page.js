// ../src/scripts/last-workout-view.js

import renderLastWorkout from "../modules/renderLastWorkout.mjs";

document.addEventListener("DOMContentLoaded", () => {
  let showStats = true;

  const currentUser = sessionStorage.getItem("currentUser");

  const users = JSON.parse(localStorage.getItem("users")) || {};

  let lastWorkout = users[currentUser].workouts[0] || [];

  renderLastWorkout(lastWorkout);
  renderGeneralStats();
  renderStreak();

  function renderGeneralStats() {
    const generalStatsContainer = document.getElementById("general-stats");
    generalStatsContainer.innerHTML = "";
    const generalHeading = document.createElement("h3");
    generalHeading.textContent = "General Stats";

    generalStatsContainer.appendChild(generalHeading);

    if (!showStats) {
      const el = document.createElement("p");
      el.textContent = "No stats to show";
      generalStatsContainer.appendChild(el);
      return;
    }

    const stats = users[currentUser].stats;

    if (stats) {
      // Workout in Last 30 days
      const workouts30Days = document.createElement("p");
      workouts30Days.textContent = `Workouts in Last 30 Days: ${stats.workoutsInLast30Days}`;
      generalStatsContainer.appendChild(workouts30Days);

      // Maximum Reps Done
      const maxRepsElem = document.createElement("p");
      maxRepsElem.textContent = `Maximum Reps : ${stats.maxReps} (Exercise: ${stats.maxRepsExercise})`;
      generalStatsContainer.appendChild(maxRepsElem);

      // Heaviest Weight Lifted

      if (stats.heaviestWeightExercises.length !== 0) {
        const maxWeightElem = document.createElement("p");
        maxWeightElem.textContent = `Heaviest Weight Lifted: ${
          stats.heaviestWeight
        } lbs (Exercise: ${stats.heaviestWeightExercises.join(", ")})`;
        generalStatsContainer.appendChild(maxWeightElem);
      }
    } else {
      generalStatsContainer.appendChild(
        document.createTextNode("No statistics available.")
      );
    }
  }

  function renderStreak() {
    const streakStatsContainer = document.getElementById("streak-stats");
    streakStatsContainer.innerHTML = "";
    const streakHeading = document.createElement("h3");
    streakHeading.textContent = "Streak";

    streakStatsContainer.appendChild(streakHeading);

    if (!showStats) {
      const el = document.createElement("p");
      el.textContent = "No stats to show";
      streakStatsContainer.appendChild(el);
      return;
    }
    const stats = users[currentUser].stats;

    if (stats) {
      // Current Streak
      const currentStreakElem = document.createElement("p");
      currentStreakElem.textContent = `Current Streak: ${stats.currentStreak} days`;
      streakStatsContainer.appendChild(currentStreakElem);

      // Maximum Streak
      const maxStreakElem = document.createElement("p");
      maxStreakElem.textContent = `Maximum Streak: ${stats.maxStreak} days`;
      streakStatsContainer.appendChild(maxStreakElem);
    } else {
      streakStatsContainer.appendChild(
        document.createTextNode("No streak data available.")
      );
    }
  }
});
