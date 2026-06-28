import { Request, Response, NextFunction } from 'express';
import * as scheduleService from '../services/schedule.service';

export const listSchedules = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const schedules = await scheduleService.getAllSchedules();

        res.status(200).json({
            success: true,
            count: schedules.length,
            data: schedules,
        });
    } catch (error) {
        next(error);
    }
};

export const createScheduleRecord = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const newRecord = await scheduleService.createScheduleRecord(req.body);

        res.status(201).json({
            success: true,
            message: 'Записът в графика е създаден успешно!',
            data: newRecord,
        });
    } catch (error) {
        next(error);
    }
};

export const getCourseSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { courseId } = req.params;
        const schedule = await scheduleService.getCourseSchedule(
            Number(courseId),
        );

        res.status(200).json({
            success: true,
            count: schedule.length,
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};

export const updateScheduleRecord = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const updatedRecord = await scheduleService.updateScheduleRecord(
            Number(id),
            req.body,
        );

        res.status(200).json({
            success: true,
            message: 'Графикът е обновен успешно!',
            data: updatedRecord,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteScheduleRecord = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        await scheduleService.deleteScheduleRecord(Number(id));

        res.status(200).json({
            success: true,
            message: `Записът от графика с ID ${id} беше изтрит.`,
        });
    } catch (error) {
        next(error);
    }
};
