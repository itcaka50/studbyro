import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userData = req.body;

        const { user, token } = await authService.registerUser(userData);

        res.status(201).json({
            success: true,
            message: 'Успешна регистрация!',
            data: user,
            token: token,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, username, password } = req.body;

        const loginIdentifier = email || username;

        if (!loginIdentifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Моля, въведете имейл или потребителско име и парола.',
            });
        }

        const { user, token } = await authService.loginUser(
            loginIdentifier,
            password,
        );

        res.status(200).json({
            success: true,
            message: 'Успешен вход!',
            data: user,
            token: token,
        });
    } catch (error) {
        next(error);
    }
};
