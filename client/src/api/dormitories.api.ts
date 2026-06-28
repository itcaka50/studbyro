import api from './client';

export const dormitoriesApi = {
    getAll: () => api.get('/dormitories'),
    getById: (id: string | number) => api.get(`/dormitories/${id}`),
    create: (data: any) => api.post('/dormitories', data),
    update: (id: string | number, data: any) =>
        api.put(`/dormitories/${id}`, data),
    remove: (id: string | number) => api.delete(`/dormitories/${id}`)
};
