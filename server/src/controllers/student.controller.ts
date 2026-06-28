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
            message: 'Студентът е създаден!',
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
        const facultyNumber = String(req.params.facultyNumber);
        const student = await studentService.getStudentByFacultyNumber(
            facultyNumber,
        );
        res.status(200).json({ success: true, data: student });
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
        const students = await studentService.getAllStudents(req.query as any);
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
        const updatedStudent = await studentService.updateStudent(
            String(req.params.facultyNumber),
            req.body,
        );
        res.status(200).json({
            success: true,
            message: 'Данните са обновени!',
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
        await studentService.deleteStudent(String(req.params.facultyNumber));
        res.status(200).json({ success: true, message: 'Студентът е изтрит.' });
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
        const enrollment = await studentService.enrollStudentInCourse(
            String(req.params.facultyNumber),
            Number(req.body.courseId),
        );
        res.status(201).json({
            success: true,
            message: 'Записан успешно!',
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
        const updatedRecord = await studentService.gradeStudent(
            String(req.params.facultyNumber),
            Number(req.params.courseId),
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

export const getStudentCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const courses = await studentService.getStudentCoursesAndGrades(
            String(req.params.facultyNumber),
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
