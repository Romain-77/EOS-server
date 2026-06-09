import { Router } from 'express';
import streakController from '../controllers/streakController.js';
import isAuth from '../middleware/isAuth.js';

const router = Router();

router.get('/', isAuth, streakController.getStreak);

export default router;