import { Request, Response, NextFunction } from 'express';
import * as courseService from '../services/course.service';
import * as teacherService from '../services/teacher.service';

export const createCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const courseData = req.body;
        const newCourse = await courseService.createCourse(courseData);

        res.status(201).json({
            success: true,
            message: 'Курсът е създаден успешно!',
            data: newCourse,
        });
    } catch (error) {
        next(error);
    }
};

export const getCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const course = await courseService.getCourseById(Number(id));

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

export const listCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const filters = req.query;
        const courses = await courseService.getAllCourses(filters);

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedCourse = await courseService.updateCourse(
            Number(id),
            updateData,
        );

        res.status(200).json({
            success: true,
            message: 'Курсът е обновен успешно!',
            data: updatedCourse,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        await courseService.deleteCourse(Number(id));

        res.status(200).json({
            success: true,
            message: `Курсът с ID ${id} беше изтрит успешно.`,
        });
    } catch (error) {
        next(error);
    }
};

export const assignTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const courseId = Number(req.params.id);
        const userId = Number(req.body.userId);

        const assignment = await teacherService.assignTeacherToCourse(
            userId,
            courseId,
        );

        res.status(201).json({
            success: true,
            message: 'Преподавателят е назначен към курса!',
            data: assignment,
        });
    } catch (error) {
        next(error);
    }
};

export const removeTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await teacherService.removeTeacherFromCourse(
            Number(req.params.userId),
            Number(req.params.id),
        );

        res.status(200).json({
            success: true,
            message: 'Преподавателят е премахнат от курса.',
        });
    } catch (error) {
        next(error);
    }
};
