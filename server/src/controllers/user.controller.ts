import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { hashPassword } from '../utils/hash.util';
import { User } from '../models/user.model';

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

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { role_type, profile_data, password, is_admin, ...baseUserData } =
            req.body;

        if (password) {
            baseUserData.passwordHash = await hashPassword(password);
        }

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
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.password) {
            updateData.passwordHash = await hashPassword(updateData.password);
            delete updateData.password;
        }

        if (updateData.is_admin !== undefined) {
            updateData.isAdmin = Boolean(updateData.is_admin);
            delete updateData.is_admin;
        }

        const updatedUser = await User.query().patchAndFetchById(
            Number(id),
            updateData,
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Потребителят не е намерен!',
            });
        }

        const { passwordHash, ...safeUserData } = updatedUser as any;

        res.status(200).json({
            success: true,
            message: 'Данните са обновени успешно!',
            data: safeUserData,
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
