import { Router } from 'express';

import authRoutes from './auth.routes';
import facultyRoutes from './faculties.routes';
import studentRoutes from './students.routes';
import courseRoutes from './courses.routes';
import teacherRoutes from './teachers.routes';
import departmentRoutes from './departments.routes';
import curriculumRoutes from './curriculums.routes';
import scheduleRoutes from './schedules.routes';
import scholarshipRoutes from './scholarships.routes';
import dormitoryRoutes from './dormitories.routes';
import userRoutes from './users.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/faculties', facultyRoutes);
router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/teachers', teacherRoutes);
router.use('/departments', departmentRoutes);
router.use('/curriculums', curriculumRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/scholarships', scholarshipRoutes);
router.use('/dormitories', dormitoryRoutes);
router.use('/users', userRoutes);

export default router;
