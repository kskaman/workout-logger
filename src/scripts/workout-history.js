// ../src/scripts/workout-history.js

document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('history-container')
    const modalOverlay = document.getElementById('modal-overlay')
    const modalContent = document.getElementById('modal-content')
    const closeModalButton = document.getElementById('close-modal-button')

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
        if (workouts.length === 0) {
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
            viewButton.textContent = 'View'
            viewButton.classList.add('btn-secondary')
            viewButton.addEventListener('click', () => {
                openModal('view', index)
            })

            // Edit button
            const editButton = document.createElement('button')
            editButton.textContent = 'Edit'
            editButton.classList.add('btn-secondary')
            editButton.addEventListener('click', () => {
                openModal('edit', index)
            })

            // Delete button
            const deleteButton = document.createElement('button')
            deleteButton.textContent = 'Delete'
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

    function openModal(mode, index) {
        const workout = workouts[index]
        modalContent.innerHTML = '' // Clear previous content

        if (mode === 'view') {
            // View mode (read-only)
            const modalHeader = document.createElement('div')
            modalHeader.classList.add('modal-header')

            const modalTitle = document.createElement('h2')
            modalTitle.textContent = workout.name

            const modalDate = document.createElement('p')
            modalDate.textContent = `Date: ${formatDate(workout.date)}`

            modalHeader.appendChild(modalTitle)
            modalHeader.appendChild(modalDate)

            const modalBody = document.createElement('div')
            modalBody.classList.add('modal-body')

            workout.exercises.forEach(exercise => {
                const exerciseDiv = document.createElement('div')
                exerciseDiv.classList.add('exercise-item')

                const exerciseHeader = document.createElement('h3')
                exerciseHeader.textContent = `${exercise.name} (${exercise.type})`

                exerciseDiv.appendChild(exerciseHeader)

                // Create table for sets
                const setsTable = createSetsTable(exercise)
                exerciseDiv.appendChild(setsTable)
                modalBody.appendChild(exerciseDiv)
            })

            modalContent.appendChild(modalHeader)
            modalContent.appendChild(modalBody)
        } else if (mode === 'edit') {
            // Edit mode (inputs)
            const form = document.createElement('form')
            form.id = 'edit-workout-form'

            // Workout name input
            const workoutNameGroup = document.createElement('div')
            workoutNameGroup.classList.add('form-group')

            const workoutNameLabel = document.createElement('label')
            workoutNameLabel.textContent = 'Workout Name'

            const workoutNameInput = document.createElement('input')
            workoutNameInput.type = 'text'
            workoutNameInput.value = workout.name
            workoutNameInput.required = true
            workoutNameInput.id = 'edit-workout-name'

            workoutNameGroup.appendChild(workoutNameLabel)
            workoutNameGroup.appendChild(workoutNameInput)

            // Workout date input
            const workoutDateGroup = document.createElement('div')
            workoutDateGroup.classList.add('form-group')

            const workoutDateLabel = document.createElement('label')
            workoutDateLabel.textContent = 'Date'

            const workoutDateInput = document.createElement('input')
            workoutDateInput.type = 'date'
            workoutDateInput.value = workout.date
            workoutDateInput.required = true
            workoutDateInput.id = 'edit-workout-date'

            workoutDateGroup.appendChild(workoutDateLabel)
            workoutDateGroup.appendChild(workoutDateInput)

            form.appendChild(workoutNameGroup)
            form.appendChild(workoutDateGroup)

            // Exercises container
            const exercisesContainer = document.createElement('div')
            exercisesContainer.id = 'edit-exercise-container'

            // Add existing exercises
            workout.exercises.forEach((exercise, idx) => {
                addExerciseToForm(exercise, idx + 1, exercisesContainer)
            })

            // Add Exercise button
            const addExerciseButton = document.createElement('button')
            addExerciseButton.type = 'button'
            addExerciseButton.textContent = 'Add Exercise'
            addExerciseButton.classList.add('btn-secondary')
            addExerciseButton.addEventListener('click', () => {
                addExerciseToForm(null, null, exercisesContainer)
            })

            form.appendChild(exercisesContainer)
            form.appendChild(addExerciseButton)

            // Save Workout button
            const saveButton = document.createElement('button')
            saveButton.type = 'button'
            saveButton.textContent = 'Save Workout'
            saveButton.classList.add('btn-primary')
            saveButton.addEventListener('click', () => {
                saveEditedWorkout(index)
            })

            form.appendChild(saveButton)
            modalContent.appendChild(form)
        }

        // Show the modal
        modalOverlay.style.display = 'block'
        document.body.classList.add('modal-open')
    }

    function createSetsTable(exercise) {
        const setsTable = document.createElement('table')
        setsTable.classList.add('sets-table')

        // Table header
        const thead = document.createElement('thead')
        const headerRow = document.createElement('tr')
        const headers = ['Set', 'Reps']
        if (exercise.type === 'resistance-band' || exercise.type === 'weighted') {
            headers.push('Weight')
        }

        headers.forEach(headerText => {
            const th = document.createElement('th')
            th.textContent = headerText
            headerRow.appendChild(th)
        })

        thead.appendChild(headerRow)
        setsTable.appendChild(thead)

        // Table body
        const tbody = document.createElement('tbody')

        exercise.sets.forEach((set, idx) => {
            const row = document.createElement('tr')

            const setNumberCell = document.createElement('td')
            setNumberCell.textContent = idx + 1

            const repsCell = document.createElement('td')
            repsCell.textContent = set.reps

            row.appendChild(setNumberCell)
            row.appendChild(repsCell)

            if (exercise.type === 'resistance-band' || exercise.type === 'weighted') {
                const weightCell = document.createElement('td')
                weightCell.textContent = set.weight
                row.appendChild(weightCell)
            }

            tbody.appendChild(row)
        })

        setsTable.appendChild(tbody)
        return setsTable
    }

    function addExerciseToForm(exercise = null, exerciseCount = null, container) {
        exerciseCount = exerciseCount || container.children.length + 1

        const exerciseDiv = document.createElement('div')
        exerciseDiv.classList.add('exercise')
        exerciseDiv.dataset.exerciseId = exerciseCount

        exerciseDiv.innerHTML = `
            <div class="remove-exercise-button">&times;</div>
            <div class="form-group">
                <label>Exercise Name</label>
                <input type="text" name="exercise-name-${exerciseCount}" required>
            </div>
            <div class="form-group">
                <label>Exercise Type</label>
                <select name="exercise-type-${exerciseCount}" required>
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

        container.appendChild(exerciseDiv)

        const removeExerciseButton = exerciseDiv.querySelector('.remove-exercise-button')
        const addSetButton = exerciseDiv.querySelector('.add-set-button')
        const exerciseTypeSelect = exerciseDiv.querySelector(`select[name="exercise-type-${exerciseCount}"]`)

        // Populate existing exercise data
        if (exercise) {
            exerciseDiv.querySelector(`input[name="exercise-name-${exerciseCount}"]`).value = exercise.name
            exerciseTypeSelect.value = exercise.type
        }

        exerciseTypeSelect.addEventListener('change', () => {
            changeExerciseType(exerciseDiv, exerciseTypeSelect)
        })

        removeExerciseButton.addEventListener('click', () => {
            container.removeChild(exerciseDiv)
        })

        addSetButton.addEventListener('click', () => addSet(exerciseDiv))

        // Add existing sets if editing
        if (exercise && exercise.sets) {
            exercise.sets.forEach((set) => {
                addSet(exerciseDiv, set)
            })
        }
    }

    function addSet(exerciseDiv, setData = null) {
        const exerciseId = exerciseDiv.dataset.exerciseId
        const exerciseTypeSelect = exerciseDiv.querySelector(`select[name="exercise-type-${exerciseId}"]`)

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
        if (exerciseTypeSelect.value === 'resistance-band' || exerciseTypeSelect.value === 'weighted') {
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

        const removeSetButton = setRow.querySelector('.remove-set-button')
        removeSetButton.addEventListener('click', () => {
            removeSet(exerciseDiv, setRow)
        })

        // Populate existing set data
        if (setData) {
            setRow.querySelector(`input[name="reps-${exerciseId}-${currentSetCount}"]`).value = setData.reps
            if (setData.weight) {
                setRow.querySelector(`input[name="weight-${exerciseId}-${currentSetCount}"]`).value = setData.weight
            }
        }
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

    function saveEditedWorkout(index) {
        const workoutNameInput = document.getElementById('edit-workout-name')
        const workoutDateInput = document.getElementById('edit-workout-date')
        const exercisesContainer = document.getElementById('edit-exercise-container')

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
            const exerciseNameInput = exerciseDiv.querySelector(`input[name="exercise-name-${exerciseId}"]`)
            const exerciseTypeSelect = exerciseDiv.querySelector(`select[name="exercise-type-${exerciseId}"]`)
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

        // Update the workout in the array
        workouts[index] = workoutData
        // Save to localStorage
        users[currentUser].workouts = workouts
        localStorage.setItem('users', JSON.stringify(users))

        alert('Workout updated successfully!')
        closeModal()
        renderWorkouts()
    }

    function closeModal() {
        modalOverlay.style.display = 'none'
        document.body.classList.remove('modal-open')
    }

    function deleteWorkout(index) {
        if (confirm('Are you sure you want to delete this workout?')) {
            workouts.splice(index, 1)
            users[currentUser].workouts = workouts
            localStorage.setItem('users', JSON.stringify(users))
            renderWorkouts()
            alert('Workout deleted successfully.')
        }
    }

    // Event listener for close button
    closeModalButton.addEventListener('click', closeModal)

    // Initial render
    renderWorkouts()
})