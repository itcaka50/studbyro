import { User } from '../models/user.model';
import { Teacher } from '../models/teacher.model';
import { Student } from '../models/student.model';

export interface UserFilters {
    isAdmin?: string;
    name?: string;
}

export const getUserProfile = async (userId: number) => {
    const user = await User.query()
        .findById(userId)
        .withGraphFetched('[student, teacher]');

    if (!user) {
        throw new Error('Потребителят не е намерен!');
    }

    const { passwordHash, ...safeUserData } = user as any;

    return safeUserData;
};

export const updateUserProfile = async (
    userId: number,
    updateData: Partial<User>,
) => {
    delete updateData.passwordHash;
    delete updateData.isAdmin;

    const updatedUser = await User.query().patchAndFetchById(
        userId,
        updateData,
    );

    if (!updatedUser) {
        throw new Error('Потребителят не е намерен за обновление!');
    }

    const { passwordHash, ...safeUserData } = updatedUser as any;
    return safeUserData;
};

export const getAllUsers = async (filters: UserFilters = {}) => {
    let query = User.query().withGraphFetched('[student, teacher]');

    if (filters.isAdmin !== undefined) {
        query = query.where('isAdmin', filters.isAdmin === 'true');
    }

    if (filters.name) {
        query = query.where('name', 'ILIKE', `%${filters.name}%`);
    }

    const users = await query;

    return users.map((user) => {
        const { passwordHash, ...safeUser } = user as any;
        return safeUser;
    });
};

export const deleteUser = async (userId: number) => {
    const deletedRows = await User.query().deleteById(userId);

    if (deletedRows === 0) {
        throw new Error('Потребителят не е намерен или вече е изтрит.');
    }

    return true;
};

export const createUserWithRole = async (
    userData: any,
    roleData: any,
    role: 'student' | 'teacher' | 'user',
) => {
    return await User.transaction(async (trx) => {
        const user = await User.query(trx).insert(userData);

        if (role === 'student' && roleData) {
            await Student.query(trx).insert({ ...roleData, userId: user.id });
        } else if (role === 'teacher' && roleData) {
            await Teacher.query(trx).insert({ ...roleData, userId: user.id });
        }

        const fullUser = await User.query(trx)
            .findById(user.id)
            .withGraphFetched('[student, teacher]');

        const { passwordHash, ...safeUser } = fullUser as any;
        return safeUser;
    });
};
