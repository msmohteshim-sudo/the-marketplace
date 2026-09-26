import { Router } from 'express';
import { getServices, getService, createService, updateService, deleteService, getMyServices } from '../controllers/services.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getServices);
router.get('/my', authenticate, getMyServices);
router.get('/:id', authenticate, getService);
router.post('/', authenticate, createService);
router.put('/:id', authenticate, updateService);
router.delete('/:id', authenticate, deleteService);

export default router;
