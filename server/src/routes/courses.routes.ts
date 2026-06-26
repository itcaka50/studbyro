import { Router } from 'express';
import * as courseController from '../controllers/course.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourse);

router.post('/', authMiddleware, requireAdmin, courseController.createCourse);
router.put('/:id', authMiddleware, requireAdmin, courseController.updateCourse);
router.delete(
    '/:id',
    authMiddleware,
    requireAdmin,
    courseController.deleteCourse,
);

export default router;
