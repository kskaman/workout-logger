// ./src/scripts/workout-history.js

import renderWorkouts from "../modules/renderWorkouts.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const historyContainer = document.getElementById("history-container");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  const closeModalButton = document.getElementById("close-modal-button");

  let filterOptionVisible = false;
  let filterOptionContainer = null;

  // Get currentUser from sessionStorage
  const currentUser = sessionStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};

  let workouts = users[currentUser].workouts || [];

  renderWorkouts(workouts);

  addEventListeners(workouts)
    
  
  function addEventListeners(workoutsToRender) {
    workoutsToRender.forEach((workout) => {
      const originalIndex = workouts.indexOf(workout);

      const viewButton = document.getElementById(
        `view-button-${originalIndex}`
      );
      const editButton = document.getElementById(
        `edit-button-${originalIndex}`
      );
      const deleteButton = document.getElementById(
        `delete-button-${originalIndex}`
      );

      viewButton.addEventListener("click", (event) => {
        event.stopPropagation();
        openModal("view", originalIndex);
      });

      editButton.addEventListener("click", (event) => {
        event.stopPropagation();
        openModal("edit", originalIndex);
      });

      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteWorkout(originalIndex);
      });
    });
  }

  function openModal(mode, index) {
    const workout = workouts[index];
    modalContent.innerHTML = ""; // Clear previous content

    if (mode === "view") {
      renderViewModal(workout);
    } else if (mode === "edit") {
      renderEditModal(workout, index);
    }

    // Show the modal
    modalOverlay.style.display = "block";
    // document.body.classList.add("modal-open");
  }


  

  


  

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
      renderWorkoutHistory();
    }
  }

  function closeModal() {
    modalOverlay.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  // Event listener for close button
  closeModalButton.addEventListener("click", closeModal);

  

  // Filter functionality
  const filterButton = document.getElementById("filter-container");
  filterButton.addEventListener("click", () => {
    if (filterOptionVisible) {
      hideFilterOptions();
    } else {
      showFilterOptions();
    }
  });



 