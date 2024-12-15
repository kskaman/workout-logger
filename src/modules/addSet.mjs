import { checkSaveWorkoutButtonVisibility } from "./saveButton.mjs";
import { clearErrorMessage, displayErrorMessage } from "./utils.mjs";

export function addSet({ exerciseDiv, setData = null }) {
  const exerciseId = exerciseDiv.dataset.exerciseId;
  const exerciseTypeSelect = exerciseDiv.querySelector(
    `#exercise-type-${exerciseId}`
  );

  if (exerciseTypeSelect.value === "") {
    displayErrorMessage(
      `exercise-${exerciseId}-type-error`,
      "Please select an exercise type."
    );
    return;
  }

  const setsContainer = exerciseDiv.querySelector(".sets-container");
  const currentSetCount = setsContainer.children.length + 1;

  const setRow = document.createElement("div");
  setRow.dataset.setNumber = currentSetCount;
  setRow.classList.add("set-row");

  let weightInputHTML = "";
  if (exerciseTypeSelect.value === "weighted") {
    weightInputHTML = `
      <input
        type="number"
        name="weight-${exerciseId}-${currentSetCount}"
        placeholder="Weight (in lbs)"
        required>
    `;
  }
  if (exerciseTypeSelect.value === "resistance-band") {
    weightInputHTML = `
      <input
        type="number"
        name="weight-${exerciseId}-${currentSetCount}"
        placeholder="Resistance (in lbs)"
        required>
    `;
  }

  setRow.innerHTML = `
    <span class="set-number">${currentSetCount}</span>
    <input
      type="number"
      name="reps-${exerciseId}-${currentSetCount}"
      placeholder="Reps"
      required
    >
    ${weightInputHTML}
    <span class="remove-set-button">&times;</span>
     `;

  setsContainer.appendChild(setRow);

  const removeSetButton = setRow.querySelector(".remove-set-button");
  removeSetButton.addEventListener("click", () => {
    removeSet({ exerciseDiv, setRow });
  });

  // Populate existing set data if provided
  if (setData) {
    const repsInput = setRow.querySelector(
      `input[name="reps-${exerciseId}-${currentSetCount}"]`
    );
    repsInput.value = setData.reps;
    if (setData.weight) {
      const weightInput = setRow.querySelector(
        `input[name="weight-${exerciseId}-${currentSetCount}"]`
      );
      if (weightInput) {
        weightInput.value = setData.weight;
      }
    }
  }

  checkSaveWorkoutButtonVisibility();
}

export function removeSet({ exerciseDiv, setRow }) {
  const setsContainer = exerciseDiv.querySelector(".sets-container");
  setsContainer.removeChild(setRow);

  // Adjust set numbers after removal
  const setRows = setsContainer.querySelectorAll(".set-row");
  setRows.forEach((row, index) => {
    const setNumber = index + 1;

    row.dataset.setNumber = setNumber;
    row.querySelector(".set-number").textContent = setNumber;
    const exerciseId = exerciseDiv.dataset.exerciseId;
    const repsInput = row.querySelector(`input[name^="reps-"]`);
    const weightInput = row.querySelector(`input[name^="weight-"]`);
    repsInput.name = `reps-${exerciseId}-${setNumber}`;
    if (weightInput) {
      weightInput.name = `weight-${exerciseId}-${setNumber}`;
    }
  });

  checkSaveWorkoutButtonVisibility();
}

export function changeExerciseType({ exerciseDiv, exerciseTypeSelect }) {
  const exerciseId = exerciseDiv.dataset.exerciseId;
  clearErrorMessage(`exercise-${exerciseId}-type-error`);
  clearErrorMessage(`set-error-${exerciseId}`);
  const exerciseType = exerciseTypeSelect.value;
  const setsContainer = exerciseDiv.querySelector(".sets-container");
  const setRows = setsContainer.querySelectorAll(".set-row");

  setRows.forEach((setRow) => {
    const setNumber = setRow.dataset.setNumber;
    let weightInput = setRow.querySelector(
      `input[name="weight-${exerciseId}-${setNumber}"]`
    );

    if (exerciseType === "weighted") {
      if (!weightInput) {
        // Add weight input
        weightInput = document.createElement("input");
        weightInput.type = "number";
        weightInput.name = `weight-${exerciseId}-${setNumber}`;
        weightInput.placeholder = "Weight (in lbs)";
        weightInput.required = true;

        const repsInput = setRow.querySelector(
          `input[name="reps-${exerciseId}-${setNumber}"]`
        );
        setRow.insertBefore(weightInput, repsInput.nextSibling);
      }
    } else if (exerciseType === "resistance-band") {
      if (!weightInput) {
        // Add weight input
        weightInput = document.createElement("input");
        weightInput.type = "number";
        weightInput.name = `weight-${exerciseId}-${setNumber}`;
        weightInput.placeholder = "Resistance (in lbs)";
        weightInput.required = true;

        const repsInput = setRow.querySelector(
          `input[name="reps-${exerciseId}-${setNumber}"]`
        );
        setRow.insertBefore(weightInput, repsInput.nextSibling);
      }
    } else {
      if (weightInput) {
        // Remove weight input
        weightInput.parentNode.removeChild(weightInput);
      }
    }
  });
}
