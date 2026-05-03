import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = res.locals.user;

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = res.locals.user.id;
        const updateData = req.body;

        const updatedUser = await userService.updateUserProfile(
            userId,
            updateData,
        );

        res.status(200).json({
            success: true,
            message: 'Профилът е обновен успешно!',
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

export const listUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const filters = req.query;

        const users = await userService.getAllUsers(filters);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        await userService.deleteUser(Number(id));

        res.status(200).json({
            success: true,
            message: `Потребител с ID ${id} беше изтрит.`,
        });
    } catch (error) {
        next(error);
    }
};
