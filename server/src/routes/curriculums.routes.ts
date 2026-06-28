import { Router } from 'express';
import * as curriculumController from '../controllers/curriculum.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/', curriculumController.listCurriculums);
router.get('/:id', curriculumController.getCurriculum);

router.use(authMiddleware, requireAdmin);

router.post('/', curriculumController.createCurriculum);
router.put('/:id', curriculumController.updateCurriculum);
router.post('/:id/courses', curriculumController.addCourseToCurriculum);
router.delete('/:id', curriculumController.deleteCurriculum);

export default router;
