import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.create([
      {
        username: 'alex',
        email: 'alex@example.com',
        displayName: 'Alex Morgan',
      },
      {
        username: 'jordan',
        email: 'jordan@example.com',
        displayName: 'Jordan Lee',
      },
      {
        username: 'sam',
        email: 'sam@example.com',
        displayName: 'Sam Rivera',
      },
    ]);

    const teams = await Team.create([
      {
        name: 'Trail Blazers',
        description: 'Weekend endurance and outdoor training crew.',
        members: [users[0]._id, users[1]._id],
      },
      {
        name: 'Strength Lab',
        description: 'Progressive strength and mobility team.',
        members: [users[2]._id],
      },
    ]);

    await Activity.create([
      {
        user: users[0]._id,
        team: teams[0]._id,
        type: 'Run',
        durationMinutes: 42,
        calories: 410,
        completedAt: new Date('2026-09-16T07:30:00Z'),
      },
      {
        user: users[1]._id,
        team: teams[0]._id,
        type: 'Cycling',
        durationMinutes: 55,
        calories: 520,
        completedAt: new Date('2026-09-17T17:00:00Z'),
      },
      {
        user: users[2]._id,
        team: teams[1]._id,
        type: 'Strength',
        durationMinutes: 35,
        calories: 280,
        completedAt: new Date('2026-09-18T06:45:00Z'),
      },
    ]);

    await Leaderboard.create([
      { user: users[0]._id, team: teams[0]._id, points: 860, rank: 1 },
      { user: users[1]._id, team: teams[0]._id, points: 720, rank: 2 },
      { user: users[2]._id, team: teams[1]._id, points: 610, rank: 3 },
    ]);

    await Workout.create([
      {
        name: 'Foundation Run',
        description: 'A steady cardio session for building aerobic capacity.',
        difficulty: 'beginner',
        durationMinutes: 30,
        target: 'Cardio',
      },
      {
        name: 'Full Body Circuit',
        description: 'A balanced circuit for strength, stability, and conditioning.',
        difficulty: 'intermediate',
        durationMinutes: 45,
        target: 'Strength',
      },
      {
        name: 'Power Intervals',
        description: 'Short, demanding intervals for advanced conditioning.',
        difficulty: 'advanced',
        durationMinutes: 25,
        target: 'Performance',
      },
    ]);

    console.log('Seeded users, teams, activities, leaderboard, and workouts');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
