// ./src/scripts/log-workout.js

document.addEventListener('DOMContentLoaded', () => {
    const exercisesContainer = document.getElementById('exercises-container')
    const addExerciseButton = document.getElementById('add-exercise-button')
    let exerciseCount = 0

    addExerciseButton.addEventListener('click', () => {
        addExercise()
    })

    function addExercise() {
        exerciseCount++;
        const exerciseDiv = document.createElement('div');
        exerciseDiv.classList.add('exercise');
        exerciseDiv.dataset.exerciseId = exerciseCount;

        exerciseDiv.innerHTML = `
            <div class="exercise-header">
                <h3>Exercise ${exerciseCount}</h3>
                <button type="button" class="remove-exercise-button">&times;</button>
            </div>
            <div class="form-group">
                <label for="exercise-name-${exerciseCount}">Exercise Name :</label>
                <input type="text" id="exercise-name-${exerciseCount}" name="exercise-name-${exerciseCount}" required>
            </div>
            <div class="form-group">
                <label for="exercise-type-${exerciseCount}">Exercise Type :</label>
                <select id="exercise-type-${exerciseCount}" name="exercise-type-${exerciseCount}" required>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="resistance-band">Resistance Band</option>
                    <option value="weighted">Weighted</option>
                </select>
            </div>
            <div class="sets-container" data-exercise-id="${exerciseCount}">
                <!-- Sets will be added here dynamically -->
            </div>
            <button type="button" class="add-set-button">+ Add Set</button>
            <button type="button" class="complete-exercise-button">Complete Exercise</button>
        `

        exercisesContainer.appendChild(exerciseDiv)

        // Add event listeners for remove, add set, and complete exercise buttons
        const removeExerciseButton = exerciseDiv.querySelector('.remove-exercise-button')
        const addSetButton = exerciseDiv.querySelector('.add-set-button')
        const completeExerciseButton = exerciseDiv.querySelector('.complete-exercise-button')

        removeExerciseButton.addEventListener('click', () => {
            exercisesContainer.removeChild(exerciseDiv)
        })

        addSetButton.addEventListener('click', () => {
            addSet(exerciseDiv)
        })

        completeExerciseButton.addEventListener('click', () => {
            // Logic for completing exercise can be added here
            alert(`Exercise ${exerciseCount} completed!`)
        })

        // Add the first set automatically
        addSet(exerciseDiv)
    }

    function addSet(exerciseDiv) {
        const setsContainer = exerciseDiv.querySelector('.sets-container')
        const exerciseId = exerciseDiv.dataset.exerciseId
        const setCount = setsContainer.children.length + 1

        const setRow = document.createElement('div')
        setRow.classList.add('set-row')

        // Get the exercise type to determine if weight/resistance input is needed
        const exerciseTypeSelect = exerciseDiv.querySelector(`#exercise-type-${exerciseId}`)
        const exerciseType = exerciseTypeSelect.value

        let weightInput = ''
        if (exerciseType === 'resistance-band' || exerciseType === 'weighted') {
            weightInput = `
                <input type="number" name="weight-${exerciseId}-${setCount}" placeholder="Weight/Resistance" required>
            `
        }

        setRow.innerHTML = `
            <span class="set-number">${setCount}</span>
            <input type="number" name="reps-${exerciseId}-${setCount}" placeholder="Reps" required>
            ${weightInput}
        `

        setsContainer.appendChild(setRow)
    }
})
