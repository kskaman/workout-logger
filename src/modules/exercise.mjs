// ../src/modules/exercise.mjs

import { addSet, changeExerciseType } from "./addSet.mjs";
import { showExerciseSuggestions } from "./exerciseSuggestions.mjs";
import { checkSaveWorkoutButtonVisibility } from "./saveButton.mjs";

export function addExerciseToForm({
  exercise = null,
  exerciseCountParam = null,
  container,
}) {
  let exerciseCount = container.dataset.exerciseCount || 0;
  exerciseCount = exerciseCountParam || ++exerciseCount;
  container.dataset.exerciseCount = exerciseCount;

  const exerciseDiv = document.createElement("div");
  exerciseDiv.classList.add("exercise");
  exerciseDiv.dataset.exerciseId = exerciseCount;

  exerciseDiv.innerHTML = `
    <div class="remove-exercise-button">&times;</div>
    <div class="form-group">
        <label for="exercise-name-${exerciseCount}">Exercise Name</label>
        <input type="text" id="exercise-name-${exerciseCount}" name="exercise-name-${exerciseCount}" autocomplete="off" required>
        <div class="error-message" id="exercise-${exerciseCount}-name-error"></div>
    </div>
    <div class="form-group">
        <label for="exercise-type-${exerciseCount}">Exercise Type</label>
        <select id="exercise-type-${exerciseCount}" name="exercise-type-${exerciseCount}" required>
            <option value="">(select one)</option>
            <option value="bodyweight">Bodyweight</option>
            <option value="resistance-band">Resistance Band</option>
            <option value="weighted">Weighted</option>
        </select>
        <div class="error-message" id="exercise-${exerciseCount}-type-error"></div>
    </div>
    <div class="sets-container" data-exercise-id="${exerciseCount}">
        <!-- Sets will be added here dynamically -->
    </div>
    <div class="error-message" id="set-error-${exerciseCount}"></div>
    <div class="exercise-buttons">
        <button type="button" class="add-set-button btn-secondary">Add Set</button>
    </div>
  `;

  container.appendChild(exerciseDiv);

  // Delete exercise
  const removeExerciseButton = exerciseDiv.querySelector(
    ".remove-exercise-button"
  );
  removeExerciseButton.addEventListener("click", () => {
    container.removeChild(exerciseDiv);
    updateExerciseIds(container);
    checkSaveWorkoutButtonVisibility();
  });

  // Add event listener for exercise name input to show suggestions
  const exerciseNameInput = exerciseDiv.querySelector(
    `#exercise-name-${exerciseCount}`
  );
  exerciseNameInput.addEventListener("input", () => {
    showExerciseSuggestions({
      inputElement: exerciseNameInput,
      exerciseDiv,
    });
  });

  // Add or remove weight/resistance column on exercise change
  const exerciseTypeSelect = exerciseDiv.querySelector(
    `#exercise-type-${exerciseCount}`
  );
  exerciseTypeSelect.addEventListener("change", () => {
    changeExerciseType({ exerciseDiv, exerciseTypeSelect });
  });

  // Functionality to add set
  const addSetButton = exerciseDiv.querySelector(".add-set-button");
  addSetButton.addEventListener("click", () => addSet({ exerciseDiv }));

  // Populate existing exercise data if provided
  if (exercise) {
    exerciseNameInput.value = exercise.name;
    exerciseTypeSelect.value = exercise.type;
    changeExerciseType({ exerciseDiv, exerciseTypeSelect });

    exercise.sets.forEach((set) => {
      addSet({ exerciseDiv, setData: set });
    });
  }

  checkSaveWorkoutButtonVisibility();
}

function updateExerciseIds(container) {
  const exerciseDivs = container.querySelectorAll(".exercise");
  exerciseDivs.forEach((exerciseDiv, index) => {
    const exerciseId = index + 1;
    const previousId = exerciseDiv.dataset.exerciseId;
    exerciseDiv.dataset.exerciseId = exerciseId;

    const exerciseNameInput = exerciseDiv.querySelector(
      `input[name^="exercise-name-"]`
    );
    const exerciseTypeSelect = exerciseDiv.querySelector(
      `select[name^="exercise-type-"]`
    );
    const exerciseNameErrorDiv = exerciseDiv.querySelector(
      `#exercise-${previousId}-name-error`
    );
    const exerciseTypeErrorDiv = exerciseDiv.querySelector(
      `#exercise-${previousId}-type-error`
    );
    const exerciseSetErrorDiv = exerciseDiv.querySelector(
      `#setError-${previousId}`
    );
    const setsContainer = exerciseDiv.querySelector(".sets-container");

    // Update names and IDs
    exerciseNameInput.name = `exercise-name-${exerciseId}`;
    exerciseNameInput.id = `exercise-name-${exerciseId}`;

    exerciseTypeSelect.name = `exercise-type-${exerciseId}`;
    exerciseTypeSelect.id = `exercise-type-${exerciseId}`;

    exerciseNameErrorDiv.id = `exercise-${exerciseId}-name-error`;
    exerciseTypeErrorDiv.id = `exercise-${exerciseId}-type-error`;
    exerciseSetErrorDiv.id = `set-error-${exerciseId}`;
    setsContainer.dataset.exerciseId = exerciseId;

    // Update sets
    const setRows = setsContainer.querySelectorAll(".set-row");
    setRows.forEach((setRow, setIndex) => {
      const setNumber = setIndex + 1;
      setRow.dataset.setNumber = setNumber;
      setRow.querySelector(".set-number").textContent = setNumber;
      const repsInput = setRow.querySelector(`input[name^="reps-"]`);
      const weightInput = setRow.querySelector(`input[name^="weight-"]`);
      repsInput.name = `reps-${exerciseId}-${setNumber}`;
      if (weightInput) {
        weightInput.name = `weight-${exerciseId}-${setNumber}`;
      }
    });
  });
  // Update container dataset exerciseCount
  container.dataset.exerciseCount = exerciseDivs.length;
}
