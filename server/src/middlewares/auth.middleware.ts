import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { JwtUtil } from '../utils/jwt.util';

const jwtUtil = new JwtUtil();

declare global {
    namespace Express {
        interface Locals {
            user: Awaited<ReturnType<typeof userService.getUserProfile>>;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthenticated: Липсва токен',
            });
        }

        const token = authHeader.replace('Bearer ', '');

        const payload = jwtUtil.verify(token);

        if (!payload || !payload.id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthenticated: Невалиден или изтекъл токен',
            });
        }

        const user = await userService.getUserProfile(payload.id);

        res.locals.user = user;

        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message:
                error.message ||
                'Unauthenticated: Грешка при проверка на достъпа',
        });
    }
};
