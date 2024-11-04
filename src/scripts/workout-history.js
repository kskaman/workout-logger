// ../src/scripts/workout-history.js

document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('history-container')

    // Get currentUser from sessionStorage
    const currentUser = sessionStorage.getItem('currentUser')

    if (!currentUser) {
        alert('No user is currently logged in.')
        window.location.href = "./login.html"
        return
    }

    const users = JSON.parse(localStorage.getItem('users')) || {}

    if (!users[currentUser]) {
        alert('User not found.')
        window.location.href = "./login.html"
        return
    }

    let workouts = users[currentUser].workouts || []

    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
        const date = new Date(dateString)
        return date.toLocaleDateString(undefined, options)
    }

    // Function to render workouts
    function renderWorkouts() {
        historyContainer.innerHTML = ''
        console.log(workouts.length)
        if (workouts.length === 0) {
            console.log('enter')

            historyContainer.textContent = 'No past workouts found.'
            return
        }
        
        // Sort workouts by date (latest first)
        workouts.sort((a, b) => new Date(b.date) - new Date(a.date))

        // Display workouts
        workouts.forEach((workout, index) => {
            const workoutDiv = document.createElement('div')
            workoutDiv.classList.add('workout-item')
            workoutDiv.dataset.workoutIndex = index

            // Create a line with date and workout name
            const workoutInfo = document.createElement('div')
            workoutInfo.classList.add('workout-info')
            workoutInfo.textContent = `${formatDate(workout.date)} - ${workout.name}`

            // Create the action buttons
            const actionButtons = document.createElement('div')
            actionButtons.classList.add('workout-actions')

            // View button
            const viewButton = document.createElement('button')
            viewButton.textContent = 'view'
            viewButton.classList.add('btn-secondary')

            // Edit button 
            const editButton = document.createElement('button')
            editButton.textContent = 'edit'
            editButton.classList.add('btn-secondary')

            // Delete button
            const deleteButton = document.createElement('button')
            deleteButton.textContent = 'delete'
            deleteButton.classList.add('btn-secondary')
            deleteButton.addEventListener('click', () => {
                deleteWorkout(index)
            })

            // Append buttons to actions div
            actionButtons.appendChild(viewButton)
            actionButtons.appendChild(editButton)
            actionButtons.appendChild(deleteButton)

            // Append info and actions to workoutDiv
            workoutDiv.appendChild(workoutInfo)
            workoutDiv.appendChild(actionButtons)

            // Append workoutDiv to historyContainer
            historyContainer.appendChild(workoutDiv)
        })
    }
     
    function deleteWorkout(index) {
        if (confirm('Are you sure you want to delete this workout ?')) {
            // Remove the workout from the user's workout array
            workouts.splice(index, 1)
            // Save back to localStorage
            users[currentUser].workouts = workouts
            localStorage.setItem('users', JSON.stringify(users))
            // Re-render the workouts
            renderWorkouts()
        }
    }

    // Initial render
        renderWorkouts()
})