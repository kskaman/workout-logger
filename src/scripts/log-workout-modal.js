// ./src/scripts/log-workout-modal.js

document.addEventListener('DOMContentLoaded', () => {

    const logWorkoutButton = document.getElementById('log-workout-button')
    const authModal = document.getElementById('auth-modal')
    const closeModalButton = document.getElementById('close-modal')
    const homePage = document.getElementById('container')

    
    if (logWorkoutButton) {
        logWorkoutButton.addEventListener('click', () => {
            const currentUser = localStorage.getItem('currentUser')
            if (currentUser) {
                // User is logged in; redirect to log workout page
                window.location.href = '/src/pages/log-workout-page.html'
            } else {
                // User is not logged in; show modal
                authModal.style.display = 'block'
                homePage.style.pointerEvents = 'none'
            }
        })
    }

    // Close modal when 'X' button is clicked
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            authModal.style.display = 'none'
            homePage.style.pointerEvents = 'auto'
        })
    }
})