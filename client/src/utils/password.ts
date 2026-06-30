export const PASSWORD_REQUIREMENTS_MESSAGE =
    'Паролата трябва да е поне 8 символа и да съдържа поне една буква и една цифра.';

export const getPasswordValidationError = (password: string): string | null => {
    if (password.length < 8) {
        return 'Паролата трябва да е поне 8 символа.';
    }
    if (password.length > 128) {
        return 'Паролата не може да надвишава 128 символа.';
    }
    if (!/[A-Za-zА-Яа-яЁё]/.test(password)) {
        return 'Паролата трябва да съдържа поне една буква.';
    }
    if (!/\d/.test(password)) {
        return 'Паролата трябва да съдържа поне една цифра.';
    }
    return null;
};
