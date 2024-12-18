document.addEventListener("DOMContentLoaded", () => {
  const currentUser = sessionStorage.getItem("currentUser");

  if (!currentUser) {
    window.location.href = "./login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[currentUser]) {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("sidebarCollapsed");
    window.location.href = "./login.html";
    return;
  }
});
