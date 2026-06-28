import React, {useState, useEffect} from 'react';
import {usersApi} from '../../api/users.api';
import {departmentsApi} from '../../api/departments.api';
import {curriculumsApi} from '../../api/curriculums.api';
import {useAuth} from '../../context/auth.context';

interface User {
    id: number;
    username: string;
    email: string;
    is_admin: boolean | number;
}

export const UsersPage = () => {
    const {user: currentUser} = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [curriculums, setCurriculums] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',

        first_name: '',
        last_name: '',
        faculty_number: '',
        curriculum_id: '',
        academic_title: '',
        department_id: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            const [usersRes, deptRes, currRes] = await Promise.all([
                usersApi.getAll(),
                departmentsApi.getAll().catch(() => ({data: []})),
                curriculumsApi.getAll().catch(() => ({data: []}))
            ]);

            setUsers(
                Array.isArray(usersRes.data)
                    ? usersRes.data
                    : usersRes.data?.data || []
            );
            setDepartments(
                Array.isArray(deptRes.data)
                    ? deptRes.data
                    : deptRes.data?.data || []
            );
            setCurriculums(
                Array.isArray(currRes.data)
                    ? currRes.data
                    : currRes.data?.data || []
            );
        } catch (err: any) {
            console.error(err);
            setError('Грешка при зареждане на данните.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadUsersOnly = async () => {
        const res = await usersApi.getAll();
        setUsers(Array.isArray(res.data) ? res.data : res.data?.data || []);
    };

    const openForm = (u?: User) => {
        if (u) {
            setEditId(u.id);
            setFormData({
                ...formData,
                username: u.username,
                email: u.email,
                password: '',
                role: u.is_admin ? 'admin' : 'user'
            });
        } else {
            setEditId(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'user',
                first_name: '',
                last_name: '',
                faculty_number: '',
                curriculum_id:
                    curriculums.length > 0 ? String(curriculums[0].id) : '',
                academic_title: '',
                department_id:
                    departments.length > 0 ? String(departments[0].id) : ''
            });
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.email) {
            alert('Потребителското име и имейлът са задължителни!');
            return;
        }

        if (!editId && !formData.password) {
            alert('Моля, въведете парола за новия потребител!');
            return;
        }

        try {
            setIsSaving(true);

            const payload: any = {
                username: formData.username,
                email: formData.email,
                is_admin: formData.role === 'admin' ? 1 : 0,
                role_type: formData.role
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            if (formData.role === 'student') {
                payload.profile_data = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    faculty_number: formData.faculty_number,
                    curriculum_id: formData.curriculum_id
                };
            } else if (formData.role === 'teacher') {
                payload.profile_data = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    academic_title: formData.academic_title,
                    department_id: formData.department_id
                };
            }

            if (editId) {
                await usersApi.update(editId, payload);
            } else {
                await usersApi.create(payload);
            }

            await loadUsersOnly();
            closeForm();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Грешка при запазване!');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (id === currentUser?.id) {
            alert('Не можеш да изтриеш собствения си профил, докато си вътре!');
            return;
        }

        if (
            !window.confirm(
                'Сигурен ли си, че искаш да изтриеш този потребител?'
            )
        )
            return;

        try {
            await usersApi.remove(id);
            loadUsersOnly();
        } catch (err) {
            alert('Грешка при изтриване!');
        }
    };

    if (isLoading) return <div>Зареждане на данни...</div>;
    if (error) return <div className="alert-error">{error}</div>;

    if (!currentUser?.isAdmin) {
        return (
            <div className="alert-error">
                Нямате достъп до тази административна страница!
            </div>
        );
    }

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
                <h2>Управление на Потребители</h2>
                {!isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                        style={{width: 'auto'}}
                    >
                        + Нов Потребител
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>
                        {editId
                            ? 'Редактиране на Потребител'
                            : 'Създаване на Потребител'}
                    </h3>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{marginTop: '15px'}}
                    >
                        <div style={{display: 'flex', gap: '15px'}}>
                            <div className="form-group" style={{flex: 1}}>
                                <label>Потребителско име</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.username}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            username: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                />
                            </div>
                            <div className="form-group" style={{flex: 1}}>
                                <label>Имейл</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                Парола{' '}
                                {editId &&
                                    '(Остави празно, ако няма да я сменяш)'}
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.password}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })
                                }
                                disabled={isSaving}
                            />
                        </div>

                        <hr
                            style={{margin: '20px 0', border: '1px solid #eee'}}
                        />

                        {!editId && (
                            <div className="form-group">
                                <label>Тип Акаунт (Роля)</label>
                                <select
                                    className="form-control"
                                    value={formData.role}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            role: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                >
                                    <option value="user">
                                        Обикновен потребител
                                    </option>
                                    <option value="student">👨‍🎓 Студент</option>
                                    <option value="teacher">
                                        👨‍🏫 Преподавател
                                    </option>
                                    <option value="admin">
                                        🛡️ Администратор
                                    </option>
                                </select>
                            </div>
                        )}

                        {formData.role === 'student' && !editId && (
                            <div
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    marginTop: '10px'
                                }}
                            >
                                <h4 style={{marginTop: 0}}>Данни за Студент</h4>
                                <div style={{display: 'flex', gap: '15px'}}>
                                    <div
                                        className="form-group"
                                        style={{flex: 1}}
                                    >
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
                                        />
                                    </div>
                                    <div
                                        className="form-group"
                                        style={{flex: 1}}
                                    >
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
                                        />
                                    </div>
                                </div>
                                <div style={{display: 'flex', gap: '15px'}}>
                                    <div
                                        className="form-group"
                                        style={{flex: 1}}
                                    >
                                        <label>Факултетен №</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.faculty_number}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    faculty_number:
                                                        e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className="form-group"
                                        style={{flex: 1}}
                                    >
                                        <label>Учебен План</label>
                                        <select
                                            className="form-control"
                                            value={formData.curriculum_id}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    curriculum_id:
                                                        e.target.value
                                                })
                                            }
                                        >
                                            {curriculums.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {formData.role === 'teacher' && !editId && (
                            <div
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    marginTop: '10px'
                                }}
                            >
                                <h4 style={{marginTop: 0}}>
                                    Данни за Преподавател
                                </h4>
                                <div style={{display: 'flex', gap: '15px'}}>
                                    <div
                                        className="form-group"
                                        style={{flex: 1}}
                                    >
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
                                        />
                                    </div>
                                    <div
                                        className="form-group"
                                        style={{flex: 1}}
                                    >
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
                                        />
                                    </div>
                                </div>
                                <div style={{display: 'flex', gap: '15px'}}>
                                    <div
                                        className="form-group"
                                        style={{flex: 1}}
                                    >
                                        <label>Титла</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Напр. Проф. д-р"
                                            value={formData.academic_title}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    academic_title:
                                                        e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className="form-group"
                                        style={{flex: 1}}
                                    >
                                        <label>Катедра</label>
                                        <select
                                            className="form-control"
                                            value={formData.department_id}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    department_id:
                                                        e.target.value
                                                })
                                            }
                                        >
                                            {departments.map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '20px'
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
                        <th>Username</th>
                        <th>Имейл</th>
                        <th>Права</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr
                            key={u.id}
                            style={
                                u.id === currentUser?.id
                                    ? {backgroundColor: '#e8f5e9'}
                                    : {}
                            }
                        >
                            <td>{u.id}</td>
                            <td>
                                <strong>{u.username}</strong>{' '}
                                {u.id === currentUser?.id && (
                                    <span style={{color: 'green'}}>(Ти)</span>
                                )}
                            </td>
                            <td>{u.email}</td>
                            <td>
                                {u.is_admin ? (
                                    <span
                                        style={{
                                            backgroundColor: '#ffebee',
                                            color: '#c62828',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Admin
                                    </span>
                                ) : (
                                    <span
                                        style={{
                                            backgroundColor: '#e3f2fd',
                                            color: '#1565c0',
                                            padding: '4px 8px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        User
                                    </span>
                                )}
                            </td>
                            <td>
                                <button
                                    onClick={() => openForm(u)}
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
                                    onClick={() => handleDelete(u.id)}
                                    className="btn btn-danger"
                                    disabled={u.id === currentUser?.id}
                                >
                                    Изтрий
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
