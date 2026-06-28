import api from './client';

export const usersApi = {
    getAll: () => api.get('/users'),
    getById: (id: number) => api.get(`/users/${id}`),
    create: (data: any) => api.post('/users', data),
    update: (id: number, data: any) => api.put(`/users/${id}`, data),
    remove: (id: number) => api.delete(`/users/${id}`)
};
