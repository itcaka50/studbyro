import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const user = res.locals.user;

    if (!user || !user.isAdmin) {
        return res.status(403).json({
            success: false,
            message:
                'Forbidden: Изискват се администраторски права за това действие!',
        });
    }

    next();
};
