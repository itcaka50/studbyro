import React, {useState, useEffect} from 'react';
import {studentsApi} from '../../api/students.api';
import {unwrapList} from '../../api/utils';

interface Student {
    facultyNumber: string;
    ucn: string;
    financing: 'държавна поръчка' | 'платено обучение';
    address: string;
    userId: number;
    curriculumId: number;
    user?: {name: string; email: string};
    curriculum?: {name: string};
}

export const StudentsPage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            const res = await studentsApi.getAll();
            setStudents(unwrapList<Student>(res));
        } catch (err) {
            console.error('Грешка при зареждане на студентите:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Зареждане на списъка със студенти...</div>;

    return (
        <div>
            <h2>Списък със Студенти</h2>
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
                        <th>Фак. №</th>
                        <th>Име</th>
                        <th>ЕГН</th>
                        <th>Финансиране</th>
                        <th>Адрес</th>
                        <th>Учебен план</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s => (
                        <tr key={s.facultyNumber}>
                            <td>{s.facultyNumber}</td>
                            <td>{s.user?.name ?? '—'}</td>
                            <td>{s.ucn}</td>
                            <td>{s.financing}</td>
                            <td>{s.address}</td>
                            <td>{s.curriculum?.name ?? s.curriculumId}</td>
                        </tr>
                    ))}
                    {students.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{textAlign: 'center'}}>
                                Няма намерени записи.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
