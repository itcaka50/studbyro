import { Router } from 'express';
import * as departmentController from '../controllers/department.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/', departmentController.listDepartments);
router.get('/:id', departmentController.getDepartment);

router.post(
    '/',
    authMiddleware,
    requireAdmin,
    departmentController.createDepartment,
);
router.put(
    '/:id',
    authMiddleware,
    requireAdmin,
    departmentController.updateDepartment,
);
router.delete(
    '/:id',
    authMiddleware,
    requireAdmin,
    departmentController.deleteDepartment,
);

export default router;
