import { Scholarship } from '../models/scholarship.model';

export interface ScholarshipCreateData {
    type: string;
    studentId: string;
}

export const applyForScholarship = async (data: ScholarshipCreateData) => {
    const existing = await Scholarship.query().findOne({
        studentId: data.studentId,
        type: data.type,
    });

    if (existing) {
        throw new Error(
            'Вече имате подадена кандидатура за този тип стипендия!',
        );
    }

    return await Scholarship.query().insert({
        ...data,
        status: false,
    });
};

export const getStudentScholarships = async (studentId: string) => {
    return await Scholarship.query().where({ studentId });
};

export const updateScholarshipStatus = async (id: number, status: boolean) => {
    const updated = await Scholarship.query().patchAndFetchById(id, { status });
    if (!updated) throw new Error('Стипендията не е намерена!');
    return updated;
};

export const deleteScholarship = async (id: number) => {
    const deleted = await Scholarship.query().deleteById(id);
    if (!deleted) throw new Error('Стипендията не е намерена!');
    return true;
};
