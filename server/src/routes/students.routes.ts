import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin, requireStudent } from '../middlewares/role.middleware';

const router = Router();

router.get('/me', authMiddleware, requireStudent, studentController.getMyProfile);
router.get(
    '/me/courses',
    authMiddleware,
    requireStudent,
    studentController.getMyCourses,
);
router.get(
    '/me/courses/available',
    authMiddleware,
    requireStudent,
    studentController.getMyAvailableCourses,
);
router.post(
    '/me/courses',
    authMiddleware,
    requireStudent,
    studentController.enrollMyCourse,
);
router.get(
    '/me/schedule',
    authMiddleware,
    requireStudent,
    studentController.getMySchedule,
);
router.get(
    '/me/program',
    authMiddleware,
    requireStudent,
    studentController.getMyProgram,
);

router.get('/', authMiddleware, requireAdmin, studentController.listStudents);
router.get(
    '/:facultyNumber',
    authMiddleware,
    requireAdmin,
    studentController.getStudent,
);
router.get(
    '/:facultyNumber/courses',
    authMiddleware,
    requireAdmin,
    studentController.getStudentCourses,
);

router.post('/', authMiddleware, requireAdmin, studentController.createStudent);
router.put(
    '/:facultyNumber',
    authMiddleware,
    requireAdmin,
    studentController.updateStudent,
);
router.delete(
    '/:facultyNumber',
    authMiddleware,
    requireAdmin,
    studentController.deleteStudent,
);

router.post(
    '/:facultyNumber/courses',
    authMiddleware,
    requireAdmin,
    studentController.enrollInCourse,
);
router.put(
    '/:facultyNumber/courses/:courseId/grade',
    authMiddleware,
    requireAdmin,
    studentController.gradeStudent,
);

export default router;
