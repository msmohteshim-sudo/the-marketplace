import { Router } from 'express';
import { getIdeas, getIdea, createIdea, updateIdea, purchaseIdeaLicense, getMyIdeas } from '../controllers/ideas.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getIdeas);
router.get('/my', authenticate, getMyIdeas);
router.get('/:id', authenticate, getIdea);
router.post('/', authenticate, createIdea);
router.put('/:id', authenticate, updateIdea);
router.post('/:id/license', authenticate, purchaseIdeaLicense);

export default router;
