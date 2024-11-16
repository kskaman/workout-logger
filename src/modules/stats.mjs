// ../src/modules/stats.mjs

export function updateUserStats(user) {
  const workouts = user.workouts || [];

  // Sort workouts by date (earliest to latest)
  workouts.sort((a, b) => new Date(a.date) - new Date(b.date));

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
  let streakDate = new Date(today);
  let tempStreak = 0;

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 29); // Include today

  const workoutDates = workouts.map((workout) => {
    const date = new Date(workout.date);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  // Calculate current streak and max streak
  for (let i = workoutDates.length - 1; i >= 0; i--) {
    const date = workoutDates[i];

    if (date.getTime() === streakDate.getTime()) {
      tempStreak++;
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
      streakDate.setDate(streakDate.getDate() - 1);
    } else if (
      date.getTime() ===
      streakDate.getTime() - 86400000 // 1 day difference
    ) {
      streakDate.setDate(streakDate.getDate() - 1);
      tempStreak++;
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    } else {
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
      tempStreak = 0;
      streakDate = new Date(date);
      streakDate.setDate(streakDate.getDate() - 1);
    }
  }
  currentStreak = tempStreak;

  // Calculate workouts in last 30 days
  workoutsInLast30Days = workoutDates.filter(
    (date) => date >= thirtyDaysAgo && date <= today
  ).length;

  // Calculate max reps and heaviest weight
  workouts.forEach((workout) => {
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
