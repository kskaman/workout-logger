document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('auth-link')
    const currentUser = localStorage.getItem('currentUser')
    const lastLogin = localStorage.getItem('lastLogin')

    console.log(currentUser)
    console.log(lastLogin)

    if (currentUser && lastLogin) {
        const timeElapsed = Date.now() - parseInt(lastLogin)
        if (timeElapsed < 3600000) {
            authLink.textContent = 'Logout'
            authLink.addEventListener('click', () => {
                logoutUser()
            })
        } else {
            localStorage.removeItem('currentUser')
            localStorage.removeItem('lastLogin')
            authLink.textContent = 'Login/Register'
            authLink.href = '../pages/login.html'
        } 
    } else {
        authLink.textContent = 'Login/Register'
        authLink.href = '/workout-logger/src/pages/login.html'
    }
})

// Logout User
function logoutUser() {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('lastLogin')
    window.location.href = '../../index.html'
}