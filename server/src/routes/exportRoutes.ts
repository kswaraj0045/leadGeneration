import { Router } from 'express';
import { ExportController } from '../controllers/exportController.js';
import { authenticateToken } from '../middleware/auth.js';
import { trackAndEnforceUsage } from '../middleware/usage.js';

const router = Router();

router.use(authenticateToken);

router.post('/companies', trackAndEnforceUsage('EXPORT'), ExportController.exportCompanies);
router.post('/saved', trackAndEnforceUsage('EXPORT'), ExportController.exportSaved);

export default router;
