import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin, requireStudent } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/me', requireStudent, studentController.getMyProfile);
router.get('/me/courses', requireStudent, studentController.getMyCourses);
router.get(
    '/me/courses/available',
    requireStudent,
    studentController.getMyAvailableCourses,
);
router.post('/me/courses', requireStudent, studentController.enrollMyCourse);
router.get('/me/schedule', requireStudent, studentController.getMySchedule);
router.get('/me/program', requireStudent, studentController.getMyProgram);

router.get('/', studentController.listStudents);
router.get('/:facultyNumber', studentController.getStudent);
router.get('/:facultyNumber/courses', studentController.getStudentCourses);

router.post('/', requireAdmin, studentController.createStudent);
router.put('/:facultyNumber', requireAdmin, studentController.updateStudent);
router.delete('/:facultyNumber', requireAdmin, studentController.deleteStudent);

router.post(
    '/:facultyNumber/courses',
    requireAdmin,
    studentController.enrollInCourse,
);
router.put(
    '/:facultyNumber/courses/:courseId/grade',
    requireAdmin,
    studentController.gradeStudent,
);

export default router;
