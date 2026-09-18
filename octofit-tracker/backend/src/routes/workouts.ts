import { Router } from 'express';
import Workout from '../models/Workout.js';
import { createCrudRouter } from './crud.js';

const router = Router();
router.use('/', createCrudRouter(Workout));

export default router;