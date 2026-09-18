import { Router } from 'express';
import Activity from '../models/Activity.js';
import { createCrudRouter } from './crud.js';

const router = Router();
router.use('/', createCrudRouter(Activity, ['user', 'team']));

export default router;