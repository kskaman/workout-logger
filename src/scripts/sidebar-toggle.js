// ../src/scripts/sidebar-toggle.js

const sidebarCollapsed = sessionStorage.getItem("sidebarCollapsed");

const toggleIcon = document.querySelector(".toggle-icon");
const sidebar = document.querySelector(".sidebar");

toggleIcon.addEventListener("click", () => {
  // Add/remove the 'collapsed' class depending
  // whether its already present
  sidebar.classList.toggle("collapsed");

  // store a boolean value about whether sidebar
  // has a 'collapsed' class in sidebarCollapsed
  // session variable
  const collapsed = sidebar.classList.contains("collapsed");
  sessionStorage.setItem("sidebarCollapsed", collapsed);
});

// The reason we need the additional logic with session storage
// is that JavaScript operates on the DOM of the current page
// only.When you navigate to a different page, the browser
// reloads the DOM and JavaScript reinitializes, losing all
// previously applied states(like whether the sidebar was
// collapsed).
const collapsed = sessionStorage.getItem("sidebarCollapsed") === "true";
if (collapsed === true) {
  sidebar.classList.add("collapsed");
}
