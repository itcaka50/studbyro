import { Student, FinancingType } from '../models/student.model';
import { StudentCourse } from '../models/students_courses.model';

export interface StudentCreateData {
    facultyNumber: string;
    ucn: string;
    financing: FinancingType;
    address: string;
    userId: number;
    curriculumId: number;
}

export interface StudentFilters {
    curriculumId?: number;
    financing?: FinancingType;
    search?: string;
}

export const createStudent = async (studentData: StudentCreateData) => {
    const existingFacultyNumber = await Student.query().findById(
        studentData.facultyNumber,
    );
    if (existingFacultyNumber) {
        throw new Error(
            `Студент с факултетен номер ${studentData.facultyNumber} вече съществува!`,
        );
    }

    const existingUcn = await Student.query().findOne({ ucn: studentData.ucn });
    if (existingUcn) {
        throw new Error('Студент с това ЕГН вече съществува!');
    }

    const existingUser = await Student.query().findOne({
        userId: studentData.userId,
    });
    if (existingUser) {
        throw new Error(
            'Този потребителски профил вече е свързан със студентски запис!',
        );
    }

    const newStudent = await Student.query().insert(studentData);
    return newStudent;
};

export const getStudentByFacultyNumber = async (facultyNumber: string) => {
    const student = await Student.query()
        .findById(facultyNumber)
        .withGraphFetched('[user, curriculum]');

    if (!student) {
        throw new Error('Студентът не е намерен!');
    }

    return student;
};

export const getAllStudents = async (filters: StudentFilters = {}) => {
    let query = Student.query().withGraphFetched('[user, curriculum]');

    if (filters.curriculumId) {
        query = query.where('curriculumId', filters.curriculumId);
    }

    if (filters.financing) {
        query = query.where('financing', filters.financing);
    }

    if (filters.search) {
        query = query.where('facultyNumber', 'ILIKE', `%${filters.search}%`);
    }

    return await query;
};

export const updateStudent = async (
    facultyNumber: string,
    updateData: Partial<StudentCreateData>,
) => {
    delete updateData.facultyNumber;
    delete updateData.userId;
    delete updateData.ucn;

    const updatedStudent = await Student.query().patchAndFetchById(
        facultyNumber,
        updateData,
    );

    if (!updatedStudent) {
        throw new Error('Студентът не е намерен за обновление!');
    }

    return updatedStudent;
};

export const deleteStudent = async (facultyNumber: string) => {
    const deletedRows = await Student.query().deleteById(facultyNumber);

    if (deletedRows === 0) {
        throw new Error('Студентът не е намерен или вече е изтрит.');
    }

    return true;
};

export const enrollStudentInCourse = async (
    facultyNumber: string,
    courseId: number,
) => {
    const existingEnrollment = await StudentCourse.query().findOne({
        studentId: facultyNumber,
        courseId,
    });

    if (existingEnrollment) {
        throw new Error('Студентът вече е записан за този курс!');
    }

    const enrollment = await StudentCourse.query().insert({
        studentId: facultyNumber,
        courseId,
    });

    return enrollment;
};

export const gradeStudent = async (
    facultyNumber: string,
    courseId: number,
    grade: number,
) => {
    if (grade < 2 || grade > 6) {
        throw new Error('Невалидна оценка! Оценката трябва да е между 2 и 6.');
    }

    const updatedRecordCount = await StudentCourse.query()
        .patch({ grade })
        .where({ studentId: facultyNumber, courseId });

    if (updatedRecordCount === 0) {
        throw new Error(
            'Студентът не е записан за този курс или записът не е намерен!',
        );
    }

    return await StudentCourse.query().findOne({
        studentId: facultyNumber,
        courseId,
    });
};

export const getStudentCoursesAndGrades = async (facultyNumber: string) => {
    const records = await StudentCourse.query()
        .where({ studentId: facultyNumber })
        .withGraphFetched('course');

    return records;
};
