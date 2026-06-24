// src/services/curriculum.service.ts
import { Curriculum } from '../models/curriculum.model';
import { CurriculumCourse } from '../models/curriculums_courses.model';

export interface CurriculumCreateData {
    name: string;
    facultyId: number;
}

export const createCurriculum = async (data: CurriculumCreateData) => {
    const existing = await Curriculum.query().findOne({ name: data.name });
    if (existing) {
        throw new Error(`Учебен план с име "${data.name}" вече съществува!`);
    }
    return await Curriculum.query().insert(data);
};

export const getAllCurriculums = async (facultyId?: number) => {
    let query = Curriculum.query().withGraphFetched('faculty');
    if (facultyId) {
        query = query.where({ facultyId });
    }
    return await query;
};

export const addCourseToCurriculum = async (
    curriculumId: number,
    courseId: number,
    credits: number,
) => {
    const existing = await CurriculumCourse.query().findOne({
        curriculumId,
        courseId,
    });
    if (existing) {
        throw new Error('Този курс вече е добавен към учебния план!');
    }
    return await CurriculumCourse.query().insert({
        curriculumId,
        courseId,
        credits,
    });
};

export const deleteCurriculum = async (id: number) => {
    const deleted = await Curriculum.query().deleteById(id);
    if (!deleted) throw new Error('Учебният план не е намерен!');
    return true;
};
