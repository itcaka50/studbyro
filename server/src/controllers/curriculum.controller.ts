import { Request, Response, NextFunction } from 'express';
import * as curriculumService from '../services/curriculum.service';

export const createCurriculum = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const newCurriculum = await curriculumService.createCurriculum(
            req.body,
        );

        res.status(201).json({
            success: true,
            message: 'Учебният план е създаден успешно!',
            data: newCurriculum,
        });
    } catch (error) {
        next(error);
    }
};

export const listCurriculums = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const facultyId = req.query.facultyId
            ? Number(req.query.facultyId)
            : undefined;
        const curriculums =
            await curriculumService.getAllCurriculums(facultyId);

        res.status(200).json({
            success: true,
            count: curriculums.length,
            data: curriculums,
        });
    } catch (error) {
        next(error);
    }
};

export const addCourseToCurriculum = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const { courseId, credits } = req.body;

        const addedCourse = await curriculumService.addCourseToCurriculum(
            Number(id),
            Number(courseId),
            Number(credits),
        );

        res.status(201).json({
            success: true,
            message: 'Курсът е добавен към учебния план успешно!',
            data: addedCourse,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCurriculum = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        await curriculumService.deleteCurriculum(Number(id));

        res.status(200).json({
            success: true,
            message: `Учебният план с ID ${id} беше изтрит.`,
        });
    } catch (error) {
        next(error);
    }
};
