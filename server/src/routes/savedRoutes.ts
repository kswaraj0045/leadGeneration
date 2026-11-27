import { Router } from 'express';
import { SavedController } from '../controllers/savedController.js';
import { authenticateToken } from '../middleware/auth.js';
import { trackAndEnforceUsage } from '../middleware/usage.js';

const router = Router();

router.use(authenticateToken);

router.get('/', SavedController.list);
router.post('/', trackAndEnforceUsage('SAVE_COMPANY'), SavedController.create);
router.patch('/:id', SavedController.update);
router.delete('/:id', SavedController.remove);

export default router;
