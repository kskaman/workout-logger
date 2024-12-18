import { updateUserExercises, updateUserStats } from "./calculateStats.mjs";
import {
  clearErrorMessages,
  displayErrorMessage,
  insertWorkoutInOrder,
} from "./utils.mjs";
import { closeModal } from "./utils.mjs";

export function checkSaveWorkoutButtonVisibility() {
  const exercisesContainer = document.getElementById("exercise-container");
  const saveWorkoutButton = document.getElementById("save-workout-button");

  if (!exercisesContainer || !saveWorkoutButton) {
    // Elements are not present, cannot proceed
    return;
  }

  const exerciseDivs = exercisesContainer.querySelectorAll(".exercise");

  let hasExerciseWithSet = false;

  exerciseDivs.forEach((exerciseDiv) => {
    const setsContainer = exerciseDiv.querySelector(".sets-container");
    const setRows = setsContainer.querySelectorAll(".set-row");
    if (setRows.length > 0) {
      hasExerciseWithSet = true;
    }
  });

  if (exerciseDivs.length > 0 && hasExerciseWithSet) {
    saveWorkoutButton.style.display = "block";
  } else {
    saveWorkoutButton.style.display = "none";
  }
}

export function saveWorkout({ index = null }) {
  // Fetch data from the form
  clearErrorMessages();

  const workoutNameInput = document.getElementById("workout-name");
  const workoutDateInput = document.getElementById("workout-date");
  const exercisesContainer = document.getElementById("exercise-container");

  const workoutName = workoutNameInput.value.trim();
  const workoutDate = workoutDateInput.value.trim();

  let hasError = false;

  if (workoutName === "") {
    displayErrorMessage("workout-name-error", "Please enter workout name.");
    hasError = true;
  }
  if (workoutDate === "") {
    displayErrorMessage("workout-date-error", "Please enter workout date.");
    hasError = true;
  }

  const exercises = [];
  const exerciseDivs = exercisesContainer.querySelectorAll(".exercise");

  if (exerciseDivs.length === 0) {
    displayErrorMessage("workout-error", "Please add at least one exercise.");
    hasError = true;
  }

  exerciseDivs.forEach((exerciseDiv) => {
    const exerciseId = exerciseDiv.dataset.exerciseId;
    const exerciseNameInput = exerciseDiv.querySelector(
      `input[name="exercise-name-${exerciseId}"]`
    );
    const exerciseTypeSelect = exerciseDiv.querySelector(
      `select[name="exercise-type-${exerciseId}"]`
    );
    const setsContainer = exerciseDiv.querySelector(".sets-container");

    const exerciseName = exerciseNameInput.value.trim();
    const exerciseType = exerciseTypeSelect.value;

    let exerciseHasError = false; // Tracks errors within this exercise

    if (exerciseName === "") {
      displayErrorMessage(
        `exercise-${exerciseId}-name-error`,
        "Please enter exercise name."
      );
      hasError = true;
      exerciseHasError = true;
    }

    if (exerciseType === "") {
      displayErrorMessage(
        `exercise-${exerciseId}-type-error`,
        "Please select exercise type."
      );
      hasError = true;
      exerciseHasError = true;
    }

    const setRows = setsContainer.querySelectorAll(".set-row");

    if (setRows.length === 0) {
      displayErrorMessage(
        `exercise-${exerciseId}-type-error`,
        "Please add at least one set."
      );
      hasError = true;
      exerciseHasError = true;
    }

    const sets = [];

    setRows.forEach((setRow) => {
      const setNumber = setRow.dataset.setNumber;
      const repsInput = setRow.querySelector(`input[name^="reps-"]`);
      const weightInput = setRow.querySelector(`input[name^="weight-"]`);
      const setErrorId = `setError-${exerciseId}-${setNumber}`;

      let setHasError = false;

      if (!repsInput.value) {
        displayErrorMessage(
          `set-error-${exerciseId}`,
          "Please enter complete data for all sets."
        );
        hasError = true;
        setHasError = true;
        exerciseHasError = true;
      }

      if (
        (exerciseType === "weighted" || exerciseType === "resistance-band") &&
        weightInput &&
        !weightInput.value
      ) {
        displayErrorMessage(
          `set-error-${exerciseId}`,
          "Please enter complete data for all sets."
        );
        hasError = true;
        setHasError = true;
        exerciseHasError = true;
      }

      if (!setHasError) {
        const setData = {
          reps: repsInput.value,
        };
        if (weightInput) {
          setData.weight = weightInput.value;
        }
        sets.push(setData);
      }
    });

    if (!exerciseHasError) {
      exercises.push({
        name: exerciseName,
        type: exerciseType,
        sets: sets,
      });
    }
  });

  if (hasError) {
    return; // Do not proceed with saving if there are errors
  }

  // Ensure workoutDate is in 'YYYY-MM-DD' format
  const formattedDate = new Date(workoutDate).toISOString().split("T")[0];

  const workoutData = {
    name: workoutName,
    date: formattedDate,
    exercises: exercises,
  };

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const currentUser = sessionStorage.getItem("currentUser");
  const workouts = users[currentUser].workouts || [];

  if (index !== null) {
    // Remove the old workout from the array
    workouts.splice(index, 1);
  }

  // Insert the updated workout into the workouts array in sorted order
  insertWorkoutInOrder(workoutData, workouts);

  // Update user's unique exercises
  users[currentUser].exercises = users[currentUser].exercises || [];
  exercises.forEach((exercise) => {
    const existingExerciseIndex = users[currentUser].exercises.findIndex(
      (ex) => ex.name.toLowerCase() === exercise.name.toLowerCase()
    );
    if (existingExerciseIndex !== -1) {
      users[currentUser].exercises[existingExerciseIndex] = exercise;
    } else {
      users[currentUser].exercises.push(exercise);
    }
  });

  // Save to localStorage
  users[currentUser].workouts = workouts;

  // Update user's exercises list and stats
  updateUserExercises(users[currentUser]);
  updateUserStats(users[currentUser]);

  localStorage.setItem("users", JSON.stringify(users));

  closeModal();

  // Reload the page to avoid data discrepancy
  window.location.reload();
}
