import { Curriculum } from '../models/curriculum.model';
import { CurriculumCourse } from '../models/curriculums_courses.model';
import { Faculty } from '../models/faculty.model';

export interface CurriculumCreateData {
    name: string;
    facultyId: number;
    startYear: Date;
    educationForm: 'задочно' | 'редовно';
    semesterCount: number;
    type: 'бакалавър' | 'магистър' | 'доктор';
    link?: string;
}

const normalizeCurriculumData = (
    data: Partial<CurriculumCreateData & { startYear?: string | Date }>,
): Partial<CurriculumCreateData> => {
    const normalized = { ...data } as Partial<CurriculumCreateData>;
    if (typeof normalized.startYear === 'string') {
        normalized.startYear = new Date(normalized.startYear);
    }
    return normalized;
};

export const createCurriculum = async (
    data: CurriculumCreateData & { startYear?: string | Date },
) => {
    const normalized = normalizeCurriculumData(data) as CurriculumCreateData;
    const existing = await Curriculum.query().findOne({ name: normalized.name });
    if (existing) {
        throw new Error(`Учебен план с име "${normalized.name}" вече съществува!`);
    }

    const facultyExists = await Faculty.query().findById(normalized.facultyId);
    if (!facultyExists) {
        throw new Error('Избраният факултет не съществува!');
    }

    return await Curriculum.query().insert(normalized);
};

export const getAllCurriculums = async (facultyId?: number) => {
    let query = Curriculum.query().withGraphFetched('faculty');
    if (facultyId) {
        query = query.where('facultyId', facultyId);
    }
    return await query;
};

export const getCurriculumById = async (id: number) => {
    const curriculum = await Curriculum.query()
        .findById(id)
        .withGraphFetched('[faculty, courses]');

    if (!curriculum) throw new Error('Учебният план не е намерен!');
    return curriculum;
};

export const updateCurriculum = async (
    id: number,
    data: Partial<CurriculumCreateData & { startYear?: string | Date }>,
) => {
    const normalized = normalizeCurriculumData(data);
    if (normalized.name) {
        const existing = await Curriculum.query()
            .where('name', normalized.name)
            .whereNot('id', id)
            .first();
        if (existing) {
            throw new Error(
                `Учебен план с име "${normalized.name}" вече съществува!`,
            );
        }
    }

    if (normalized.facultyId) {
        const facultyExists = await Faculty.query().findById(
            normalized.facultyId,
        );
        if (!facultyExists) {
            throw new Error('Избраният факултет не съществува!');
        }
    }

    const updated = await Curriculum.query().patchAndFetchById(id, normalized);
    if (!updated) throw new Error('Учебният план не е намерен!');
    return updated;
};

export const addCourseToCurriculum = async (
    curriculumId: number,
    courseId: number,
    credits: number,
) => {
    const curriculum = await Curriculum.query().findById(curriculumId);
    if (!curriculum) throw new Error('Учебният план не е намерен!');

    const existing = await CurriculumCourse.query().findOne({
        curriculumId,
        courseId,
    });
    if (existing) throw new Error('Този курс вече е добавен!');

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
