import { Router } from 'express';
import * as scholarshipController from '../controllers/scholarship.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/student/:studentId', scholarshipController.getStudentScholarships);

router.post('/', scholarshipController.applyForScholarship);

router.put(
    '/:id/status',
    requireAdmin,
    scholarshipController.updateScholarshipStatus,
);
router.delete('/:id', requireAdmin, scholarshipController.deleteScholarship);

export default router;
