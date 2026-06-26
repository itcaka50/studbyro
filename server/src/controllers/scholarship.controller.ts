import { Request, Response, NextFunction } from 'express';
import * as scholarshipService from '../services/scholarship.service';

export const applyForScholarship = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const application = await scholarshipService.applyForScholarship(
            req.body,
        );

        res.status(201).json({
            success: true,
            message: 'Кандидатурата за стипендия е подадена успешно!',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

export const getStudentScholarships = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { studentId } = req.params;
        const scholarships = await scholarshipService.getStudentScholarships(
            studentId as string,
        );

        res.status(200).json({
            success: true,
            count: scholarships.length,
            data: scholarships,
        });
    } catch (error) {
        next(error);
    }
};

export const updateScholarshipStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedScholarship =
            await scholarshipService.updateScholarshipStatus(
                Number(id),
                Boolean(status),
            );

        res.status(200).json({
            success: true,
            message: 'Статусът на стипендията е обновен!',
            data: updatedScholarship,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteScholarship = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        await scholarshipService.deleteScholarship(Number(id));

        res.status(200).json({
            success: true,
            message: `Кандидатурата за стипендия с ID ${id} беше изтрита.`,
        });
    } catch (error) {
        next(error);
    }
};
