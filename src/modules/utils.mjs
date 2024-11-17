// ../src/modules/utils.mjs

export function formatDate(dateString) {
  return dateString.replaceAll("-", "/");
}

export function insertWorkoutInOrder(workoutData, workoutsArray) {
  const workoutDate = new Date(workoutData.date);
  let inserted = false;

  for (let i = 0; i < workoutsArray.length; i++) {
    const existingWorkoutDate = new Date(workoutsArray[i].date);
    if (workoutDate >= existingWorkoutDate) {
      // Insert at current position
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
