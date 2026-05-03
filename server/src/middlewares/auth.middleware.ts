import { RequestHandler } from 'express';
import * as userService from '../services/user.service';
import * as jwtService from '../utils/jwt.util';
import { User } from '../models/User.model';
// import { AuthenticationError } from '../errors/AuthenticationError';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Locals {
            user: any; // временно any или Omit<User, 'passwordHash'>
        }
    }
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Unauthenticated: Липсва токен');
    }

    const token = authHeader.replace('Bearer ', '');

    const payload = jwtService.verify(token);

    if (!payload || !payload.id) {
        throw new Error('Unauthenticated: Невалиден токен');
    }

    const user = await userService.getUserProfile(payload.id);

    if (!user) {
        throw new Error('Unauthenticated: Потребителят не съществува');
    }

    res.locals = { user };
    next();
};
