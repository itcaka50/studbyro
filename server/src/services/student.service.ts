import { Student, FinancingType } from '../models/student.model';
import { StudentCourse } from '../models/students_courses.model';
import { CurriculumCourse } from '../models/curriculums_courses.model';
import { Curriculum } from '../models/curriculum.model';
import { getSchedulesForCourses } from './schedule.service';

export interface StudentCreateData {
    facultyNumber: string;
    ucn: string;
    financing: FinancingType;
    address: string;
    userId: number;
    curriculumId: number;
}

export const createStudent = async (studentData: StudentCreateData) => {
    const existingUser = await Student.query().findOne({
        userId: studentData.userId,
    });
    if (existingUser) {
        throw new Error('Този потребител вече е регистриран като студент!');
    }

    const existingFacultyNumber = await Student.query().findOne({
        facultyNumber: studentData.facultyNumber,
    });
    if (existingFacultyNumber) {
        throw new Error(
            `Студент с факултетен номер ${studentData.facultyNumber} вече съществува!`,
        );
    }

    return await Student.query().insert(studentData);
};

export const getStudentByUserId = async (userId: number) => {
    const student = await Student.query()
        .findOne({ userId })
        .withGraphFetched('[user, curriculum.[faculty]]');

    if (!student) throw new Error('Студентът не е намерен!');
    return student;
};

export const getStudentByFacultyNumber = async (facultyNumber: string) => {
    const student = await Student.query()
        .findById(facultyNumber)
        .withGraphFetched('[user, curriculum]');

    if (!student) throw new Error('Студентът не е намерен!');
    return student;
};

export const enrollStudentInCourse = async (
    facultyNumber: string,
    courseId: number,
    options: { validateCurriculum?: boolean } = {},
) => {
    if (options.validateCurriculum) {
        const student = await Student.query().findById(facultyNumber);
        if (!student) throw new Error('Студентът не е намерен!');

        const inCurriculum = await CurriculumCourse.query().findOne({
            curriculumId: student.curriculumId,
            courseId,
        });
        if (!inCurriculum) {
            throw new Error('Курсът не е част от вашия учебен план!');
        }
    }

    const existing = await StudentCourse.query().findOne({
        studentId: facultyNumber,
        courseId,
    });
    if (existing) throw new Error('Студентът вече е записан за този курс!');

    return await StudentCourse.query().insert({
        studentId: facultyNumber,
        courseId,
    });
};

export const gradeStudent = async (
    facultyNumber: string,
    courseId: number,
    grade: number,
) => {
    if (grade < 2 || grade > 6) throw new Error('Невалидна оценка (2-6)!');

    const updated = await StudentCourse.query()
        .patch({ grade })
        .where({ studentId: facultyNumber, courseId });

    if (!updated) throw new Error('Записът не е намерен!');
    return await StudentCourse.query().findOne({
        studentId: facultyNumber,
        courseId,
    });
};

export const updateStudent = async (
    facultyNumber: string,
    updateData: Partial<StudentCreateData>,
) => {
    const { facultyNumber: _, userId: __, ...dataToUpdate } = updateData;

    const updatedStudent = await Student.query().patchAndFetchById(
        facultyNumber,
        dataToUpdate,
    );

    if (!updatedStudent) {
        throw new Error('Студентът не е намерен за обновление!');
    }

    return updatedStudent;
};

export const getAllStudents = async (filters: any = {}) => {
    let query = Student.query().withGraphFetched('[user, curriculum]');

    if (filters.curriculumId) {
        query = query.where('curriculumId', filters.curriculumId);
    }

    if (filters.search) {
        query = query.where('facultyNumber', 'ILIKE', `%${filters.search}%`);
    }

    return await query;
};

export const deleteStudent = async (facultyNumber: string) => {
    const deletedRows = await Student.query().deleteById(facultyNumber);
    if (deletedRows === 0) {
        throw new Error('Студентът не е намерен или вече е изтрит.');
    }
    return true;
};

export const getStudentCoursesAndGrades = async (facultyNumber: string) => {
    return await StudentCourse.query()
        .where({ studentId: facultyNumber })
        .withGraphFetched('course');
};

export const getAvailableCoursesForStudent = async (facultyNumber: string) => {
    const student = await Student.query().findById(facultyNumber);
    if (!student) throw new Error('Студентът не е намерен!');

    const curriculum = await Curriculum.query()
        .findById(student.curriculumId)
        .withGraphFetched('courses');

    if (!curriculum) throw new Error('Учебният план не е намерен!');

    const enrolled = await StudentCourse.query().where({ studentId: facultyNumber });
    const enrolledIds = new Set(enrolled.map((row) => row.courseId));

    return (curriculum.courses ?? []).filter(
        (course) => !enrolledIds.has(course.id),
    );
};

export const getStudentSchedule = async (facultyNumber: string) => {
    const enrollments = await StudentCourse.query().where({
        studentId: facultyNumber,
    });
    const courseIds = enrollments.map((row) => row.courseId);
    return getSchedulesForCourses(courseIds);
};

export const getStudentProgram = async (facultyNumber: string) => {
    const student = await Student.query().findById(facultyNumber);
    if (!student) throw new Error('Студентът не е намерен!');

    const curriculum = await Curriculum.query()
        .findById(student.curriculumId)
        .withGraphFetched('courses');

    if (!curriculum) throw new Error('Учебният план не е намерен!');

    const enrolled = await StudentCourse.query().where({
        studentId: facultyNumber,
    });
    const enrolledByCourseId = new Map(
        enrolled.map((row) => [row.courseId, row]),
    );

    return (curriculum.courses ?? []).map((course) => {
        const enrollment = enrolledByCourseId.get(course.id);
        return {
            id: course.id,
            code: course.code,
            name: course.name,
            credits: course.credits,
            enrolled: !!enrollment,
            grade: enrollment?.grade,
        };
    });
};
