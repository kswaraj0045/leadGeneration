import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

// All admin endpoints require authentication and ADMIN role
router.use(authenticateToken, requireAdmin);

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.listUsers);
router.get('/organizations', AdminController.listOrganizations);
router.patch('/organizations/:id/plan', AdminController.updateOrgPlan);
router.post('/import/preview', AdminController.previewImport);
router.post('/import/commit', AdminController.commitImport);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
