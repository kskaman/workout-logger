// ./src/scripts/auth.js

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/



// Event Listener for Registartion form
const registerForm = document.getElementById('register-form')
if (registerForm) {
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('theme')
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault()
        registerUser()
    })
}

// Event Listener for Login Form
const loginForm = document.getElementById('login-form')
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault()
        loginUser()
    })
}

// Register User Function
function registerUser() {

    const username = document.getElementById('register-username').value.trim()
    const password = document.getElementById('register-password').value.trim()
    const confirmPassword = document.getElementById('register-confirm-password').value.trim()

    if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.')
        return
    }

    
    const hashedPassword = btoa(password)
    
    // Store user in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {}
    if (users[username]) {
        alert('Username already exists.')
        return
    }

    users[username] = {
        passwordHash: hashedPassword,
        workouts: []
    }

    localStorage.setItem('users', JSON.stringify(users))
    alert('Registration successful! You can now log in.')
    window.location.href = './login.html'
}

// Login User Function
function loginUser() {

    const username = document.getElementById('login-username').value.trim()
    const password = document.getElementById('login-password').value

    const users = JSON.parse(localStorage.getItem('users')) || {}

    const hashedPassword = btoa(password)

    if (users[username] && users[username].passwordHash === hashedPassword) {
        sessionStorage.setItem('currentUser', username)
        alert('Login successful!')
        window.location.href = './home-page.html'
    } else {
        alert('Invalid username or password')
    }
}