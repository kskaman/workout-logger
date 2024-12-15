export function showDeleteModal(onConfirm) {
  const deleteModal = document.getElementById("delete-modal");
  const closeDeleteModalButton = document.getElementById("close-delete-modal");
  const confirmDeleteButton = document.getElementById("confirm-delete-button");
  const cancelDeleteButton = document.getElementById("cancel-delete-button");

  // Show the modal
  deleteModal.style.display = "block";

  // Close modal function
  function closeModal() {
    deleteModal.style.display = "none";

    // Remove event listeners to prevent memory leaks
    closeDeleteModalButton.removeEventListener("click", closeModal);
    cancelDeleteButton.removeEventListener("click", closeModal);
    confirmDeleteButton.removeEventListener("click", handleConfirm);
  }

  // Confirm delete function
  function handleConfirm() {
    closeModal();
    onConfirm();
  }

  // Attach event listeners
  closeDeleteModalButton.addEventListener("click", closeModal);
  cancelDeleteButton.addEventListener("click", closeModal);
  confirmDeleteButton.addEventListener("click", handleConfirm);
}
