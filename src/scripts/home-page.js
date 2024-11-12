// ../src/scripts/last-workout-view.js

document.addEventListener("DOMContentLoaded", () => {
  let showStats = true;
  const lastWorkoutContainer = document.getElementById("last-workout");
  const currentUser = sessionStorage.getItem("currentUser");

  if (!currentUser) {
    alert("No user is currently logged in.");
    window.location.href = "./login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[currentUser]) {
    alert("User not found.");
    window.location.href = "./login.html";
    return;
  }

  function formatDate(dateString) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  let lastWorkout = users[currentUser].workouts[0] || [];

  renderLastWorkout();
  renderGeneralStats();
  renderStreak();

  function renderLastWorkout() {
    lastWorkoutContainer.innerHTML = "";

    if (lastWorkout.length === 0) {
      showStats = false;
      lastWorkoutContainer.textContent = "No past workouts found.";
      return;
    }

    // Create Heading
    const heading = document.createElement("h3");
    heading.textContent = "Last Workout";
    lastWorkoutContainer.appendChild(heading);

    // Create last workout table
    const table = document.createElement("table");
    table.classList.add("workout-table");

    // Create table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Date", "Workout Name", ""];

    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    const row = document.createElement("tr");
    row.classList.add("workout-item");

    const dataCell = document.createElement("td");
    dataCell.textContent = formatDate(lastWorkout.date);

    const nameCell = document.createElement("td");
    nameCell.textContent = lastWorkout.name;

    const actionCell = document.createElement("td");
    actionCell.classList.add("workout-actions");

    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.classList.add("btn-secondary");
    viewButton.id = `view-button`;
    viewButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openViewModal(lastWorkout);
    });

    actionCell.appendChild(viewButton);

    row.appendChild(dataCell);
    row.appendChild(nameCell);
    row.appendChild(actionCell);

    tbody.appendChild(row);

    table.appendChild(tbody);

    lastWorkoutContainer.appendChild(table);
  }

  function openViewModal(workout) {
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = "";

    const modalHeader = document.createElement("div");

    const modalTitle = document.createElement("p");
    modalTitle.textContent = `Workout Name - ${workout.name}`;

    const modalDate = document.createElement("p");
    modalDate.textContent = `Date - ${formatDate(workout.date)}`;

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalDate);

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");

    workout.exercises.forEach((exercise) => {
      const exerciseDiv = document.createElement("div");
      exerciseDiv.classList.add("exercise");

      const exerciseHeader = document.createElement("h4");
      exerciseHeader.textContent = `${exercise.name} - ${exercise.type}`;

      exerciseDiv.appendChild(exerciseHeader);

      // Create table for sets
      const setsTable = createSetsTable(exercise);
      exerciseDiv.appendChild(setsTable);
      modalBody.appendChild(exerciseDiv);
    });

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    const modalOverlay = document.getElementById("modal-overlay");
    modalOverlay.style.display = "block";

    const removeModalButton = document.getElementById("close-modal-button");
    removeModalButton.addEventListener("click", () => {
      modalContent.innerHTML = "";
      modalOverlay.style.display = "none";
    });
  }

  function createSetsTable(exercise) {
    const setsTable = document.createElement("table");
    setsTable.classList.add("sets-table");

    // Table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Set", "Reps"];
    if (exercise.type === "resistance-band" || exercise.type === "weighted") {
      headers.push("Weight");
    }

    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    setsTable.appendChild(thead);

    // Table body
    const tbody = document.createElement("tbody");

    exercise.sets.forEach((set, idx) => {
      const row = document.createElement("tr");

      const setNumberCell = document.createElement("td");
      setNumberCell.textContent = idx + 1;

      const repsCell = document.createElement("td");
      repsCell.textContent = set.reps;

      row.appendChild(setNumberCell);
      row.appendChild(repsCell);

      if (exercise.type === "resistance-band" || exercise.type === "weighted") {
        const weightCell = document.createElement("td");
        weightCell.textContent = set.weight;
        row.appendChild(weightCell);
      }

      tbody.appendChild(row);
    });

    setsTable.appendChild(tbody);
    return setsTable;
  }

  function renderGeneralStats() {
    const generalStatsContainer = document.getElementById("general-stats");
    generalStatsContainer.innerHTML = "";
    const generalHeading = document.createElement("h3");
    generalHeading.textContent = "General Stats";

    generalStatsContainer.appendChild(generalHeading);

    if (!showStats) {
      const el = document.createElement("p");
      el.textContent = "No stats to show";
      generalStatsContainer.appendChild(el);
      return;
    }

    const stats = users[currentUser].stats;

    if (stats) {
      // Workout in Last 30 days
      const workouts30Days = document.createElement("p");
      workouts30Days.textContent = `Workouts in Last 30 Days: ${stats.workoutsInLast30Days}`;
      generalStatsContainer.appendChild(workouts30Days);

      // Maximum Reps Done
      const maxRepsElem = document.createElement("p");
      maxRepsElem.textContent = `Maximum Reps : ${stats.maxReps} (Exercise: ${stats.maxRepsExercise})`;
      generalStatsContainer.appendChild(maxRepsElem);

      // Heaviest Weight Lifted

      if (stats.heaviestWeightExercises.length !== 0) {
        const maxWeightElem = document.createElement("p");
        maxWeightElem.textContent = `Heaviest Weight Lifted: ${
          stats.heaviestWeight
        } lbs (Exercise: ${stats.heaviestWeightExercises.join(", ")})`;
        generalStatsContainer.appendChild(maxWeightElem);
      }
    } else {
      generalStatsContainer.appendChild(
        document.createTextNode("No statistics available.")
      );
    }
  }

  function renderStreak() {
    const streakStatsContainer = document.getElementById("streak-stats");
    streakStatsContainer.innerHTML = "";
    const streakHeading = document.createElement("h3");
    streakHeading.textContent = "Streak";

    streakStatsContainer.appendChild(streakHeading);

    if (!showStats) {
      const el = document.createElement("p");
      el.textContent = "No stats to show";
      streakStatsContainer.appendChild(el);
      return;
    }
    const stats = users[currentUser].stats;

    if (stats) {
      // Current Streak
      const currentStreakElem = document.createElement("p");
      currentStreakElem.textContent = `Current Streak: ${stats.currentStreak} days`;
      streakStatsContainer.appendChild(currentStreakElem);

      // Maximum Streak
      const maxStreakElem = document.createElement("p");
      maxStreakElem.textContent = `Maximum Streak: ${stats.maxStreak} days`;
      streakStatsContainer.appendChild(maxStreakElem);
    } else {
      streakStatsContainer.appendChild(
        document.createTextNode("No streak data available.")
      );
    }
  }
});
