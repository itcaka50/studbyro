import { Faculty } from '../models/faculty.model';

export interface FacultyCreateData {
    name: string;
    code: string;
}

export interface FacultyFilters {
    search?: string;
}

export const createFaculty = async (facultyData: FacultyCreateData) => {
    const existingFaculty = await Faculty.query().findOne({
        name: facultyData.name,
    });

    if (existingFaculty) {
        throw new Error(
            `Факултет с име "${facultyData.name}" вече съществува!`,
        );
    }

    const newFaculty = await Faculty.query().insert(facultyData);
    return newFaculty;
};

export const getFacultyById = async (facultyId: number) => {
    const faculty = await Faculty.query().findById(facultyId);

    if (!faculty) {
        throw new Error('Факултетът не е намерен!');
    }

    return faculty;
};

export const getAllFaculties = async (filters: FacultyFilters = {}) => {
    let query = Faculty.query();

    if (filters.search) {
        query = query.where('name', 'ILIKE', `%${filters.search}%`);
    }

    query = query.orderBy('name', 'ASC');

    const faculties = await query;
    return faculties;
};

export const updateFaculty = async (
    facultyId: number,
    updateData: Partial<FacultyCreateData>,
) => {
    if (updateData.name) {
        const existingName = await Faculty.query()
            .where('name', updateData.name)
            .whereNot('id', facultyId)
            .first();

        if (existingName) {
            throw new Error(
                `Факултет с име "${updateData.name}" вече съществува!`,
            );
        }
    }

    const updatedFaculty = await Faculty.query().patchAndFetchById(
        facultyId,
        updateData,
    );

    if (!updatedFaculty) {
        throw new Error('Факултетът не е намерен за обновление!');
    }

    return updatedFaculty;
};

export const deleteFaculty = async (facultyId: number) => {
    const deletedRows = await Faculty.query().deleteById(facultyId);

    if (deletedRows === 0) {
        throw new Error('Факултетът не е намерен или вече е изтрит.');
    }

    return true;
};
