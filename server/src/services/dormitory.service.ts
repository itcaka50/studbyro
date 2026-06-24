import { Dormitory } from '../models/dormitory.model';

export const assignDormitory = async (studentId: string) => {
    const existing = await Dormitory.query().findOne({ studentId });
    if (existing) {
        throw new Error('Студентът вече е настанен в общежитие!');
    }

    return await Dormitory.query().insert({ studentId });
};

export const getAllDormitoryResidents = async () => {
    return await Dormitory.query().withGraphFetched('student.user');
};

export const removeStudentFromDormitory = async (studentId: string) => {
    const deleted = await Dormitory.query().delete().where({ studentId });
    if (deleted === 0)
        throw new Error('Студентът не е намерен в системата на общежитията!');
    return true;
};
