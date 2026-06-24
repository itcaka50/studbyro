import { Teacher } from '../models/teacher.model';
import { TeacherCourse } from '../models/teachers_courses.model';

export interface TeacherCreateData {
    userId: number;
    departmentId: number;
}

export interface TeacherFilters {
    departmentId?: number;
}

export const createTeacher = async (teacherData: TeacherCreateData) => {
    const existingTeacher = await Teacher.query().findById(teacherData.userId);
    if (existingTeacher) {
        throw new Error(
            'Този потребителски профил вече е свързан с преподавател!',
        );
    }

    const newTeacher = await Teacher.query().insert(teacherData);
    return newTeacher;
};

export const getTeacherById = async (userId: number) => {
    const teacher = await Teacher.query()
        .findById(userId)
        .withGraphFetched('[user, department]');

    if (!teacher) {
        throw new Error('Преподавателят не е намерен!');
    }

    if (teacher.user) {
        delete (teacher.user as any).passwordHash;
    }

    return teacher;
};

export const getAllTeachers = async (filters: TeacherFilters = {}) => {
    let query = Teacher.query().withGraphFetched('[user, department]');

    if (filters.departmentId) {
        query = query.where('departmentId', filters.departmentId);
    }

    const teachers = await query;

    return teachers.map((teacher) => {
        if (teacher.user) {
            delete (teacher.user as any).passwordHash;
        }
        return teacher;
    });
};

export const updateTeacher = async (
    userId: number,
    updateData: Partial<TeacherCreateData>,
) => {
    delete updateData.userId;

    const updatedTeacher = await Teacher.query().patchAndFetchById(
        userId,
        updateData,
    );

    if (!updatedTeacher) {
        throw new Error('Преподавателят не е намерен за обновление!');
    }

    return updatedTeacher;
};

export const deleteTeacher = async (userId: number) => {
    const deletedRows = await Teacher.query().deleteById(userId);

    if (deletedRows === 0) {
        throw new Error('Преподавателят не е намерен или вече е изтрит.');
    }

    return true;
};

export const assignTeacherToCourse = async (
    userId: number,
    courseId: number,
) => {
    const existingAssignment = await TeacherCourse.query().findOne({
        teacherId: userId,
        courseId,
    });

    if (existingAssignment) {
        throw new Error('Преподавателят вече е разпределен да води този курс!');
    }

    const assignment = await TeacherCourse.query().insert({
        teacherId: userId,
        courseId,
    });

    return assignment;
};

export const removeTeacherFromCourse = async (
    userId: number,
    courseId: number,
) => {
    const deletedRows = await TeacherCourse.query()
        .delete()
        .where({ teacherId: userId, courseId });

    if (deletedRows === 0) {
        throw new Error('Преподавателят не води този курс!');
    }

    return true;
};

export const getTeacherCourses = async (userId: number) => {
    const coursesRecords = await TeacherCourse.query()
        .where({ teacherId: userId })
        .withGraphFetched('course');

    return coursesRecords;
};
