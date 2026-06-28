import api from './client';

export const studentsApi = {
    getAll: () => api.get('/students'),
    getById: (id: string | number) => api.get(`/students/${id}`),
    create: (data: any) => api.post('/students', data),
    update: (id: string | number, data: any) =>
        api.put(`/students/${id}`, data),
    remove: (id: string | number) => api.delete(`/students/${id}`)
};
