import { Router } from 'express';
import { getJobs, getJob, createJob, updateJob, deleteJob, applyToJob, getJobApplications, getMyJobs, getMyApplications } from '../controllers/jobs.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getJobs);
router.get('/my', authenticate, getMyJobs);
router.get('/my-applications', authenticate, getMyApplications);
router.get('/:id', authenticate, getJob);
router.post('/', authenticate, createJob);
router.put('/:id', authenticate, updateJob);
router.delete('/:id', authenticate, deleteJob);
router.post('/:id/apply', authenticate, applyToJob);
router.get('/:id/applications', authenticate, getJobApplications);

export default router;
