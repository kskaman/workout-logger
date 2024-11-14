addEventListener("DOMContentLoaded", () => {
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
});
