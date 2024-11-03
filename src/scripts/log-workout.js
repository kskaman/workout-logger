//* ./src/scripts/log-workout.js

document.addEventListener('DOMContentLoaded', () => {

    const exercisesContainer = document.getElementById('exercise-container')
    const addExerciseButton = document.getElementById('add-exercise-button')
    const saveWorkoutButton = document.getElementById('save-workout-button')
    const workoutNameInput = document.getElementById('workout-name')
    const workoutDateInput = document.getElementById('workout-date')

    let exerciseCount = 0 // Used to generate unique IDs for exercises

    addExerciseButton.addEventListener('click', addExercise)
    saveWorkoutButton.addEventListener('click', saveWorkout)

    function addExercise() {
        exerciseCount++
        const exerciseDiv = document.createElement('div')
        exerciseDiv.classList.add('exercise')
        exerciseDiv.dataset.exerciseId = exerciseCount

        // Fixed the typo in the innerHTML (changed id to class for add-set-button)
        exerciseDiv.innerHTML = `
            <div class="remove-exercise-button">&times;</div>
            <div class="form-group">
                <label for="exercise-name-${exerciseCount}">Exercise Name</label>
                <input type="text" id="exercise-name-${exerciseCount}" name="exercise-name-${exerciseCount}" required>
            </div>
            <div class="form-group">
                <label for="exercise-type-${exerciseCount}">Exercise Type</label>
                <select id="exercise-type-${exerciseCount}" name="exercise-type-${exerciseCount}" required>
                    <option value="">(select one)</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="resistance-band">Resistance Band</option>
                    <option value="weighted">Weighted</option>
                </select>
            </div>
            <div class="sets-container" data-exercise-id="${exerciseCount}">
                <!-- Sets will be added here dynamically -->
            </div>
            <div class="exercise-buttons">
                <button type="button" class="add-set-button btn-secondary">Add Set</button>
            </div>
        `

        exercisesContainer.appendChild(exerciseDiv)

        const removeExerciseButton = exerciseDiv.querySelector('.remove-exercise-button')
        const addSetButton = exerciseDiv.querySelector('.add-set-button')

        const exerciseTypeSelect = exerciseDiv.querySelector(`#exercise-type-${exerciseCount}`)

        // Fixed the event listener to pass correct parameters
        exerciseTypeSelect.addEventListener('change', () => {
            changeExerciseType(exerciseDiv, exerciseTypeSelect)
        })

        removeExerciseButton.addEventListener('click', () => {
            exercisesContainer.removeChild(exerciseDiv)
            checkSaveWorkoutButtonVisibility()
        })

        addSetButton.addEventListener('click', () => addSet(exerciseDiv))
    }

    function addSet(exerciseDiv) {
        const exerciseId = exerciseDiv.dataset.exerciseId
        const exerciseTypeSelect = exerciseDiv.querySelector(`#exercise-type-${exerciseId}`)

        if (exerciseTypeSelect.value === '') {
            alert('Please select an exercise type.')
            return
        }

        const setsContainer = exerciseDiv.querySelector('.sets-container')
        const currentSetCount = setsContainer.children.length + 1

        const setRow = document.createElement('div')
        setRow.dataset.setNumber = currentSetCount
        setRow.classList.add('set-row')

        let weightInputHTML = ''
        if (exerciseTypeSelect.value === 'resistance-band' ||
            exerciseTypeSelect.value === 'weighted'
        ) {
            weightInputHTML = `
                <input
                    type="number"
                    name="weight-${exerciseId}-${currentSetCount}"
                    placeholder="Weight"
                    required>
            `
        }

        setRow.innerHTML = `
            <span class="set-number">${currentSetCount}</span>
            <input
                type="number"
                name="reps-${exerciseId}-${currentSetCount}"
                placeholder="Reps"
                required
            >
            ${weightInputHTML}
            <span class="remove-set-button">&times;</span>
        `

        setsContainer.appendChild(setRow)

        // Add event listener to remove set button
        const removeSetButton = setRow.querySelector('.remove-set-button')
        removeSetButton.addEventListener('click', () => {
            removeSet(exerciseDiv, setRow)
        })

        checkSaveWorkoutButtonVisibility()
    }

    function removeSet(exerciseDiv, setRow) {
        const setsContainer = exerciseDiv.querySelector('.sets-container')
        setsContainer.removeChild(setRow)

        // Adjust set numbers after removal
        const setRows = setsContainer.querySelectorAll('.set-row')
        setRows.forEach((row, index) => {
            const setNumber = index + 1
            row.dataset.setNumber = setNumber
            row.querySelector('.set-number').textContent = setNumber
            const exerciseId = exerciseDiv.dataset.exerciseId
            const repsInput = row.querySelector(`input[name^="reps-"]`)
            const weightInput = row.querySelector(`input[name^="weight-"]`)
            repsInput.name = `reps-${exerciseId}-${setNumber}`
            if (weightInput) {
                weightInput.name = `weight-${exerciseId}-${setNumber}`
            }
        })
        checkSaveWorkoutButtonVisibility()
    }

    function changeExerciseType(exerciseDiv, exerciseTypeSelect) {
        const exerciseType = exerciseTypeSelect.value
        const setsContainer = exerciseDiv.querySelector('.sets-container')
        const setRows = setsContainer.querySelectorAll('.set-row')

        setRows.forEach(setRow => {
            const exerciseId = exerciseDiv.dataset.exerciseId
            const setNumber = setRow.dataset.setNumber
            let weightInput = setRow.querySelector(`input[name="weight-${exerciseId}-${setNumber}"]`)

            if (exerciseType === 'resistance-band' || exerciseType === 'weighted') {
                if (!weightInput) {
                    // Add weight input
                    weightInput = document.createElement('input')
                    weightInput.type = 'number'
                    weightInput.name = `weight-${exerciseId}-${setNumber}`
                    weightInput.placeholder = 'Weight'
                    weightInput.required = true

                    // Insert the weight input after the reps input
                    const repsInput = setRow.querySelector(`input[name="reps-${exerciseId}-${setNumber}"]`)
                    setRow.insertBefore(weightInput, repsInput.nextSibling)
                }
            } else {
                if (weightInput) {
                    // Remove weight input
                    weightInput.parentNode.removeChild(weightInput)
                }
            }
        })
    }

    function checkSaveWorkoutButtonVisibility() {
        const exerciseDivs = exercisesContainer.querySelectorAll('.exercise')
        const setRows = exercisesContainer.querySelectorAll('.set-row')

        if (exerciseDivs.length > 0 && setRows.length > 0) {
            saveWorkoutButton.style.display = 'block'
        } else {
            saveWorkoutButton.style.display = 'none'
        }
    }

    function saveWorkout() {
        const workoutName = workoutNameInput.value.trim()
        const workoutDate = workoutDateInput.value.trim()

        if (workoutName === '' || workoutDate === '') {
            alert('Please enter workout name and date.')
            return
        }

        const exercises = []
        const exerciseDivs = exercisesContainer.querySelectorAll('.exercise')

        if (exerciseDivs.length === 0) {
            alert('Please add at least one exercise.')
            return
        }

        let allExercisesValid = true

        exerciseDivs.forEach(exerciseDiv => {
            const exerciseId = exerciseDiv.dataset.exerciseId
            const exerciseNameInput = exerciseDiv.querySelector(`#exercise-name-${exerciseId}`)
            const exerciseTypeSelect = exerciseDiv.querySelector(`#exercise-type-${exerciseId}`)
            const setsContainer = exerciseDiv.querySelector('.sets-container')

            const exerciseName = exerciseNameInput.value.trim()
            const exerciseType = exerciseTypeSelect.value

            if (exerciseName === '' || exerciseType === '') {
                alert('Enter name and type for each exercise.')
                allExercisesValid = false
                return
            }

            const setRows = setsContainer.querySelectorAll('.set-row')

            if (setRows.length === 0) {
                alert('Each exercise must have at least one set.')
                allExercisesValid = false
                return
            }

            const sets = []
            let allSetsValid = true

            setRows.forEach(setRow => {
                const repsInput = setRow.querySelector(`input[name^="reps-"]`)
                const weightInput = setRow.querySelector(`input[name^="weight-"]`)
                if (!repsInput.value ||
                    (weightInput && weightInput.required && !weightInput.value)) {
                    allSetsValid = false
                    return
                } else {
                    const setData = {
                        reps: repsInput.value,
                    }
                    if (weightInput) {
                        setData.weight = weightInput.value
                    }
                    sets.push(setData)
                }
            })

            if (!allSetsValid) {
                alert('Each set of every exercise should have valid entries.')
                allExercisesValid = false
                return
            }

            exercises.push({
                name: exerciseName,
                type: exerciseType,
                sets: sets,
            })
        })

        if (!allExercisesValid) {
            return
        }

        const workoutData = {
            name: workoutName,
            date: workoutDate,
            exercises: exercises,
        }

        // Save to localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {}
        const currentUser = sessionStorage.getItem('currentUser') || null

        if (!currentUser) {
            alert('No user is currently logged in.')
            return
        }

        const userId = currentUser

        if (!users[userId]) {
            alert('User not found.')
            return
        }

        users[userId].workouts.push(workoutData)
        localStorage.setItem('users', JSON.stringify(users))

        alert('Workout saved successfully!')
        resetForm()
    }

    function resetForm() {
        document.getElementById('log-workout-form').reset()
        exercisesContainer.innerHTML = ''
        saveWorkoutButton.style.display = 'none'
        exerciseCount = 0
    }
})