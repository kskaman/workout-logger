// ../src/modules/editModal.mjs

import { addExerciseToForm } from "./exercise.mjs";
import {
  saveWorkout,
  checkSaveWorkoutButtonVisibility,
} from "./saveButton.mjs";

import { closeModal } from "./utils.mjs";

export function renderEditModal(workout = null, index = null) {
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = "";

  const form = document.createElement("form");
  form.id = "workout-form";

  // Workout name input
  const workoutNameGroup = document.createElement("div");
  workoutNameGroup.classList.add("form-group");

  const workoutNameLabel = document.createElement("label");
  workoutNameLabel.textContent = "Workout Name";
  workoutNameLabel.setAttribute("for", "workout-name");

  const workoutNameInput = document.createElement("input");
  workoutNameInput.type = "text";
  workoutNameInput.required = true;
  workoutNameInput.id = "workout-name";
  if (workout) {
    workoutNameInput.value = workout.name;
  }
  workoutNameInput.autocomplete = "off";

  workoutNameGroup.appendChild(workoutNameLabel);
  workoutNameGroup.appendChild(workoutNameInput);

  // Workout date input
  const workoutDateGroup = document.createElement("div");
  workoutDateGroup.classList.add("form-group");

  const workoutDateLabel = document.createElement("label");
  workoutDateLabel.textContent = "Date";
  workoutDateLabel.setAttribute("for", "workout-date");

  const workoutDateInput = document.createElement("input");
  workoutDateInput.type = "date";
  workoutDateInput.required = true;
  workoutDateInput.id = "workout-date";
  if (workout) {
    workoutDateInput.value = workout.date;
  }

  workoutDateGroup.appendChild(workoutDateLabel);
  workoutDateGroup.appendChild(workoutDateInput);

  form.appendChild(workoutNameGroup);
  form.appendChild(workoutDateGroup);

  // Exercises container
  const exercisesContainer = document.createElement("div");
  exercisesContainer.id = "exercise-container";

  form.appendChild(exercisesContainer);

  // Add Exercise button
  const addExerciseButton = document.createElement("button");
  addExerciseButton.type = "button";
  addExerciseButton.textContent = "Add Exercise";
  addExerciseButton.classList.add("btn-secondary");
  addExerciseButton.addEventListener("click", () => {
    addExerciseToForm({
      container: exercisesContainer,
    });
  });

  form.appendChild(addExerciseButton);

  // Save Workout button
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Save Workout";
  saveButton.classList.add("btn-primary");
  saveButton.style.display = "none"; // Initially hidden
  saveButton.id = "save-workout-button";
  saveButton.addEventListener("click", () => {
    saveWorkout({ index });
  });

  form.appendChild(saveButton);

  modalContent.appendChild(form);

  // Now add exercises
  if (workout && workout.exercises) {
    workout.exercises.forEach((exercise, idx) => {
      addExerciseToForm({
        exercise,
        exerciseCountParam: idx + 1,
        container: exercisesContainer,
      });
    });
  }

  // Initial check for Save button visibility
  checkSaveWorkoutButtonVisibility();

  // Show the modal
  const modalOverlay = document.getElementById("modal-overlay");
  modalOverlay.style.display = "block";

  // Close the modal
  const closeModalButton = document.getElementById("close-modal-button");
  closeModalButton.addEventListener("click", closeModal);
}
