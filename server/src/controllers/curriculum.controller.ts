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

export const getCurriculum = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const curriculum = await curriculumService.getCurriculumById(
            Number(req.params.id),
        );

        res.status(200).json({
            success: true,
            data: curriculum,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCurriculum = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const updated = await curriculumService.updateCurriculum(
            Number(req.params.id),
            req.body,
        );

        res.status(200).json({
            success: true,
            message: 'Учебният план е обновен успешно!',
            data: updated,
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

export const updateCurriculumCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const updated = await curriculumService.updateCurriculumCourse(
            Number(req.params.id),
            Number(req.params.courseId),
            Number(req.body.credits),
        );

        res.status(200).json({
            success: true,
            message: 'Кредитите са обновени!',
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

export const removeCourseFromCurriculum = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await curriculumService.removeCourseFromCurriculum(
            Number(req.params.id),
            Number(req.params.courseId),
        );

        res.status(200).json({
            success: true,
            message: 'Курсът е премахнат от учебния план.',
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
