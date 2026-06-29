import React, {useState, useEffect} from 'react';
import {teachersApi} from '../../api/teachers.api';
import {departmentsApi} from '../../api/departments.api';
import {unwrapList} from '../../api/utils';

interface Teacher {
    userId: number;
    departmentId: number;
    user?: {name: string; email: string};
    department?: {name: string};
}

interface Department {
    id: number;
    name: string;
}

export const TeachersPage = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [teachersRes, deptRes] = await Promise.all([
                teachersApi.getAll(),
                departmentsApi.getAll()
            ]);
            setTeachers(unwrapList<Teacher>(teachersRes));
            setDepartments(unwrapList<Department>(deptRes));
        } catch (err: any) {
            console.error('Грешка при зареждане на преподаватели:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getDepartmentName = (teacher: Teacher) => {
        if (teacher.department?.name) return teacher.department.name;
        return (
            departments.find(d => d.id === teacher.departmentId)?.name ??
            'Неизвестна'
        );
    };

    if (isLoading) return <div>Зареждане на преподаватели...</div>;

    return (
        <div>
            <h2>Списък с Преподаватели</h2>

            <table
                border={1}
                cellPadding={10}
                style={{
                    borderCollapse: 'collapse',
                    width: '100%',
                    backgroundColor: 'white'
                }}
            >
                <thead>
                    <tr style={{backgroundColor: '#f4f4f9'}}>
                        <th>User ID</th>
                        <th>Име</th>
                        <th>Имейл</th>
                        <th>Катедра</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(t => (
                        <tr key={t.userId}>
                            <td>{t.userId}</td>
                            <td>{t.user?.name ?? '—'}</td>
                            <td>{t.user?.email ?? '—'}</td>
                            <td>{getDepartmentName(t)}</td>
                        </tr>
                    ))}
                    {teachers.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{textAlign: 'center'}}>
                                Няма намерени записи.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
