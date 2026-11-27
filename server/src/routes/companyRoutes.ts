import { Router } from 'express';
import { CompanyController } from '../controllers/companyController.js';
import { optionalAuthenticateToken, authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { trackAndEnforceUsage } from '../middleware/usage.js';

const router = Router();

// Public / Authenticated Discovery routes
router.get('/', optionalAuthenticateToken, trackAndEnforceUsage('SEARCH'), CompanyController.list);
router.get('/suggestions', CompanyController.suggestions);
router.get('/categories', CompanyController.categories);
router.get('/:slugOrId', optionalAuthenticateToken, CompanyController.getByIdOrSlug);

// Admin-only management routes
router.post('/', authenticateToken, requireAdmin, CompanyController.create);
router.patch('/:id/verify', authenticateToken, requireAdmin, CompanyController.verify);
router.delete('/:id', authenticateToken, requireAdmin, CompanyController.delete);

export default router;
