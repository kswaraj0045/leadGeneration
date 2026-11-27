import { Router } from 'express';
import { MatchingController } from '../controllers/matchingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { trackAndEnforceUsage } from '../middleware/usage.js';

const router = Router();

// Matching queries require authentication and count towards monthly search quota
router.post('/query', authenticateToken, trackAndEnforceUsage('SEARCH'), MatchingController.match);

export default router;
