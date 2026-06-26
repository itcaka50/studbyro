import { Router } from 'express';
import * as curriculumController from '../controllers/curriculum.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/', curriculumController.listCurriculums);

router.use(authMiddleware, requireAdmin);

router.post('/', curriculumController.createCurriculum);
router.post('/:id/courses', curriculumController.addCourseToCurriculum);
router.delete('/:id', curriculumController.deleteCurriculum);

export default router;
