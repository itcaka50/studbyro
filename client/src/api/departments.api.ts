import api from './client';

export const departmentsApi = {
    getAll: () => api.get('/departments'),
    getById: (id: string | number) => api.get(`/departments/${id}`),
    create: (data: any) => api.post('/departments', data),
    update: (id: string | number, data: any) =>
        api.put(`/departments/${id}`, data),
    remove: (id: string | number) => api.delete(`/departments/${id}`)
};
