import api from './client';

export const curriculumsApi = {
    getAll: () => api.get('/curriculums'),
    getById: (id: string | number) => api.get(`/curriculums/${id}`),
    create: (data: any) => api.post('/curriculums', data),
    update: (id: string | number, data: any) =>
        api.put(`/curriculums/${id}`, data),
    remove: (id: string | number) => api.delete(`/curriculums/${id}`)
};
