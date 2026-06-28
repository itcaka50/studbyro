import React, {useState, useEffect} from 'react';
import {coursesApi} from '../../api/courses.api';
import {departmentsApi} from '../../api/departments.api';
import {useAuth} from '../../context/auth.context';

interface Course {
    id: number;
    code: string;
    name: string;
    credits: number;
    department_id: number;
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
        credits: '',
        department_id: ''
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

            setCourses(
                Array.isArray(coursesRes.data)
                    ? coursesRes.data
                    : coursesRes.data?.data || []
            );
            setDepartments(
                Array.isArray(deptRes.data)
                    ? deptRes.data
                    : deptRes.data?.data || []
            );
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
                credits: course.credits.toString(),
                department_id: course.department_id.toString()
            });
        } else {
            setEditId(null);
            setFormData({name: '', code: '', credits: '', department_id: ''});
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({name: '', code: '', credits: '', department_id: ''});
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.code ||
            !formData.credits ||
            !formData.department_id
        ) {
            alert('Моля, попълнете всички полета!');
            return;
        }

        try {
            setIsSaving(true);
            const payload = {
                ...formData,
                credits: Number(formData.credits),
                department_id: Number(formData.department_id)
            };

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
                                value={formData.department_id}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        department_id: e.target.value
                                    })
                                }
                                disabled={isSaving}
                            >
                                <option value="">-- Изберете катедра --</option>
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
                            <label>Кредити (ECTS)</label>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                className="form-control"
                                value={formData.credits}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        credits: e.target.value
                                    })
                                }
                                disabled={isSaving}
                                placeholder="Напр. 6"
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
                        <th>Кредити</th>
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
                            <td>{course.credits}</td>
                            <td>{getDepartmentName(course.department_id)}</td>

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
