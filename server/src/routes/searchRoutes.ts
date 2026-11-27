import { Router } from 'express';
import { SearchController } from '../controllers/searchController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/saved', SearchController.listSaved);
router.post('/saved', SearchController.createSaved);
router.delete('/saved/:id', SearchController.deleteSaved);
router.get('/history', SearchController.getHistory);

export default router;
