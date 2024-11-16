// ../src/modules/saveButton.mjs

import { updateUserExercises, updateUserStats } from "./stats.mjs";

import { insertWorkoutInOrder } from "./utils.mjs";
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
  const workoutNameInput = document.getElementById("workout-name");
  const workoutDateInput = document.getElementById("workout-date");
  const exercisesContainer = document.getElementById("exercise-container");

  const workoutName = workoutNameInput.value.trim();
  const workoutDate = workoutDateInput.value.trim();

  if (workoutName === "" || workoutDate === "") {
    alert("Please enter workout name and date.");
    return;
  }

  const exercises = [];
  const exerciseDivs = exercisesContainer.querySelectorAll(".exercise");

  if (exerciseDivs.length === 0) {
    alert("Please add at least one exercise.");
    return;
  }

  let allExercisesValid = true;

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

    if (exerciseName === "" || exerciseType === "") {
      alert("Enter name and type for each exercise.");
      allExercisesValid = false;
      return;
    }

    const setRows = setsContainer.querySelectorAll(".set-row");

    if (setRows.length === 0) {
      alert("Each exercise must have at least one set.");
      allExercisesValid = false;
      return;
    }

    const sets = [];
    let allSetsValid = true;

    setRows.forEach((setRow) => {
      const repsInput = setRow.querySelector(`input[name^="reps-"]`);
      const weightInput = setRow.querySelector(`input[name^="weight-"]`);
      if (
        !repsInput.value ||
        (weightInput && weightInput.required && !weightInput.value)
      ) {
        allSetsValid = false;
        return;
      } else {
        const setData = {
          reps: repsInput.value,
        };
        if (weightInput) {
          setData.weight = weightInput.value;
        }
        sets.push(setData);
      }
    });

    if (!allSetsValid) {
      alert("Each set of every exercise should have valid entries.");
      allExercisesValid = false;
      return;
    }

    exercises.push({
      name: exerciseName,
      type: exerciseType,
      sets: sets,
    });
  });

  if (!allExercisesValid) {
    return;
  }

  const workoutData = {
    name: workoutName,
    date: workoutDate,
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

  // Update user's exercises list
  updateUserExercises(users[currentUser]);

  // Update user stats
  updateUserStats(users[currentUser]);

  localStorage.setItem("users", JSON.stringify(users));

  alert("Workout saved successfully!");
  closeModal();

  // reload the page
  window.location.reload();
}
