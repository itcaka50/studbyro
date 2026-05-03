import { User } from '../models/user';
import { hashPassword, comparePasswords } from '../utils/hash.util';

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
        throw new Error('Потребител с този имейл вече същестува!');
    }

    const existingUsername = await User.query().findOne({
        username: userData.username,
    });
    if (existingUsername) {
        throw new Error('Това потребителско име вече се използва!');
    }

    const existingPhone = await User.query().findOne({
        phone: userData.phoneNumber,
    });
    if (existingPhone) {
        throw new Error('Потребител с този телефонен номер вече съществува!');
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

    return newUser;
};
//DOBAVI JWT LOGIC MY MAN
export const loginUser = async (email: string, plainPassword: string) => {
    const user = await User.query().findOne({ email });

    if (!user) {
        throw new Error('Грешен имейл или парола!');
    }

    const isPasswordValid = await comparePasswords(
        plainPassword,
        user.passwordHash,
    );

    if (!isPasswordValid) {
        throw new Error('Грешен имейл или парола!');
    }

    return user;
};
