import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { optionalAuthenticateToken, authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/overview', optionalAuthenticateToken, AnalyticsController.getOverview);
router.get('/usage', authenticateToken, AnalyticsController.getUsage);

export default router;
