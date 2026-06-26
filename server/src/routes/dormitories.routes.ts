import { Router } from 'express';
import * as dormitoryController from '../controllers/dormitory.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', requireAdmin, dormitoryController.getDormitoryResidents);

router.post('/', requireAdmin, dormitoryController.assignStudent);
router.delete('/:studentId', requireAdmin, dormitoryController.removeStudent);

export default router;
