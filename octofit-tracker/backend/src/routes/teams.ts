import { Router } from 'express';
import Team from '../models/Team.js';
import { createCrudRouter } from './crud.js';

const router = Router();
router.use('/', createCrudRouter(Team, ['members']));

export default router;