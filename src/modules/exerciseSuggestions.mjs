// ../src/modules/exerciseSuggestions.mjs

import { addSet } from "./addSet.mjs";

export function showExerciseSuggestions({ inputElement, exerciseDiv }) {
  // Remove existing suggestions
  const existingSuggestions = exerciseDiv.querySelector(
    ".suggestions-container"
  );
  if (existingSuggestions) {
    existingSuggestions.remove();
  }

  const inputValue = inputElement.value.trim().toLowerCase();
  if (inputValue === "") return;

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const currentUser = sessionStorage.getItem("currentUser");
  const userExercises = users[currentUser].exercises || [];

  // Filter exercises based on input
  const filteredExercises = userExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(inputValue)
  );

  if (filteredExercises.length === 0) return;

  // Create suggestions container
  const suggestionsContainer = document.createElement("div");
  suggestionsContainer.classList.add("suggestions-container");

  // Show suggestions
  filteredExercises.forEach((exercise) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("suggestion-item");
    suggestionItem.textContent = exercise.name;
    suggestionItem.addEventListener("click", () => {
      // Load previous data
      loadExerciseData({
        exercise,
        exerciseDiv,
      });
      suggestionsContainer.remove();
    });
    suggestionsContainer.appendChild(suggestionItem);
  });

  inputElement.insertAdjacentElement("afterend", suggestionsContainer);
}

function loadExerciseData({ exercise, exerciseDiv }) {
  const exerciseId = exerciseDiv.dataset.exerciseId;
  const exerciseNameInput = exerciseDiv.querySelector(
    `input[name="exercise-name-${exerciseId}"]`
  );
  const exerciseTypeSelect = exerciseDiv.querySelector(
    `select[name="exercise-type-${exerciseId}"]`
  );
  const setsContainer = exerciseDiv.querySelector(".sets-container");

  // Set exercise name and type
  exerciseNameInput.value = exercise.name;
  exerciseTypeSelect.value = exercise.type;

  // Trigger change event to adjust sets inputs
  const event = new Event("change");
  exerciseTypeSelect.dispatchEvent(event);

  // Clear existing sets
  setsContainer.innerHTML = "";

  // Add sets
  exercise.sets.forEach((set) => {
    addSet({ exerciseDiv, setData: set });
  });
}
