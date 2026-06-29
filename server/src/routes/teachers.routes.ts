import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin, requireTeacher } from '../middlewares/role.middleware';

const router = Router();

router.get('/', teacherController.listTeachers);

router.get(
    '/me',
    authMiddleware,
    requireTeacher,
    teacherController.getMyProfile,
);
router.get(
    '/me/courses',
    authMiddleware,
    requireTeacher,
    teacherController.getMyCourses,
);
router.get(
    '/me/schedule',
    authMiddleware,
    requireTeacher,
    teacherController.getMySchedule,
);
router.get(
    '/me/courses/:courseId/students',
    authMiddleware,
    requireTeacher,
    teacherController.getMyCourseStudents,
);
router.put(
    '/me/courses/:courseId/students/:facultyNumber/grade',
    authMiddleware,
    requireTeacher,
    teacherController.gradeMyCourseStudent,
);

router.get('/:userId', teacherController.getTeacher);
router.get('/:userId/courses', teacherController.getTeacherCourses);

router.post(
    '/',
    authMiddleware,
    requireAdmin,
    teacherController.createTeacher,
);
router.put(
    '/:userId',
    authMiddleware,
    requireAdmin,
    teacherController.updateTeacher,
);
router.delete(
    '/:userId',
    authMiddleware,
    requireAdmin,
    teacherController.deleteTeacher,
);

router.post(
    '/:userId/courses',
    authMiddleware,
    requireAdmin,
    teacherController.assignCourse,
);
router.delete(
    '/:userId/courses/:courseId',
    authMiddleware,
    requireAdmin,
    teacherController.removeCourse,
);

export default router;
