import { Router } from 'express';
import User from '../models/User.js';
import { createCrudRouter } from './crud.js';

const router = Router();
router.use('/', createCrudRouter(User));

export default router;