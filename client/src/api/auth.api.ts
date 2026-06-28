import api from './client';

export const authApi = {
    login: (credentials: {
        email?: string;
        username?: string;
        password: string;
    }) => api.post('/auth/login', credentials),

    register: (userData: any) => api.post('/auth/register', userData),

    getProfile: () => api.get('/auth/profile'),

    logout: () => localStorage.removeItem('token')
};
