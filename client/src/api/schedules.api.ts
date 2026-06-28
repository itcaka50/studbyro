import api from './client';

export const schedulesApi = {
    getAll: () => api.get('/schedules'),
    getById: (id: string | number) => api.get(`/schedules/${id}`),
    create: (data: any) => api.post('/schedules', data),
    update: (id: string | number, data: any) =>
        api.put(`/schedules/${id}`, data),
    remove: (id: string | number) => api.delete(`/schedules/${id}`)
};
