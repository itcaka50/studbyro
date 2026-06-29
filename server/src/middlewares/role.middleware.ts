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

export const requireStudent = (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    const user = res.locals.user;

    if (!user?.student) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Достъпът е само за студенти!',
        });
    }

    next();
};

export const requireTeacher = (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    const user = res.locals.user;

    if (!user?.teacher) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Достъпът е само за преподаватели!',
        });
    }

    next();
};
