import api from './client';

export const teachersApi = {
    getAll: () => api.get('/teachers'),
    getById: (id: string | number) => api.get(`/teachers/${id}`),
    create: (data: any) => api.post('/teachers', data),
    update: (id: string | number, data: any) =>
        api.put(`/teachers/${id}`, data),
    remove: (id: string | number) => api.delete(`/teachers/${id}`),
    getMyProfile: () => api.get('/teachers/me'),
    getMyCourses: () => api.get('/teachers/me/courses'),
    getCourseStudents: (courseId: number) =>
        api.get(`/teachers/me/courses/${courseId}/students`),
    gradeStudent: (courseId: number, facultyNumber: string, grade: number) =>
        api.put(
            `/teachers/me/courses/${courseId}/students/${facultyNumber}/grade`,
            {grade}
        ),
    getMySchedule: () => api.get('/teachers/me/schedule')
};
