import { Request, Response, NextFunction } from 'express';
import * as studentService from '../services/student.service';

export const createStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const newStudent = await studentService.createStudent(req.body);

        res.status(201).json({
            success: true,
            message: 'Студентският запис е създаден успешно!',
            data: newStudent,
        });
    } catch (error) {
        next(error);
    }
};

export const getStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { facultyNumber } = req.params;
        const student = await studentService.getStudentByFacultyNumber(
            facultyNumber as string,
        );

        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        next(error);
    }
};

export const listStudents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const filters = req.query;
        const students = await studentService.getAllStudents(filters);

        res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });
    } catch (error) {
        next(error);
    }
};

export const updateStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { facultyNumber } = req.params;
        const updatedStudent = await studentService.updateStudent(
            facultyNumber as string,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: 'Данните на студента бяха обновени успешно!',
            data: updatedStudent,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { facultyNumber } = req.params;
        await studentService.deleteStudent(facultyNumber as string);

        res.status(200).json({
            success: true,
            message: `Студентът с факултетен номер ${facultyNumber} беше изтрит.`,
        });
    } catch (error) {
        next(error);
    }
};

export const enrollInCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { facultyNumber } = req.params;
        const { courseId } = req.body;

        const enrollment = await studentService.enrollStudentInCourse(
            facultyNumber as string,
            Number(courseId),
        );

        res.status(201).json({
            success: true,
            message: 'Студентът беше записан за курса успешно!',
            data: enrollment,
        });
    } catch (error) {
        next(error);
    }
};

export const gradeStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { facultyNumber, courseId } = req.params;
        const { grade } = req.body;
        const updatedRecord = await studentService.gradeStudent(
            facultyNumber as string,
            Number(courseId),
            Number(grade),
        );

        res.status(200).json({
            success: true,
            message: 'Оценката е нанесена успешно!',
            data: updatedRecord,
        });
    } catch (error) {
        next(error);
    }
};

export const getStudentCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { facultyNumber } = req.params;
        const courses = await studentService.getStudentCoursesAndGrades(
            facultyNumber as string,
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
