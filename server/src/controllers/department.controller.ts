import { Request, Response, NextFunction } from 'express';
import * as departmentService from '../services/department.service';

export const createDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const departmentData = req.body;
        const newDepartment =
            await departmentService.createDepartment(departmentData);

        res.status(201).json({
            success: true,
            message: 'Катедрата е създадена успешно!',
            data: newDepartment,
        });
    } catch (error) {
        next(error);
    }
};

export const getDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const department = await departmentService.getDepartmentById(
            Number(id),
        );

        res.status(200).json({
            success: true,
            data: department,
        });
    } catch (error) {
        next(error);
    }
};

export const listDepartments = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const filters = req.query;
        const departments = await departmentService.getAllDepartments(filters);

        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedDepartment = await departmentService.updateDepartment(
            Number(id),
            updateData,
        );

        res.status(200).json({
            success: true,
            message: 'Катедрата е обновена успешно!',
            data: updatedDepartment,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        await departmentService.deleteDepartment(Number(id));

        res.status(200).json({
            success: true,
            message: `Катедрата с ID ${id} беше изтрита.`,
        });
    } catch (error) {
        next(error);
    }
};
