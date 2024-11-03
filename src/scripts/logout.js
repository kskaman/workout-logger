/* ./src/scripts/logout.js */

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-link')

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('currentUser')
            sessionStorage.removeItem('theme')
            window.location.href = "../../"
        })
    }
})