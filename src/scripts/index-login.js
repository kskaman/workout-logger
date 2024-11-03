/* ./src/scripts/index-login.js */

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('login-link')

    loginLink.addEventListener('click', () => {
        const currentUser = sessionStorage.getItem('currentUser')
        
        if (currentUser) {
            window.location.href = './src/pages/home-page.html'
        } else {
            window.location.href = './src/pages/login.html'
        }
    })
})