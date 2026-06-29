import { Request, Response, NextFunction } from 'express';
import * as teacherService from '../services/teacher.service';
import * as studentService from '../services/student.service';

export const createTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teacherData = req.body;
        const newTeacher = await teacherService.createTeacher(teacherData);

        res.status(201).json({
            success: true,
            message: 'Преподавателят е добавен успешно!',
            data: newTeacher,
        });
    } catch (error) {
        next(error);
    }
};

export const getTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        const teacher = await teacherService.getTeacherById(Number(userId));

        res.status(200).json({
            success: true,
            data: teacher,
        });
    } catch (error) {
        next(error);
    }
};

export const listTeachers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const filters = req.query;
        const teachers = await teacherService.getAllTeachers(filters);

        res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        const updatedTeacher = await teacherService.updateTeacher(
            Number(userId),
            updateData,
        );

        res.status(200).json({
            success: true,
            message: 'Данните на преподавателя са обновени!',
            data: updatedTeacher,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;

        await teacherService.deleteTeacher(Number(userId));

        res.status(200).json({
            success: true,
            message: `Преподавателят с ID ${userId} беше изтрит.`,
        });
    } catch (error) {
        next(error);
    }
};

export const assignCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        const { courseId } = req.body;

        const assignment = await teacherService.assignTeacherToCourse(
            Number(userId),
            Number(courseId),
        );

        res.status(201).json({
            success: true,
            message: 'Преподавателят е разпределен към курса успешно!',
            data: assignment,
        });
    } catch (error) {
        next(error);
    }
};

export const removeCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId, courseId } = req.params;

        await teacherService.removeTeacherFromCourse(
            Number(userId),
            Number(courseId),
        );

        res.status(200).json({
            success: true,
            message: 'Преподавателят вече не води този курс.',
        });
    } catch (error) {
        next(error);
    }
};

export const getTeacherCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        const courses = await teacherService.getTeacherCourses(Number(userId));

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teacher = await teacherService.getTeacherById(res.locals.user.id);
        res.status(200).json({ success: true, data: teacher });
    } catch (error) {
        next(error);
    }
};

export const getMyCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const courses = await teacherService.getTeacherCourses(
            res.locals.user.id,
        );
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyCourseStudents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const students = await teacherService.getStudentsInTeacherCourse(
            res.locals.user.id,
            Number(req.params.courseId),
        );
        res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });
    } catch (error) {
        next(error);
    }
};

export const gradeMyCourseStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const courseId = Number(req.params.courseId);
        const teaches = await teacherService.teacherTeachesCourse(
            res.locals.user.id,
            courseId,
        );
        if (!teaches) {
            return res.status(403).json({
                success: false,
                message: 'Не водите този курс!',
            });
        }

        const updatedRecord = await studentService.gradeStudent(
            String(req.params.facultyNumber),
            courseId,
            Number(req.body.grade),
        );

        res.status(200).json({
            success: true,
            message: 'Оценката е нанесена!',
            data: updatedRecord,
        });
    } catch (error) {
        next(error);
    }
};

export const getMySchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const schedule = await teacherService.getTeacherSchedule(
            res.locals.user.id,
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
