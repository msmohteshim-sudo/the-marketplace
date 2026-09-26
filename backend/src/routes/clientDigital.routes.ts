import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getClientDigitalSummary,
  getQuickServices,
  getDigitalProjects,
  getDigitalIdeas,
  getPurchasedIdeas,
  getClientRecommendations,
  postDigitalJob
} from '../controllers/clientDigital.controller';

const router = Router();

// Public / Authenticated read routes for client digital dashboard
router.get('/summary', authenticate, getClientDigitalSummary);
router.get('/quick-services', getQuickServices);
router.get('/projects', getDigitalProjects);
router.get('/ideas', getDigitalIdeas);
router.get('/purchased-ideas', authenticate, getPurchasedIdeas);
router.get('/recommendations', getClientRecommendations);

// Client mutation routes
router.post('/jobs', authenticate, postDigitalJob);

export default router;
