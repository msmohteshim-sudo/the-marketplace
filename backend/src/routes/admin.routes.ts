import { Router } from 'express';
import { getAdminStats, getUsers, updateUser, getReports } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/reports', getReports);

export default router;
