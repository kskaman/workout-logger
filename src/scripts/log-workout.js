// ./src/scripts/log-workouts.js

import { renderEditModal } from "../modules/editModal.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const logWorkoutButton = document.getElementById("log-workout-button");

  logWorkoutButton.addEventListener("click", () => {
    renderEditModal();
  });
});
