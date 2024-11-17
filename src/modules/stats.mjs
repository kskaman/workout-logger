// ../src/modules/stats.mjs

export function updateUserStats(user) {
  const workouts = user.workouts || [];

  // Workouts are already in descending order (latest to oldest)

  // Initialize variables for stats
  let currentStreak = 0;
  let maxStreak = 0;
  let workoutsInLast30Days = 0;
  let maxReps = 0;
  let maxRepsExercise = "";
  let heaviestWeight = 0;
  let heaviestWeightExercises = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let previousDate = null;
  let tempStreak = 0;

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 29); // Include today

  workouts.forEach((workout, index) => {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);

    // Check if the workout is within the last 30 days
    if (workoutDate >= thirtyDaysAgo && workoutDate <= today) {
      workoutsInLast30Days++;
    }

    if (index === 0) {
      // First workout
      tempStreak = 1;
      maxStreak = 1;
      if (workoutDate.getTime() === today.getTime()) {
        currentStreak = 1;
      }
    } else {
      const diffInDays = Math.round(
        (previousDate - workoutDate) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 1) {
        // Consecutive day
        tempStreak++;
      } else {
        tempStreak = 1;
      }

      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }

      if (currentStreak > 0 && diffInDays === 1) {
        currentStreak = tempStreak;
      } else if (workoutDate.getTime() === today.getTime()) {
        currentStreak = 1;
      } else {
        currentStreak = 0;
      }
    }

    previousDate = workoutDate;

    // Calculate max reps and heaviest weight
    workout.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        const reps = parseInt(set.reps);
        if (reps > maxReps) {
          maxReps = reps;
          maxRepsExercise = exercise.name;
        }

        if (
          (exercise.type === "weighted" ||
            exercise.type === "resistance-band") &&
          set.weight
        ) {
          const weight = parseFloat(set.weight);
          if (weight > heaviestWeight) {
            heaviestWeight = weight;
            heaviestWeightExercises = [exercise.name];
          } else if (
            weight === heaviestWeight &&
            !heaviestWeightExercises.includes(exercise.name)
          ) {
            heaviestWeightExercises.push(exercise.name);
          }
        }
      });
    });
  });

  // Store stats in user profile
  user.stats = {
    currentStreak,
    maxStreak,
    workoutsInLast30Days,
    maxReps,
    maxRepsExercise,
    heaviestWeight,
    heaviestWeightExercises,
  };
}

export function updateUserExercises(user) {
  const exercisesMap = {};
  user.workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const exerciseKey = exercise.name.toLowerCase();
      if (!exercisesMap[exerciseKey]) {
        exercisesMap[exerciseKey] = {
          name: exercise.name,
          type: exercise.type,
          sets: exercise.sets,
        };
      }
    });
  });
  user.exercises = Object.values(exercisesMap);
}
