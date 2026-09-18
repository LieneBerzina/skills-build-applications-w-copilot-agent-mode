import { Router } from 'express';
import Leaderboard from '../models/Leaderboard.js';
import { createCrudRouter } from './crud.js';

const router = Router();
router.get('/', async (_request, response) => {
  try {
    const entries = await Leaderboard.find().populate('user').populate('team').sort({ points: -1 });
    response.json(entries);
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected server error' });
  }
});
router.use('/', createCrudRouter(Leaderboard, ['user', 'team']));

export default router;