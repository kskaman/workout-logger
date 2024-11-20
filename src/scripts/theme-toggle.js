// ./src/scripts.theme-toggle.js

// Theme Toggle Script
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.querySelector(".theme-label");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeToggle.classList.toggle("active");
    const theme = document.body.classList.contains("dark-theme")
      ? "Dark Mode"
      : "Light Mode";
    themeLabel.textContent = theme;
    sessionStorage.setItem("theme", theme);
  });

  // Load saved theme
  const savedTheme = sessionStorage.getItem("theme");
  if (savedTheme === "Dark Mode") {
    document.body.classList.add("dark-theme");
    themeToggle.classList.add("active");
    themeLabel.textContent = "Dark Mode";
  }
}
