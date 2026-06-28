import React, {useState, useEffect} from 'react';
import {usersApi} from '../../api/users.api';
import {departmentsApi} from '../../api/departments.api';
import {curriculumsApi} from '../../api/curriculums.api';
import {useAuth} from '../../context/auth.context';
import {unwrapList} from '../../api/utils';

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    isAdmin: boolean;
    student?: {facultyNumber: string};
    teacher?: {userId: number};
}

export const UsersPage = () => {
    const {user: currentUser} = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [curriculums, setCurriculums] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        role: 'user',
        facultyNumber: '',
        ucn: '',
        financing: 'държавна поръчка' as
            | 'държавна поръчка'
            | 'платено обучение',
        address: '',
        curriculumId: 0,
        departmentId: 0
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [usersRes, deptRes, currRes] = await Promise.all([
                usersApi.getAll(),
                departmentsApi.getAll().catch(() => null),
                curriculumsApi.getAll().catch(() => null)
            ]);
            setUsers(unwrapList<User>(usersRes));
            setDepartments(deptRes ? unwrapList(deptRes) : []);
            setCurriculums(currRes ? unwrapList(currRes) : []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleLabel = (u: User) => {
        if (u.isAdmin) return 'Администратор';
        if (u.student) return 'Студент';
        if (u.teacher) return 'Преподавател';
        return 'Потребител';
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const roleType =
                formData.role === 'admin'
                    ? 'user'
                    : (formData.role as 'user' | 'student' | 'teacher');

            let profileData: Record<string, unknown> | undefined;

            if (formData.role === 'student') {
                profileData = {
                    facultyNumber: formData.facultyNumber,
                    ucn: formData.ucn,
                    financing: formData.financing,
                    address: formData.address,
                    curriculumId: formData.curriculumId
                };
            } else if (formData.role === 'teacher') {
                profileData = {
                    departmentId: formData.departmentId
                };
            }

            const payload = {
                username: formData.username,
                name: formData.name,
                email: formData.email,
                password: formData.password,
                is_admin: formData.role === 'admin',
                role_type: roleType,
                profile_data: profileData
            };

            await usersApi.create(payload);
            await loadData();
            setIsFormOpen(false);
            setFormData({
                username: '',
                name: '',
                email: '',
                password: '',
                role: 'user',
                facultyNumber: '',
                ucn: '',
                financing: 'държавна поръчка',
                address: '',
                curriculumId: 0,
                departmentId: 0
            });
        } catch (err: any) {
            alert(err.response?.data?.message || 'Грешка при запис!');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div>Зареждане на потребители...</div>;

    return (
        <div>
            <h2>Управление на Потребители</h2>
            {currentUser?.isAdmin && (
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="btn btn-primary"
                >
                    {isFormOpen ? 'Затвори формата' : '+ Нов Потребител'}
                </button>
            )}

            {isFormOpen && (
                <div
                    className="card"
                    style={{
                        marginTop: '20px',
                        padding: '20px',
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <h3>Създаване на потребител</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px'
                            }}
                        >
                            <div className="form-group">
                                <label>Потребителско име</label>
                                <input
                                    className="form-control"
                                    value={formData.username}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            username: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Пълно име</label>
                                <input
                                    className="form-control"
                                    value={formData.name}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
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
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Парола</label>
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
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Тип Акаунт</label>
                            <select
                                className="form-control"
                                value={formData.role}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        role: e.target.value
                                    })
                                }
                            >
                                <option value="user">
                                    Обикновен потребител
                                </option>
                                <option value="student">Студент</option>
                                <option value="teacher">Преподавател</option>
                                <option value="admin">Администратор</option>
                            </select>
                        </div>

                        {formData.role === 'student' && (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '15px',
                                    marginTop: '10px'
                                }}
                            >
                                <input
                                    className="form-control"
                                    placeholder="Факултетен №"
                                    value={formData.facultyNumber}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            facultyNumber: e.target.value
                                        })
                                    }
                                    required
                                />
                                <input
                                    className="form-control"
                                    placeholder="ЕГН"
                                    value={formData.ucn}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            ucn: e.target.value
                                        })
                                    }
                                    required
                                />
                                <select
                                    className="form-control"
                                    value={formData.financing}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            financing: e.target
                                                .value as typeof formData.financing
                                        })
                                    }
                                >
                                    <option value="държавна поръчка">
                                        Държавна поръчка
                                    </option>
                                    <option value="платено обучение">
                                        Платено обучение
                                    </option>
                                </select>
                                <input
                                    className="form-control"
                                    placeholder="Адрес"
                                    value={formData.address}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value
                                        })
                                    }
                                    required
                                />
                                <select
                                    className="form-control"
                                    value={formData.curriculumId}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            curriculumId: Number(e.target.value)
                                        })
                                    }
                                    required
                                >
                                    <option value={0}>
                                        Изберете учебен план
                                    </option>
                                    {curriculums.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {formData.role === 'teacher' && (
                            <div style={{marginTop: '10px'}}>
                                <select
                                    className="form-control"
                                    value={formData.departmentId}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            departmentId: Number(e.target.value)
                                        })
                                    }
                                    required
                                >
                                    <option value={0}>Изберете катедра</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div style={{marginTop: '20px'}}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSaving}
                            >
                                Запази
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setIsFormOpen(false)}
                                style={{marginLeft: '10px'}}
                            >
                                Отказ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <table
                border={1}
                style={{
                    width: '100%',
                    marginTop: '20px',
                    borderCollapse: 'collapse'
                }}
            >
                <thead>
                    <tr style={{backgroundColor: '#f4f4f9'}}>
                        <th>ID</th>
                        <th>Потребителско име</th>
                        <th>Име</th>
                        <th>Имейл</th>
                        <th>Роля</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{getRoleLabel(u)}</td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{textAlign: 'center'}}>
                                Няма намерени потребители.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
