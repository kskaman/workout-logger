export function addDeleteButton(parent) {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `
      <span class="material-symbols-outlined">delete</span>
    `;
  deleteButton.id = "delete-weight-button";

  parent.appendChild(deleteButton);
  deleteButton.addEventListener("click", () =>
    console.log("delete workout history")
  );
}
