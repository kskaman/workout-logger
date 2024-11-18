// ../src/scripts/sidebar-toggle.js

document.addEventListener("DOMContentLoaded", function () {
  const toggleIcon = document.querySelector(".toggle-icon");
  const sidebar = document.querySelector(".sidebar");

  toggleIcon.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
  });
});
