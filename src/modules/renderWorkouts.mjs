import { formatDate } from "./utils.mjs";

function renderWorkouts(workoutsToRender) {
  historyContainer.innerHTML = "";

  if (workoutsToRender.length === 0) {
    historyContainer.textContent = "No workouts found.";
    return;
  }

  // Create table
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

  workoutsToRender.forEach((workout) => {
    const row = document.createElement("tr");
    row.classList.add("workout-item");

    // Find the original index of the workout in the workouts array
    const originalIndex = workout.index;
    row.dataset.workoutIndex = originalIndex;

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(workout.date);

    const nameCell = document.createElement("td");
    nameCell.textContent = workout.name;

    const actionCell = document.createElement("td");
    actionCell.classList.add("workout-actions");

    // Create action buttons
    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.classList.add("btn-secondary");
    viewButton.id = `view-button-${originalIndex}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn-secondary");
    editButton.id = `edit-button-${originalIndex}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn-secondary");
    deleteButton.id = `delete-button-${originalIndex}`;

    // Append buttons to action cell
    actionCell.appendChild(viewButton);
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(dateCell);
    row.appendChild(nameCell);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  historyContainer.appendChild(table);

  addEventListenersToWorkoutActionButton(workouts);
}

function addEventListenersToWorkoutActionButton(workouts) {
  workouts.forEach((workout) => {
    const originalIndex = workouts.indexOf(workout);

    const viewButton = document.getElementById(`view-button-${originalIndex}`);
    const editButton = document.getElementById(`edit-button-${originalIndex}`);
    const deleteButton = document.getElementById(
      `delete-button-${originalIndex}`
    );

    viewButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openViewModal(workout);
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

export default renderWorkouts;
