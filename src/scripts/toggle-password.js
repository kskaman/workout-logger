// Toggle password visibility for login form
const loginPassword = document.getElementById("login-password");
const toggleLoginPassword = document.getElementById("toggle-login-password");

if (toggleLoginPassword) {
  toggleLoginPassword.addEventListener("click", () => {
    if (loginPassword.type === "password") {
      loginPassword.type = "text";
      toggleLoginPassword.textContent = "visibility_off";
    } else {
      loginPassword.type = "password";
      toggleLoginPassword.textContent = "visibility";
    }
  });
}

// Toggle password visibility for register form
const registerPassword = document.getElementById("register-password");
const toggleRegisterPassword = document.getElementById(
  "toggle-register-password"
);

if (toggleRegisterPassword) {
  toggleRegisterPassword.addEventListener("click", () => {
    if (registerPassword.type === "password") {
      registerPassword.type = "text";
      toggleRegisterPassword.textContent = "visibility_off";
    } else {
      registerPassword.type = "password";
      toggleRegisterPassword.textContent = "visibility";
    }
  });
}

const confirmPassword = document.getElementById("register-confirm-password");
const toggleConfirmPassword = document.getElementById(
  "toggle-confirm-password"
);

if (toggleConfirmPassword) {
  toggleConfirmPassword.addEventListener("click", () => {
    if (confirmPassword.type === "password") {
      confirmPassword.type = "text";
      toggleConfirmPassword.textContent = "visibility_off";
    } else {
      confirmPassword.type = "password";
      toggleConfirmPassword.textContent = "visibility";
    }
  });
}
