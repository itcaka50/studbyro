import api from './client';

export const scholarshipsApi = {
    getAll: () => api.get('/scholarships'),
    getById: (id: string | number) => api.get(`/scholarships/${id}`),
    create: (data: any) => api.post('/scholarships', data),
    update: (id: string | number, data: any) =>
        api.put(`/scholarships/${id}`, data),
    remove: (id: string | number) => api.delete(`/scholarships/${id}`)
};
