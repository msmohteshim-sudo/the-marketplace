import { Router } from 'express';
import { getCourses, getCourse, createCourse, enrollCourse, updateProgress, getMyCourses } from '../controllers/courses.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getCourses);
router.get('/my', authenticate, getMyCourses);
router.get('/:id', authenticate, getCourse);
router.post('/', authenticate, createCourse);
router.post('/:id/enroll', authenticate, enrollCourse);
router.put('/:id/progress', authenticate, updateProgress);

export default router;
