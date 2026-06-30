import { User } from '../models/user.model';
import { Teacher } from '../models/teacher.model';
import { Student } from '../models/student.model';
import { hashPassword, comparePasswords } from '../utils/hash.util';
import { validatePassword } from '../utils/password.util';

export interface UserFilters {
    isAdmin?: string;
    name?: string;
}

export interface UserProfileUpdateData {
    username?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
}

export interface AdminUserUpdateData extends UserProfileUpdateData {
    isAdmin?: boolean;
}

const badRequest = (message: string) => {
    const error = new Error(message) as Error & {status: number};
    error.status = 400;
    return error;
};

const assertUniqueUserFields = async (
    data: UserProfileUpdateData,
    excludeUserId: number,
) => {
    if (data.email) {
        const existing = await User.query()
            .findOne({email: data.email})
            .whereNot('id', excludeUserId);
        if (existing) {
            throw badRequest('Потребител с този имейл вече съществува!');
        }
    }

    if (data.username) {
        const existing = await User.query()
            .findOne({username: data.username})
            .whereNot('id', excludeUserId);
        if (existing) {
            throw badRequest('Това потребителско име вече се използва!');
        }
    }

    if (data.phoneNumber) {
        const existing = await User.query()
            .findOne({phoneNumber: data.phoneNumber})
            .whereNot('id', excludeUserId);
        if (existing) {
            throw badRequest(
                'Потребител с този телефонен номер вече съществува!',
            );
        }
    }
};

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
    updateData: UserProfileUpdateData,
) => {
    const sanitized: UserProfileUpdateData = {};
    for (const key of ['username', 'name', 'email', 'phoneNumber'] as const) {
        if (updateData[key] !== undefined) {
            sanitized[key] = updateData[key];
        }
    }

    if (Object.keys(sanitized).length === 0) {
        throw badRequest('Няма данни за обновяване.');
    }

    await assertUniqueUserFields(sanitized, userId);

    const updatedUser = await User.query().patchAndFetchById(userId, sanitized);

    if (!updatedUser) {
        throw new Error('Потребителят не е намерен за обновление!');
    }

    return getUserProfile(userId);
};

export const changeUserPassword = async (
    userId: number,
    currentPassword: string,
    newPassword: string,
) => {
    const user = await User.query().findById(userId);
    if (!user) {
        throw new Error('Потребителят не е намерен!');
    }

    const isCurrentValid = await comparePasswords(
        currentPassword,
        user.passwordHash,
    );
    if (!isCurrentValid) {
        throw badRequest('Текущата парола е грешна.');
    }

    validatePassword(newPassword);

    if (currentPassword === newPassword) {
        throw badRequest('Новата парола трябва да е различна от текущата.');
    }

    await User.query().patchAndFetchById(userId, {
        passwordHash: await hashPassword(newPassword),
    });

    return true;
};

export const adminUpdateUser = async (
    userId: number,
    userData: AdminUserUpdateData,
    profileData?: Record<string, unknown>,
) => {
    const sanitized: AdminUserUpdateData = {};
    if (userData.username !== undefined) sanitized.username = userData.username;
    if (userData.name !== undefined) sanitized.name = userData.name;
    if (userData.email !== undefined) sanitized.email = userData.email;
    if (userData.phoneNumber !== undefined) {
        sanitized.phoneNumber = userData.phoneNumber;
    }
    if (userData.isAdmin !== undefined) sanitized.isAdmin = userData.isAdmin;

    if (Object.keys(sanitized).length === 0 && !profileData) {
        throw badRequest('Няма данни за обновяване.');
    }

    if (Object.keys(sanitized).length > 0) {
        await assertUniqueUserFields(sanitized, userId);
    }

    return await User.transaction(async (trx) => {
        if (Object.keys(sanitized).length > 0) {
            const updatedUser = await User.query(trx).patchAndFetchById(
                userId,
                sanitized,
            );
            if (!updatedUser) {
                throw new Error('Потребителят не е намерен!');
            }
        }

        if (profileData && Object.keys(profileData).length > 0) {
            const student = await Student.query(trx).findOne({userId});
            if (student) {
                const studentPatch: Record<string, unknown> = {};
                if (profileData.ucn !== undefined) {
                    studentPatch.ucn = profileData.ucn;
                }
                if (profileData.financing !== undefined) {
                    studentPatch.financing = profileData.financing;
                }
                if (profileData.address !== undefined) {
                    studentPatch.address = profileData.address;
                }
                if (profileData.curriculumId !== undefined) {
                    studentPatch.curriculumId = Number(profileData.curriculumId);
                }
                if (Object.keys(studentPatch).length > 0) {
                    await Student.query(trx).patchAndFetchById(
                        student.facultyNumber,
                        studentPatch,
                    );
                }
            } else {
                const teacher = await Teacher.query(trx).findById(userId);
                if (teacher && profileData.departmentId !== undefined) {
                    await Teacher.query(trx).patchAndFetchById(userId, {
                        departmentId: Number(profileData.departmentId),
                    });
                }
            }
        }

        const fullUser = await User.query(trx)
            .findById(userId)
            .withGraphFetched('[student, teacher]');

        if (!fullUser) {
            throw new Error('Потребителят не е намерен!');
        }

        const {passwordHash, ...safeUser} = fullUser as any;
        return safeUser;
    });
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
