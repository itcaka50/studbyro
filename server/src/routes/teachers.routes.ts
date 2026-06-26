import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/', teacherController.listTeachers);
router.get('/:userId', teacherController.getTeacher);
router.get('/:userId/courses', teacherController.getTeacherCourses);

router.use(authMiddleware, requireAdmin);

router.post('/', teacherController.createTeacher);
router.put('/:userId', teacherController.updateTeacher);
router.delete('/:userId', teacherController.deleteTeacher);

router.post('/:userId/courses', teacherController.assignCourse);
router.delete('/:userId/courses/:courseId', teacherController.removeCourse);

export default router;
