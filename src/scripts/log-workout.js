// ./src/scripts/log-workout.js

document.addEventListener("DOMContentLoaded", () => {
  const logWorkoutButton = document.getElementById("log-workout-button");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  const closeModalButton = document.getElementById("close-modal-button");

  const currentUser = sessionStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  let workouts = users[currentUser]?.workouts || [];

  if (!currentUser || !users[currentUser]) {
    alert("User not found. Please log in again.");
    window.location.href = "./login.html";
    return;
  }

  logWorkoutButton.addEventListener("click", () => {
    openLogWorkoutModal();
  });

  function openLogWorkoutModal() {
    modalContent.innerHTML = ""; // Clear previous content

    modalContent.appendChild(closeModalButton);
    // Render the log workout form inside the modal
    renderLogWorkoutForm();

    // Show the modal
    modalOverlay.style.display = "block";
    document.body.classList.add("modal-open");
  }

  function renderLogWorkoutForm() {
    const form = document.createElement("form");
    form.id = "log-workout-form";

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

    workoutDateGroup.appendChild(workoutDateLabel);
    workoutDateGroup.appendChild(workoutDateInput);

    form.appendChild(workoutNameGroup);
    form.appendChild(workoutDateGroup);

    // Exercises container
    const exercisesContainer = document.createElement("div");
    exercisesContainer.id = "exercise-container";

    // Add Exercise button
    const addExerciseButton = document.createElement("button");
    addExerciseButton.type = "button";
    addExerciseButton.textContent = "Add Exercise";
    addExerciseButton.classList.add("btn-secondary");
    addExerciseButton.addEventListener("click", () => {
      addExerciseToForm(
        null,
        null,
        exercisesContainer,
        users,
        currentUser,
        "log"
      );
    });

    form.appendChild(exercisesContainer);
    form.appendChild(addExerciseButton);

    // Save Workout button
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Save Workout";
    saveButton.classList.add("btn-primary");
    saveButton.style.display = "none"; // Initially hidden
    saveButton.id = "save-workout-button";
    saveButton.addEventListener("click", saveWorkout);

    form.appendChild(saveButton);
    modalContent.appendChild(form);
  }

  function checkSaveWorkoutButtonVisibility() {
    const exercisesContainer = document.getElementById("exercise-container");
    const exerciseDivs = exercisesContainer.querySelectorAll(".exercise");
    const saveWorkoutButton = document.getElementById("save-workout-button");

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

  function saveWorkout() {
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

    // Insert the workout into the workouts array in sorted order
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

    users[currentUser].workouts = workouts;
    localStorage.setItem("users", JSON.stringify(users));

    alert("Workout saved successfully!");
    closeModal();
    // Optionally, re-render the workout history if necessary
    if (typeof renderWorkoutHistory === "function") {
      renderWorkoutHistory();
    }
  }

  function insertWorkoutInOrder(workoutData, workoutsArray) {
    const workoutDate = new Date(workoutData.date);
    let inserted = false;

    for (let i = 0; i < workoutsArray.length; i++) {
      const existingWorkoutDate = new Date(workoutsArray[i].date);
      if (workoutDate >= existingWorkoutDate) {
        workoutsArray.splice(i, 0, workoutData);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      workoutsArray.push(workoutData);
    }
  }

  function closeModal() {
    modalOverlay.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  closeModalButton.addEventListener("click", closeModal);

  // Expose function for use in other scripts (if necessary)
  window.checkSaveWorkoutButtonVisibility = checkSaveWorkoutButtonVisibility;

  // Add Exercise to Form
  function addExerciseToForm(
    exercise = null,
    exerciseCountParam = null,
    container,
    users,
    currentUser,
    mode = "log"
  ) {
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

    const removeExerciseButton = exerciseDiv.querySelector(
      ".remove-exercise-button"
    );
    const addSetButton = exerciseDiv.querySelector(".add-set-button");
    const exerciseTypeSelect = exerciseDiv.querySelector(
      `#exercise-type-${exerciseCount}`
    );

    const exerciseNameInput = exerciseDiv.querySelector(
      `#exercise-name-${exerciseCount}`
    );

    if (mode === "log") {
      // Add event listener for exercise name input to show suggestions
      exerciseNameInput.addEventListener("input", () => {
        showExerciseSuggestions(
          exerciseNameInput,
          exerciseDiv,
          users,
          currentUser
        );
      });
    }

    exerciseTypeSelect.addEventListener("change", () => {
      changeExerciseType(exerciseDiv, exerciseTypeSelect);
    });

    removeExerciseButton.addEventListener("click", () => {
      container.removeChild(exerciseDiv);
      checkSaveWorkoutButtonVisibility();
    });

    addSetButton.addEventListener("click", () => addSet(exerciseDiv));

    // Populate existing exercise data if provided
    if (exercise) {
      exerciseNameInput.value = exercise.name;
      exerciseTypeSelect.value = exercise.type;
      changeExerciseType(exerciseDiv, exerciseTypeSelect);

      exercise.sets.forEach((set) => {
        addSet(exerciseDiv, set);
      });
    }

    checkSaveWorkoutButtonVisibility();
  }

  function addSet(exerciseDiv, setData = null) {
    const exerciseId = exerciseDiv.dataset.exerciseId;
    const exerciseTypeSelect = exerciseDiv.querySelector(
      `#exercise-type-${exerciseId}`
    );

    if (exerciseTypeSelect.value === "") {
      alert("Please select an exercise type.");
      return;
    }

    const setsContainer = exerciseDiv.querySelector(".sets-container");
    const currentSetCount = setsContainer.children.length + 1;

    const setRow = document.createElement("div");
    setRow.dataset.setNumber = currentSetCount;
    setRow.classList.add("set-row");

    let weightInputHTML = "";
    if (
      exerciseTypeSelect.value === "resistance-band" ||
      exerciseTypeSelect.value === "weighted"
    ) {
      weightInputHTML = `
                <input
                    type="number"
                    name="weight-${exerciseId}-${currentSetCount}"
                    placeholder="Weight"
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
      removeSet(exerciseDiv, setRow);
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

  function removeSet(exerciseDiv, setRow) {
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

  function changeExerciseType(exerciseDiv, exerciseTypeSelect) {
    const exerciseType = exerciseTypeSelect.value;
    const setsContainer = exerciseDiv.querySelector(".sets-container");
    const setRows = setsContainer.querySelectorAll(".set-row");

    setRows.forEach((setRow) => {
      const exerciseId = exerciseDiv.dataset.exerciseId;
      const setNumber = setRow.dataset.setNumber;
      let weightInput = setRow.querySelector(
        `input[name="weight-${exerciseId}-${setNumber}"]`
      );

      if (exerciseType === "resistance-band" || exerciseType === "weighted") {
        if (!weightInput) {
          // Add weight input
          weightInput = document.createElement("input");
          weightInput.type = "number";
          weightInput.name = `weight-${exerciseId}-${setNumber}`;
          weightInput.placeholder = "Weight";
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

  // Exercise Suggestions Functions
  function showExerciseSuggestions(
    inputElement,
    exerciseDiv,
    users,
    currentUser
  ) {
    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.classList.add("suggestions-container");
    const inputValue = inputElement.value.toLowerCase();
    const userExercises = users[currentUser].exercises || [];

    // Filter exercises based on input
    const filteredExercises = userExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(inputValue)
    );

    // Remove existing suggestions
    const existingSuggestions = exerciseDiv.querySelector(
      ".suggestions-container"
    );

    if (existingSuggestions) {
      existingSuggestions.remove();
    }

    if (filteredExercises.length === 0 || inputValue === "") {
      return;
    }

    // Show suggestions
    filteredExercises.forEach((exercise) => {
      const suggestionItem = document.createElement("span");
      suggestionItem.classList.add("suggestion-item");
      suggestionItem.textContent = exercise.name;
      suggestionItem.addEventListener("click", () => {
        // Load previous data
        loadExerciseData(exercise, exerciseDiv);
        suggestionsContainer.remove();
      });
      suggestionsContainer.appendChild(suggestionItem);
    });

    inputElement.insertAdjacentElement("afterend", suggestionsContainer);
  }

  function loadExerciseData(exercise, exerciseDiv) {
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
    changeExerciseType(exerciseDiv, exerciseTypeSelect);

    // Clear existing sets
    setsContainer.innerHTML = "";

    // Add sets
    exercise.sets.forEach((set) => {
      addSet(exerciseDiv, set);
    });
  }
});
