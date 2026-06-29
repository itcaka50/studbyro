import { User } from '../models/user.model';
import { hashPassword, comparePasswords } from '../utils/hash.util';
import { JwtUtil } from '../utils/jwt.util';

const jwtUtil = new JwtUtil();

export interface RegisterData {
    username: string;
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export const registerUser = async (userData: RegisterData) => {
    const existingEmail = await User.query().findOne({ email: userData.email });
    if (existingEmail) {
        throw new Error('Потребител с този имейл вече съществува!');
    }

    const existingUsername = await User.query().findOne({
        username: userData.username,
    });
    if (existingUsername) {
        throw new Error('Това потребителско име вече се използва!');
    }

    if (userData.phoneNumber) {
        const existingPhone = await User.query().findOne({
            phoneNumber: userData.phoneNumber,
        });
        if (existingPhone) {
            throw new Error(
                'Потребител с този телефонен номер вече съществува!',
            );
        }
    }

    const hashedPassword = await hashPassword(userData.password);

    const newUser = await User.query().insert({
        username: userData.username,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        passwordHash: hashedPassword,
        isAdmin: false,
    });

    const token = jwtUtil.sign({ id: newUser.id });

    const { passwordHash, ...safeUser } = newUser;

    return { user: safeUser, token };
};

export const loginUser = async (
    emailOrUsername: string,
    plainPassword: string,
) => {
    const user = await User.query()
        .where('email', emailOrUsername)
        .orWhere('username', emailOrUsername)
        .first();

    if (!user) {
        throw new Error('Грешен имейл/потребителско име или парола!');
    }

    const isPasswordValid = await comparePasswords(
        plainPassword,
        user.passwordHash,
    );

    if (!isPasswordValid) {
        throw new Error('Грешен имейл/потребителско име или парола!');
    }

    const token = jwtUtil.sign({
        id: user.id,
        isAdmin: user.isAdmin,
    });

    const fullUser = await User.query()
        .findById(user.id)
        .withGraphFetched('[student, teacher]');

    const { passwordHash, ...safeUser } = fullUser!;

    return { user: safeUser, token };
};
