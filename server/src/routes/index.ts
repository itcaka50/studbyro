import { Router } from 'express';

import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import coursesRoutes from './courses.routes';
import facultiesRoutes from './faculties.routes';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/courses', coursesRoutes);
router.use('/faculties', facultiesRoutes);
