// ../src/scripts/login-logout.js

document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('auth-link')
    const currentUser = localStorage.getItem('currentUser')
    const lastLogin = localStorage.getItem('lastLogin')
    
    let loginPagePath = getRootPath() + 'src/pages/login.html'
    console.log(loginPagePath)    
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
            authLink.href = loginPagePath
        } 
    } else {
        authLink.textContent = 'Login/Register'
        authLink.href = loginPagePath
    }
})

// Logout User
function logoutUser() {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('lastLogin')
    let rootPath = getRootPath()
    window.location.href = rootPath + 'src/pages/login.html'
}


// Function returns the link to login page relative to current page
function getRootPath() {
    // Get the path of current page
    const currentPath = window.location.pathname
    console.log(currentPath)


    // Determine the depth (number of directories) from the root
    const pathSegments = currentPath.split('/').filter(
        segment => segment !== '')
    console.log(pathSegments)
    // Subtract 1 because the last segment is the current page
    let depth = pathSegments.length - 1

    // Construct a relative path that goes up to the root
    let pathToRoot = ''
    for (let i = 0; i < depth; i++) {
        pathToRoot += '../'
    }

    return pathToRoot
}