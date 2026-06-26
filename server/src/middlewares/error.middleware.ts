import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { UniqueViolationError, NotFoundError } from 'objection';

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Невалидни входни данни',
            errors: err.flatten().fieldErrors,
        });
    }

    if (err instanceof UniqueViolationError) {
        return res.status(409).json({
            success: false,
            message: 'Този запис вече съществува в базата данни.',
            columns: err.columns,
        });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).json({
            success: false,
            message: 'Търсеният ресурс не е намерен в базата данни.',
        });
    }

    console.error('[Error]:', err.message || err);

    const statusCode = err.status || err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Възникна неочаквана грешка в сървъра.',
    });
};
