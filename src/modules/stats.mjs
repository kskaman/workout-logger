// ../src/modules/stats.mjs

export function updateUserStats(user) {
  const workouts = user.workouts || [];
  let currentStreak = 0;
  let maxStreak = 0;
  let workoutsInLast30Days = 0;
  let maxReps = 0;
  let maxRepsExercise = "";
  let heaviestWeight = 0;
  let heaviestWeightExercise = "";

  // Get today's date in UTC (midnight)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setUTCDate(today.getUTCDate() - 29); // Include today

  if (workouts.length === 0) {
    user.stats = {
      currentStreak: 0,
      maxStreak: 0,
      workoutsInLast30Days: 0,
      maxReps: 0,
      maxRepsExercise: "",
      heaviestWeight: 0,
      heaviestWeightExercise: "",
    };
    return;
  }

  let tempStreak = 1;
  const mostRecentDate = new Date(workouts[0].date);
  mostRecentDate.setUTCHours(0, 0, 0, 0);

  const hasWorkoutToday = mostRecentDate.getTime() === today.getTime();

  workouts.forEach((workout, i) => {
    const workoutDate = new Date(workout.date);
    workoutDate.setUTCHours(0, 0, 0, 0);

    // Check for workouts in the last 30 days
    if (workoutDate >= thirtyDaysAgo && workoutDate <= today) {
      workoutsInLast30Days++;
    }

    // Calculate streaks
    if (i > 0) {
      const previousDate = new Date(workouts[i - 1].date);
      previousDate.setUTCHours(0, 0, 0, 0);

      const diffInDays = Math.round(
        (previousDate - workoutDate) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }

    // Process exercises for max reps and heaviest weight
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
            heaviestWeightExercise = exercise.name;
          }
        }
      });
    });
  });

  // Final update for max streak
  maxStreak = Math.max(maxStreak, tempStreak);

  // Set current streak
  currentStreak = hasWorkoutToday ? tempStreak : 0;

  user.stats = {
    currentStreak,
    maxStreak,
    workoutsInLast30Days,
    maxReps,
    maxRepsExercise,
    heaviestWeight,
    heaviestWeightExercise,
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
