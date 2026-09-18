import mongoose from 'mongoose';

export const connectionString =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
export const db = mongoose.connection;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(connectionString, {
    dbName: 'octofit_db',
  });
  console.log('Connected to octofit_db');
}

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

export default db;
