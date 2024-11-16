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
    </div>
    <div class="form-group">
        <label for="exercise-type-${exerciseCount}">Exercise Type</label>
        <select id="exercise-type-${exerciseCount}" name="exercise-type-${exerciseCount}" required>
            <option value="">(select one)</option>
            <option value="bodyweight">Bodyweight</option>
            <option value="resistance-band">Resistance Band</option>
            <option value="weighted">Weighted</option>
        </select>
    </div>
    <div class="sets-container" data-exercise-id="${exerciseCount}">
        <!-- Sets will be added here dynamically -->
    </div>
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
