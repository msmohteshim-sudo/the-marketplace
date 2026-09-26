import { Router } from 'express';
import { getSavedItems, saveItem, unsaveItem } from '../controllers/saved.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getSavedItems);
router.post('/', authenticate, saveItem);
router.delete('/:entityType/:entityId', authenticate, unsaveItem);

export default router;
