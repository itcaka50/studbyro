import api from './client';

export const usersApi = {
    getAll: () => api.get('/users'),
    getById: (id: number) => api.get(`/users/${id}`),
    create: (data: any) => api.post('/users', data),
    update: (id: number, data: any) => api.put(`/users/${id}`, data),
    remove: (id: number) => api.delete(`/users/${id}`),
    updateProfile: (data: {
        username?: string;
        name?: string;
        email?: string;
        phoneNumber?: string;
    }) => api.put('/users/profile', data),
    changePassword: (data: {currentPassword: string; newPassword: string}) =>
        api.put('/users/profile/password', data)
};
