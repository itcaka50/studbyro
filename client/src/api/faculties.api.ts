import api from './client';

export const facultiesApi = {
    getAll: () => api.get('/faculties'),
    getById: (id: string | number) => api.get(`/faculties/${id}`),
    create: (data: any) => api.post('/faculties', data),
    update: (id: string | number, data: any) =>
        api.put(`/faculties/${id}`, data),
    remove: (id: string | number) => api.delete(`/faculties/${id}`)
};
