import React, {useState, useEffect} from 'react';
import {coursesApi} from '../../api/courses.api';
import {departmentsApi} from '../../api/departments.api';
import {useAuth} from '../../context/auth.context';
import {unwrapList} from '../../api/utils';

interface Course {
    id: number;
    code: string;
    name: string;
    departmentId: number;
    totalHours?: number;
    link?: string;
}

interface Department {
    id: number;
    name: string;
}

export const CoursesPage = () => {
    const {user} = useAuth();

    const [courses, setCourses] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        departmentId: 0,
        totalHours: 0
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [coursesRes, deptRes] = await Promise.all([
                coursesApi.getAll(),
                departmentsApi.getAll()
            ]);

            setCourses(unwrapList<Course>(coursesRes));
            setDepartments(unwrapList<Department>(deptRes));
        } catch (err: any) {
            console.error(err);
            setError('Грешка при зареждане на данните.');
        } finally {
            setIsLoading(false);
        }
    };

    const openForm = (course?: Course) => {
        if (course) {
            setEditId(course.id);
            setFormData({
                name: course.name,
                code: course.code,
                departmentId: course.departmentId,
                totalHours: course.totalHours ?? 0
            });
        } else {
            setEditId(null);
            setFormData({name: '', code: '', departmentId: 0, totalHours: 0});
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({name: '', code: '', departmentId: 0, totalHours: 0});
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.code || !formData.departmentId) {
            alert('Моля, попълнете коректно всички полета!');
            return;
        }

        const payload = {
            name: formData.name,
            code: formData.code,
            departmentId: formData.departmentId,
            ...(formData.totalHours > 0
                ? {totalHours: formData.totalHours}
                : {})
        };

        try {
            setIsSaving(true);
            if (editId) {
                await coursesApi.update(editId, payload);
            } else {
                await coursesApi.create(payload);
            }

            await loadData();
            closeForm();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Грешка при запазване!');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Сигурен ли си, че искаш да изтриеш този курс?'))
            return;

        try {
            await coursesApi.remove(id);
            loadData();
        } catch (err) {
            alert('Грешка при изтриване!');
        }
    };

    const getDepartmentName = (id: number) => {
        const dept = departments.find(d => d.id === id);
        return dept ? dept.name : 'Неизвестна катедра';
    };

    if (isLoading) return <div>Зареждане на курсове...</div>;
    if (error) return <div className="alert-error">{error}</div>;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}
            >
                <h2>Списък с Курсове (Учебни дисциплини)</h2>
                {user?.isAdmin && !isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                        style={{width: 'auto'}}
                    >
                        + Нов Курс
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>
                        {editId ? 'Редактиране на Курс' : 'Създаване на Курс'}
                    </h3>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{marginTop: '15px'}}
                    >
                        <div className="form-group">
                            <label>Катедра</label>
                            <select
                                className="form-control"
                                value={formData.departmentId}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        departmentId: Number(e.target.value)
                                    })
                                }
                                disabled={isSaving}
                            >
                                <option value={0}>
                                    -- Изберете катедра --
                                </option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Код на дисциплината</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.code}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value
                                    })
                                }
                                disabled={isSaving}
                                placeholder="Напр. CS101"
                            />
                        </div>

                        <div className="form-group">
                            <label>Име на дисциплината</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.name}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })
                                }
                                disabled={isSaving}
                                placeholder="Напр. Бази данни"
                            />
                        </div>

                        <div className="form-group">
                            <label>Общо часове (по избор)</label>
                            <input
                                type="number"
                                min="0"
                                className="form-control"
                                value={formData.totalHours}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        totalHours: Number(e.target.value)
                                    })
                                }
                                disabled={isSaving}
                                placeholder="Напр. 60"
                            />
                        </div>

                        <div style={{display: 'flex', gap: '10px'}}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSaving}
                                style={{width: 'auto'}}
                            >
                                {isSaving ? 'Запазване...' : 'Запази'}
                            </button>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="btn"
                                disabled={isSaving}
                            >
                                Отказ
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                        <th>ID</th>
                        <th>Код</th>
                        <th>Име на Курс</th>
                        <th>Часове</th>
                        <th>Към Катедра</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{course.totalHours ?? '—'}</td>
                            <td>{getDepartmentName(course.departmentId)}</td>
                            {user?.isAdmin && (
                                <td>
                                    <button
                                        onClick={() => openForm(course)}
                                        className="btn"
                                        style={{
                                            marginRight: '10px',
                                            backgroundColor: '#ffc107',
                                            color: '#000'
                                        }}
                                    >
                                        Редакция
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="btn btn-danger"
                                    >
                                        Изтрий
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {courses.length === 0 && (
                        <tr>
                            <td
                                colSpan={user?.isAdmin ? 6 : 5}
                                style={{textAlign: 'center'}}
                            >
                                Няма намерени курсови дисциплини.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
