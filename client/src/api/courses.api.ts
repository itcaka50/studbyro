import api from './client';

export const coursesApi = {
    getAll: () => api.get('/courses'),
    getById: (id: string | number) => api.get(`/courses/${id}`),
    create: (data: any) => api.post('/courses', data),
    update: (id: string | number, data: any) => api.put(`/courses/${id}`, data),
    remove: (id: string | number) => api.delete(`/courses/${id}`)
};
