import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { hashPassword } from '../utils/hash.util';
import { validatePassword } from '../utils/password.util';

const rejectPasswordFields = (body: Record<string, unknown>) => {
    if (
        body.password !== undefined ||
        body.passwordHash !== undefined ||
        body.currentPassword !== undefined ||
        body.newPassword !== undefined
    ) {
        const error = new Error(
            'Администраторът не може да променя паролата на потребител.',
        ) as Error & {status: number};
        error.status = 400;
        throw error;
    }
};

export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = res.locals.user.id;
        const fullProfile = await userService.getUserProfile(userId);

        res.status(200).json({
            success: true,
            data: fullProfile,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = res.locals.user.id;
        rejectPasswordFields(req.body);

        const updatedUser = await userService.updateUserProfile(
            userId,
            req.body,
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

export const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = res.locals.user.id;
        const {currentPassword, newPassword} = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Моля, въведете текуща и нова парола.',
            });
        }

        await userService.changeUserPassword(
            userId,
            currentPassword,
            newPassword,
        );

        res.status(200).json({
            success: true,
            message: 'Паролата е сменена успешно!',
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

export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {id} = req.params;
        const user = await userService.getUserProfile(Number(id));

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {role_type, profile_data, password, is_admin, ...baseUserData} =
            req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Паролата е задължителна при създаване на потребител.',
            });
        }

        validatePassword(password);
        baseUserData.passwordHash = await hashPassword(password);

        if (is_admin !== undefined) {
            baseUserData.isAdmin = Boolean(is_admin);
        }

        const newUser = await userService.createUserWithRole(
            baseUserData,
            profile_data,
            role_type || 'user',
        );

        res.status(201).json({
            success: true,
            message: 'Потребителят е създаден успешно!',
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {id} = req.params;
        rejectPasswordFields(req.body);

        const {is_admin, profile_data, ...userData} = req.body;

        if (is_admin !== undefined) {
            userData.isAdmin = Boolean(is_admin);
        }

        const updatedUser = await userService.adminUpdateUser(
            Number(id),
            userData,
            profile_data,
        );

        res.status(200).json({
            success: true,
            message: 'Данните са обновени успешно!',
            data: updatedUser,
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
        const {id} = req.params;

        await userService.deleteUser(Number(id));

        res.status(200).json({
            success: true,
            message: `Потребител с ID ${id} беше изтрит.`,
        });
    } catch (error) {
        next(error);
    }
};
