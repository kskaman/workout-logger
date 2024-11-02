document.addEventListener('DOMContentLoaded', () => {

    const exercisesContainer = document.getElementById('exercise-container')
    const addExerciseButton = document.getElementById('add-exercise-button')
    const saveWorkoutButton = document.getElementById('save-workout-button')
    const workoutNameInput = document.getElementById('workout-name')
    const workoutDateInput = document.getElementById('workout-date')

    let exerciseCount = 0

    addExerciseButton.addEventListener('click', addExercise)
    saveWorkoutButton.addEventListener('click', saveWorkout)

    workoutNameInput.addEventListener('input', checkSaveWorkoutButtonVisibility)
    workoutDateInput.addEventListener('input', checkSaveWorkoutButtonVisibility)

    function addExercise() {
        exerciseCount++
        const exerciseDiv = document.createElement('div')
        exerciseDiv.classList.add('exercise')
        exerciseDiv.dataset.exerciseId = exerciseCount

        exerciseDiv.innerHTML = `
            <span class="remove-exercise-button">&times;</span>
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
                <button type="button" class="add-set-button">Add Set</button>
            </div>
        `

        exercisesContainer.appendChild(exerciseDiv)

        const removeExerciseButton = exerciseDiv.querySelector('.remove-exercise-button')
        const addSetButton = exerciseDiv.querySelector('.add-set-button')
        const exerciseNameInput = exerciseDiv.querySelector(`#exercise-name-${exerciseCount}`)
        const exerciseTypeSelect = exerciseDiv.querySelector(`#exercise-type-${exerciseCount}`)

        removeExerciseButton.addEventListener('click', () => {
            exercisesContainer.removeChild(exerciseDiv)
            checkSaveWorkoutButtonVisibility()
        })

        addSetButton.addEventListener('click', () => addSet(exerciseDiv))

        exerciseNameInput.addEventListener('input', checkSaveWorkoutButtonVisibility)
        exerciseTypeSelect.addEventListener('change', () => {
            // Clear sets when exercise type changes
            const setsContainer = exerciseDiv.querySelector('.sets-container')
            setsContainer.innerHTML = ''
            checkSaveWorkoutButtonVisibility()
        })
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
        `

        setsContainer.appendChild(setRow)

        const repsInput = setRow.querySelector(`input[name="reps-${exerciseId}-${currentSetCount}"]`)
        const weightInput = setRow.querySelector(`input[name="weight-${exerciseId}-${currentSetCount}"]`)

        repsInput.addEventListener('input', checkSaveWorkoutButtonVisibility)
        if (weightInput) {
            weightInput.addEventListener('input', checkSaveWorkoutButtonVisibility)
        }

        checkSaveWorkoutButtonVisibility()
    }

    function checkSaveWorkoutButtonVisibility() {
        const workoutName = workoutNameInput.value.trim()
        const workoutDate = workoutDateInput.value.trim()
        const exerciseDivs = exercisesContainer.querySelectorAll('.exercise')

        let allExercisesValid = true

        exerciseDivs.forEach(exerciseDiv => {
            const exerciseId = exerciseDiv.dataset.exerciseId
            const exerciseNameInput = exerciseDiv.querySelector(`#exercise-name-${exerciseId}`)
            const exerciseTypeSelect = exerciseDiv.querySelector(`#exercise-type-${exerciseId}`)
            const setsContainer = exerciseDiv.querySelector('.sets-container')

            if (exerciseNameInput.value.trim() === '' || exerciseTypeSelect.value === '') {
                allExercisesValid = false
                return
            }

            const setRows = setsContainer.querySelectorAll('.set-row')
            if (setRows.length === 0) {
                allExercisesValid = false
                return
            }

            setRows.forEach(setRow => {
                const repsInput = setRow.querySelector(`input[name^="reps-"]`)
                const weightInput = setRow.querySelector(`input[name^="weight-"]`)
                if (!repsInput.value || (weightInput && !weightInput.value)) {
                    allExercisesValid = false
                    return
                }
            })
        })

        if (workoutName !== '' && workoutDate !== '' && exerciseDivs.length > 0 && allExercisesValid) {
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

        exerciseDivs.forEach(exerciseDiv => {
            const exerciseId = exerciseDiv.dataset.exerciseId
            const exerciseNameInput = exerciseDiv.querySelector(`#exercise-name-${exerciseId}`)
            const exerciseTypeSelect = exerciseDiv.querySelector(`#exercise-type-${exerciseId}`)
            const setsContainer = exerciseDiv.querySelector('.sets-container')

            const exerciseName = exerciseNameInput.value.trim()
            const exerciseType = exerciseTypeSelect.value

            if (exerciseName === '' || exerciseType === '') {
                alert('Enter name and type for each exercise.')
                return
            }

            const setRows = setsContainer.querySelectorAll('.set-row')

            if (setRows.length === 0) {
                alert('Each exercise must have at least one set.')
                return
            }

            const sets = []
            let allSetsValid = true

            setRows.forEach(setRow => {
                const repsInput = setRow.querySelector(`input[name^="reps-"]`)
                const weightInput = setRow.querySelector(`input[name^="weight-"]`)
                if (!repsInput.value || (weightInput && !weightInput.value)) {
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
                return
            }

            exercises.push({
                name: exerciseName,
                type: exerciseType,
                sets: sets,
            })
        })

        const workoutData = {
            name: workoutName,
            date: workoutDate,
            exercises: exercises,
        }

        // Save to localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {}
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null

        if (!currentUser) {
            alert('No user is currently logged in.')
            return
        }

        const userId = currentUser.id

        if (!users[userId]) {
            alert('User not found.')
            return
        }

        if (!users[userId].workouts) {
            users[userId].workouts = []
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
