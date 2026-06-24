import { Department } from '../models/department.model';

export interface DepartmentCreateData {
    name: string;
    facultyId: number;
}

export interface DepartmentFilters {
    facultyId?: number;
    search?: string;
}

export const createDepartment = async (
    departmentData: DepartmentCreateData,
) => {
    const existingDepartment = await Department.query().findOne({
        name: departmentData.name,
    });

    if (existingDepartment) {
        throw new Error(
            `Катедра с име "${departmentData.name}" вече съществува!`,
        );
    }

    const newDepartment = await Department.query().insert(departmentData);
    return newDepartment;
};

export const getDepartmentById = async (departmentId: number) => {
    const department = await Department.query()
        .findById(departmentId)
        .withGraphFetched('faculty');

    if (!department) {
        throw new Error('Катедрата не е намерена!');
    }

    return department;
};

export const getAllDepartments = async (filters: DepartmentFilters = {}) => {
    let query = Department.query().withGraphFetched('faculty');

    if (filters.facultyId) {
        query = query.where('facultyId', filters.facultyId);
    }

    if (filters.search) {
        query = query.where('name', 'ILIKE', `%${filters.search}%`);
    }

    query = query.orderBy('name', 'ASC');

    const departments = await query;
    return departments;
};

export const updateDepartment = async (
    departmentId: number,
    updateData: Partial<DepartmentCreateData>,
) => {
    if (updateData.name) {
        const existingName = await Department.query()
            .where('name', updateData.name)
            .whereNot('id', departmentId)
            .first();

        if (existingName) {
            throw new Error(
                `Катедра с име "${updateData.name}" вече съществува!`,
            );
        }
    }

    const updatedDepartment = await Department.query().patchAndFetchById(
        departmentId,
        updateData,
    );

    if (!updatedDepartment) {
        throw new Error('Катедрата не е намерена за обновление!');
    }

    return updatedDepartment;
};

export const deleteDepartment = async (departmentId: number) => {
    const deletedRows = await Department.query().deleteById(departmentId);

    if (deletedRows === 0) {
        throw new Error('Катедрата не е намерена или вече е изтрита.');
    }

    return true;
};
