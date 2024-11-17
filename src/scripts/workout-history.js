import { renderWorkoutHistory } from "../modules/renderWorkouts.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = sessionStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const workouts = users[currentUser].workouts || [];
  renderWorkoutHistory(workouts);
});
