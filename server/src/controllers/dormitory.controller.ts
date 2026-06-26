import { Request, Response, NextFunction } from 'express';
import * as dormitoryService from '../services/dormitory.service';

export const assignStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { studentId } = req.body;
        const assignment = await dormitoryService.assignDormitory(studentId);

        res.status(201).json({
            success: true,
            message: 'Студентът е настанен в общежитие успешно!',
            data: assignment,
        });
    } catch (error) {
        next(error);
    }
};

export const getDormitoryResidents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const residents = await dormitoryService.getAllDormitoryResidents();

        res.status(200).json({
            success: true,
            count: residents.length,
            data: residents,
        });
    } catch (error) {
        next(error);
    }
};

export const removeStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { studentId } = req.params;
        await dormitoryService.removeStudentFromDormitory(studentId as string);

        res.status(200).json({
            success: true,
            message: `Студентът с факултетен номер ${studentId} е отписан от общежитието.`,
        });
    } catch (error) {
        next(error);
    }
};
