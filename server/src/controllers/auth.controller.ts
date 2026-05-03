import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userData = req.body;

        const newUser = await authService.registerUser(userData);

        res.status(201).json({
            success: true,
            message: 'Успешна регистрация!',
            data: newUser,
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
        const { email, password } = req.body;

        const user = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Успешен вход!',
            data: user,
            //JWT TOKEN !!!!
        });
    } catch (error) {
        next(error);
    }
};
