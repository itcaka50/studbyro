import { Request, Response, NextFunction } from 'express';
import * as facultyService from '../services/faculty.service';

export const createFaculty = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const facultyData = req.body;
        const newFaculty = await facultyService.createFaculty(facultyData);

        res.status(201).json({
            success: true,
            message: 'Факултетът е създаден успешно!',
            data: newFaculty,
        });
    } catch (error) {
        next(error);
    }
};

export const getFaculty = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const faculty = await facultyService.getFacultyById(Number(id));

        res.status(200).json({
            success: true,
            data: faculty,
        });
    } catch (error) {
        next(error);
    }
};

export const listFaculties = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const filters = req.query;
        const faculties = await facultyService.getAllFaculties(filters);

        res.status(200).json({
            success: true,
            count: faculties.length,
            data: faculties,
        });
    } catch (error) {
        next(error);
    }
};

export const updateFaculty = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedFaculty = await facultyService.updateFaculty(
            Number(id),
            updateData,
        );

        res.status(200).json({
            success: true,
            message: 'Факултетът е обновен успешно!',
            data: updatedFaculty,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteFaculty = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        await facultyService.deleteFaculty(Number(id));

        res.status(200).json({
            success: true,
            message: `Факултетът с ID ${id} беше изтрит.`,
        });
    } catch (error) {
        next(error);
    }
};
