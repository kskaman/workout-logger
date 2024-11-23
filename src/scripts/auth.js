// ./src/scripts/auth.js

import { clearErrorMessages, displayErrorMessage } from "../modules/utils.mjs";

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Event Listener for Registration form
const registerForm = document.getElementById("register-form");
if (registerForm) {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("theme");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    registerUser();
  });
}

// Event Listener for Login Form
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginUser();
  });
}

// Register User Function
function registerUser() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirmPassword = document
    .getElementById("register-confirm-password")
    .value.trim();

  clearErrorMessages();

  let hasError = false;

  if (username === "") {
    displayErrorMessage("register-username-error", "Username is required.");
    hasError = true;
  }

  if (!passwordRegex.test(password)) {
    displayErrorMessage(
      "register-password-error",
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    );
    hasError = true;
  }

  if (password !== confirmPassword) {
    displayErrorMessage("confirm-password-error", "Passwords do not match.");
    hasError = true;
  }

  const hashedPassword = btoa(password);

  // Store user in localStorage
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) {
    displayErrorMessage("register-username-error", "Username already exists.");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  users[username] = {
    passwordHash: hashedPassword,
    workouts: [],
  };

  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "./login.html";
}

// Login User Function
function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  clearErrorMessages();

  let hasError = false;

  if (username === "") {
    displayErrorMessage("login-username-error", "Username is required");
    hasError = true;
  }

  if (password === "") {
    displayErrorMessage("login-password-error", "Password is required");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};

  const hashedPassword = btoa(password);

  if (users[username] && users[username].passwordHash === hashedPassword) {
    sessionStorage.setItem("currentUser", username);
    window.location.href = "./home-page.html";
  } else {
    displayErrorMessage("login-error", "Invalid username or password");
  }
}
