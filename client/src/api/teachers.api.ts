import api from './client';

export const teachersApi = {
    getAll: () => api.get('/teachers'),
    getById: (id: string | number) => api.get(`/teachers/${id}`),
    create: (data: any) => api.post('/teachers', data),
    update: (id: string | number, data: any) =>
        api.put(`/teachers/${id}`, data),
    remove: (id: string | number) => api.delete(`/teachers/${id}`)
};
