import { Course } from '../models/course.model';

export interface CourseCreateData {
    name: string;
    code: string;
    departmentId: number;
    link?: string;
    totalHours?: number;
}

export interface CourseFilters {
    departmentId?: number;
    search?: string;
}

export const createCourse = async (courseData: CourseCreateData) => {
    const existingCourse = await Course.query().findOne({
        code: courseData.code,
    });
    if (existingCourse) {
        throw new Error(`Курс с код ${courseData.code} вече съществува!`);
    }

    const newCourse = await Course.query().insert(courseData);
    return newCourse;
};

export const getCourseById = async (courseId: number) => {
    const course = await Course.query()
        .findById(courseId)
        .withGraphFetched('department');

    if (!course) {
        throw new Error('Курсът не е намерен!');
    }

    return course;
};

export const getAllCourses = async (filters: CourseFilters = {}) => {
    let query = Course.query().withGraphFetched('[department, teachers]');

    if (filters.departmentId) {
        query = query.where('departmentId', filters.departmentId);
    }

    if (filters.search) {
        query = query.where((builder) => {
            builder
                .where('name', 'ILIKE', `%${filters.search}%`)
                .orWhere('code', 'ILIKE', `%${filters.search}%`);
        });
    }

    const courses = await query;
    return courses;
};

export const updateCourse = async (
    courseId: number,
    updateData: Partial<CourseCreateData>,
) => {
    if (updateData.code) {
        const existingCode = await Course.query()
            .where('code', updateData.code)
            .whereNot('id', courseId)
            .first();

        if (existingCode) {
            throw new Error('Този код вече се използва от друг курс!');
        }
    }

    const updatedCourse = await Course.query().patchAndFetchById(
        courseId,
        updateData,
    );

    if (!updatedCourse) {
        throw new Error('Курсът не е намерен за обновление!');
    }

    return updatedCourse;
};

export const deleteCourse = async (courseId: number) => {
    const deletedRows = await Course.query().deleteById(courseId);

    if (deletedRows === 0) {
        throw new Error('Курсът не е намерен или вече е изтрит.');
    }

    return true;
};
