import React, {useState, useEffect} from 'react';
import {teachersApi} from '../../api/teachers.api';
import {departmentsApi} from '../../api/departments.api';
import {useAuth} from '../../context/auth.context';

interface Teacher {
    id: number;
    title: string;
    first_name: string;
    last_name: string;
    department_id: number;
}

interface Department {
    id: number;
    name: string;
}

export const TeachersPage = () => {
    const {user} = useAuth();

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        first_name: '',
        last_name: '',
        department_id: ''
    });
    const [isSaving, setIsSaving] = useState(false);

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

            setTeachers(
                Array.isArray(teachersRes.data)
                    ? teachersRes.data
                    : teachersRes.data?.data || []
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

    const openForm = (teacher?: Teacher) => {
        if (teacher) {
            setEditId(teacher.id);
            setFormData({
                title: teacher.title || '',
                first_name: teacher.first_name,
                last_name: teacher.last_name,
                department_id: teacher.department_id.toString()
            });
        } else {
            setEditId(null);
            setFormData({
                title: '',
                first_name: '',
                last_name: '',
                department_id: ''
            });
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({
            title: '',
            first_name: '',
            last_name: '',
            department_id: ''
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.first_name ||
            !formData.last_name ||
            !formData.department_id
        ) {
            alert('Моля, попълнете имената и изберете катедра!');
            return;
        }

        try {
            setIsSaving(true);
            const payload = {
                ...formData,
                department_id: Number(formData.department_id)
            };

            if (editId) {
                await teachersApi.update(editId, payload);
            } else {
                await teachersApi.create(payload);
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
        if (
            !window.confirm(
                'Сигурен ли си, че искаш да изтриеш този преподавател?'
            )
        )
            return;

        try {
            await teachersApi.remove(id);
            loadData();
        } catch (err) {
            alert('Грешка при изтриване!');
        }
    };

    const getDepartmentName = (id: number) => {
        const dept = departments.find(d => d.id === id);
        return dept ? dept.name : 'Неизвестна катедра';
    };

    if (isLoading) return <div>Зареждане на преподаватели...</div>;
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
                <h2>Списък с Преподаватели</h2>

                {user?.isAdmin && !isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                        style={{width: 'auto'}}
                    >
                        + Нов Преподавател
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>
                        {editId
                            ? 'Редактиране на Преподавател'
                            : 'Добавяне на Преподавател'}
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
                            <label>Титла / Длъжност</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.title}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value
                                    })
                                }
                                disabled={isSaving}
                                placeholder="Напр. проф. д-р, доц., гл. ас."
                            />
                        </div>

                        <div style={{display: 'flex', gap: '15px'}}>
                            <div className="form-group" style={{flex: 1}}>
                                <label>Име</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.first_name}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            first_name: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                    placeholder="Иван"
                                />
                            </div>

                            <div className="form-group" style={{flex: 1}}>
                                <label>Фамилия</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.last_name}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            last_name: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                    placeholder="Иванов"
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '10px'
                            }}
                        >
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
                        <th>Титла</th>
                        <th>Име и Фамилия</th>
                        <th>Катедра</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher.id}>
                            <td>{teacher.id}</td>
                            <td>{teacher.title}</td>
                            <td>
                                {teacher.first_name} {teacher.last_name}
                            </td>
                            <td>{getDepartmentName(teacher.department_id)}</td>

                            {user?.isAdmin && (
                                <td>
                                    <button
                                        onClick={() => openForm(teacher)}
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
                                        onClick={() => handleDelete(teacher.id)}
                                        className="btn btn-danger"
                                    >
                                        Изтрий
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {teachers.length === 0 && (
                        <tr>
                            <td
                                colSpan={user?.isAdmin ? 5 : 4}
                                style={{textAlign: 'center'}}
                            >
                                Няма намерени преподаватели.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
