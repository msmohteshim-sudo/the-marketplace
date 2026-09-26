import { Router } from 'express';
import { getMessages, getConversation, sendMessage } from '../controllers/messages.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getMessages);
router.get('/:partnerId', authenticate, getConversation);
router.post('/', authenticate, sendMessage);

export default router;
