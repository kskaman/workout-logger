// ../src/modules/utils.mjs

export function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

export function insertWorkoutInOrder(workoutData, workoutsArray) {
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

export function closeModal() {
  const modalContent = document.getElementById("modal-content");

  const modalOverlay = document.getElementById("modal-overlay");
  modalContent.innerHTML = "";
  modalOverlay.style.display = "none";
}
