import { z } from 'zod';

export const PASSWORD_REQUIREMENTS_MESSAGE =
    'Паролата трябва да е поне 8 символа и да съдържа поне една буква и една цифра.';

const passwordSchema = z
    .string()
    .min(8, 'Паролата трябва да е поне 8 символа.')
    .max(128, 'Паролата не може да надвишава 128 символа.')
    .regex(
        /[A-Za-zА-Яа-яЁё]/,
        'Паролата трябва да съдържа поне една буква.',
    )
    .regex(/\d/, 'Паролата трябва да съдържа поне една цифра.');

export const validatePassword = (password: string): void => {
    const result = passwordSchema.safeParse(password);
    if (!result.success) {
        const error = new Error(
            result.error.issues[0]?.message ?? PASSWORD_REQUIREMENTS_MESSAGE,
        ) as Error & {status: number};
        error.status = 400;
        throw error;
    }
};
