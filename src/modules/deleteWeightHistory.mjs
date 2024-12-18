export function addDeleteButton(parent) {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `
        <span class="material-symbols-outlined">delete</span>
      `;
  deleteButton.id = "delete-weight-button";

  const deleteWeightModal = document.createElement("div");
  deleteWeightModal.id = "delete-modal";
  deleteWeightModal.classList.add("modal-overlay");
  deleteWeightModal.style.display = "none"; // Initially hide the modal
  deleteWeightModal.innerHTML = `
      <div class="delete-modal-container">
        <button id="close-delete-modal" class="close-modal-button">
          &times;
        </button>
        <div class="modal-content">
          <p class="modal-message">
            Are you sure you want to delete weight history?
          </p>
          <div class="modal-buttons">
            <button id="confirm-delete-button" class="btn-primary">
              Yes
            </button>
            <button id="cancel-delete-button" class="btn-primary">
              No
            </button>
          </div>
        </div>
      </div>`;

  // Append the delete button to the parent
  parent.appendChild(deleteButton);

  // Append the modal to the document body only once
  document.body.appendChild(deleteWeightModal);

  // Show the modal when delete button is clicked
  deleteButton.addEventListener("click", () => {
    deleteWeightModal.style.display = "block";
  });

  // Event listeners for modal buttons
  deleteWeightModal.addEventListener("click", (event) => {
    if (
      event.target.id === "close-delete-modal" ||
      event.target.id === "cancel-delete-button"
    ) {
      // Hide the modal when closed or canceled
      deleteWeightModal.style.display = "none";
    }

    if (event.target.id === "confirm-delete-button") {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      const user = users[sessionStorage.getItem("currentUser")];
      if (user) user.weightHistory = [];
      localStorage.setItem("users", JSON.stringify(users));

      // Clear the chart container
      const chartContainer = document.getElementById("weightChartContainer");
      if (chartContainer) chartContainer.innerHTML = "";

      // Reset the current weight display
      const weightValue = document.getElementById("current-weight-value");
      if (weightValue) weightValue.textContent = "-";

      // Remove the delete button since there's no weight history
      const deleteButton = document.getElementById("delete-weight-button");
      if (deleteButton) deleteButton.remove();

      // Hide the modal after deletion
      deleteWeightModal.style.display = "none";
    }
  });
}
