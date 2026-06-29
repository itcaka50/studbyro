import React, {useState, useEffect} from 'react';
import {facultiesApi} from '../../api/faculties.api';
import {departmentsApi} from '../../api/departments.api';
import {coursesApi} from '../../api/courses.api';
import {teachersApi} from '../../api/teachers.api';
import {unwrapList} from '../../api/utils';

interface Faculty {
    id: number;
    name: string;
    code: string;
}
interface Department {
    id: number;
    name: string;
    facultyId: number;
}
interface Course {
    id: number;
    name: string;
    departmentId: number;
}
interface Teacher {
    userId: number;
    departmentId: number;
    user?: {name: string};
}

interface DashboardData {
    faculties: Faculty[];
    depts: Department[];
    courses: Course[];
    teachers: Teacher[];
}

export const GuestDashboard = () => {
    const [step, setStep] = useState<'faculties' | 'departments' | 'details'>(
        'faculties'
    );
    const [data, setData] = useState<DashboardData>({
        faculties: [],
        depts: [],
        courses: [],
        teachers: []
    });
    const [selected, setSelected] = useState<{
        facultyId?: number;
        deptId?: number;
    }>({});

    useEffect(() => {
        loadInitial();
    }, []);

    const loadInitial = async () => {
        const res = await facultiesApi.getAll();
        setData(prev => ({
            ...prev,
            faculties: unwrapList<Faculty>(res)
        }));
    };

    const handleFacultyClick = async (id: number) => {
        setSelected({facultyId: id});
        const res = await departmentsApi.getAll();
        const allDepts = unwrapList<Department>(res);
        setData(prev => ({
            ...prev,
            depts: allDepts.filter(d => d.facultyId === id)
        }));
        setStep('departments');
    };

    const handleDeptClick = async (id: number) => {
        setSelected(prev => ({...prev, deptId: id}));
        const [cRes, tRes] = await Promise.all([
            coursesApi.getAll(),
            teachersApi.getAll()
        ]);
        const allCourses = unwrapList<Course>(cRes);
        const allTeachers = unwrapList<Teacher>(tRes);

        setData(prev => ({
            ...prev,
            courses: allCourses.filter(c => c.departmentId === id),
            teachers: allTeachers.filter(t => t.departmentId === id)
        }));
        setStep('details');
    };

    return (
        <div style={{padding: '20px'}}>
            <h1>Университетска структура</h1>

            {step !== 'faculties' && (
                <button
                    onClick={() => setStep('faculties')}
                    style={{marginBottom: '20px'}}
                >
                    ⬅ Назад към факултети
                </button>
            )}

            {step === 'faculties' && (
                <div>
                    <h3>Изберете факултет:</h3>
                    {data.faculties.map((f: Faculty) => (
                        <div
                            key={f.id}
                            className="card"
                            onClick={() => handleFacultyClick(f.id)}
                            style={{
                                cursor: 'pointer',
                                margin: '10px 0',
                                padding: '15px',
                                border: '1px solid #ccc'
                            }}
                        >
                            <strong>{f.name}</strong> ({f.code})
                        </div>
                    ))}
                </div>
            )}

            {step === 'departments' && (
                <div>
                    <h3>Катедри в избрания факултет:</h3>
                    {data.depts.map((d: Department) => (
                        <div
                            key={d.id}
                            className="card"
                            onClick={() => handleDeptClick(d.id)}
                            style={{
                                cursor: 'pointer',
                                margin: '10px 0',
                                padding: '15px',
                                border: '1px solid #ccc'
                            }}
                        >
                            {d.name}
                        </div>
                    ))}
                </div>
            )}

            {step === 'details' && (
                <div>
                    <h3>Детайли за катедрата</h3>
                    <div style={{display: 'flex', gap: '40px'}}>
                        <div>
                            <h4>Курсове</h4>
                            <ul>
                                {data.courses.map((c: Course) => (
                                    <li key={c.id}>{c.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4>Преподаватели</h4>
                            <ul>
                                {data.teachers.map((t: Teacher) => (
                                    <li key={t.userId}>
                                        {t.user?.name ?? '—'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
