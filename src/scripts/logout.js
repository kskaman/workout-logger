/* ./src/scripts/logout.js */

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-link");

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("theme");
      sessionStorage.removeItem("sidebarCollapsed");
      window.location.href = "../../";
    });
  }
});
