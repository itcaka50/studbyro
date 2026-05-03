import { User } from '../models/user';

export const getUserProfile = async (userId: number) => {
    const user = await User.query().findById(userId);

    if (!user) {
        throw new Error('Потребителят не е намерен!');
    }

    const { passwordHash, ...safeUserData } = user;

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

    const { passwordHash, ...safeUserData } = updatedUser;
    return safeUserData;
};

export const getAllUsers = async (filters: any = {}) => {
    let query = User.query();

    if (filters.isAdmin !== undefined) {
        const isAdminFilter = filters.isAdmin === 'true';
        query = query.where('isAdmin', isAdminFilter);
    }

    if (filters.name) {
        query = query.where('name', 'ILIKE', `%${filters.name}%`);
    }

    const users = await query;

    return users.map((user) => {
        const { passwordHash, ...safeUser } = user;
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
