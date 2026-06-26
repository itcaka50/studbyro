import { Router } from 'express';
import * as scheduleController from '../controllers/schedule.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/course/:courseId', scheduleController.getCourseSchedule);

router.post(
    '/',
    authMiddleware,
    requireAdmin,
    scheduleController.createScheduleRecord,
);
router.put(
    '/:id',
    authMiddleware,
    requireAdmin,
    scheduleController.updateScheduleRecord,
);
router.delete(
    '/:id',
    authMiddleware,
    requireAdmin,
    scheduleController.deleteScheduleRecord,
);

export default router;
