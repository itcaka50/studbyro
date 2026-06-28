import React, {useState, useEffect} from 'react';
import {departmentsApi} from '../../api/departments.api';
import {facultiesApi} from '../../api/faculties.api';
import {useAuth} from '../../context/auth.context';

interface Department {
    id: number;
    name: string;
    faculty_id: number;
}

interface Faculty {
    id: number;
    name: string;
}

export const DepartmentsPage = () => {
    const {user} = useAuth();

    const [departments, setDepartments] = useState<Department[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        faculty_id: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [deptRes, facRes] = await Promise.all([
                departmentsApi.getAll(),
                facultiesApi.getAll()
            ]);

            setDepartments(
                Array.isArray(deptRes.data)
                    ? deptRes.data
                    : deptRes.data?.data || []
            );
            setFaculties(
                Array.isArray(facRes.data)
                    ? facRes.data
                    : facRes.data?.data || []
            );
        } catch (err: any) {
            console.error(err);
            setError('Грешка при зареждане на данните.');
        } finally {
            setIsLoading(false);
        }
    };

    const openForm = (dept?: Department) => {
        if (dept) {
            setEditId(dept.id);
            setFormData({
                name: dept.name,
                faculty_id: String(dept.faculty_id)
            });
        } else {
            setEditId(null);
            setFormData({
                name: '',
                faculty_id: faculties.length > 0 ? String(faculties[0].id) : ''
            });
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({name: '', faculty_id: ''});
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.faculty_id) {
            alert('Моля, попълнете името и изберете факултет!');
            return;
        }

        try {
            setIsSaving(true);
            const payload = {
                ...formData,
                faculty_id: Number(formData.faculty_id)
            };

            if (editId) {
                await departmentsApi.update(editId, payload);
            } else {
                await departmentsApi.create(payload);
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
        if (!window.confirm('Сигурен ли си, че искаш да изтриеш тази катедра?'))
            return;

        try {
            await departmentsApi.remove(id);
            loadData();
        } catch (err) {
            alert('Грешка при изтриване!');
        }
    };

    const getFacultyName = (facultyId: number) => {
        const fac = faculties.find(f => f.id === facultyId);
        return fac ? fac.name : 'Неизвестен факултет';
    };

    if (isLoading) return <div>Зареждане на катедри...</div>;
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
                <h2>Списък с Катедри</h2>

                {user?.isAdmin && !isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                        style={{width: 'auto'}}
                    >
                        + Нова Катедра
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>
                        {editId
                            ? 'Редактиране на Катедра'
                            : 'Добавяне на Катедра'}
                    </h3>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{marginTop: '15px'}}
                    >
                        <div className="form-group">
                            <label>Име на катедрата</label>
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
                                placeholder="Напр. Софтуерни технологии"
                            />
                        </div>

                        <div className="form-group">
                            <label>Принадлежи към Факултет</label>
                            <select
                                className="form-control"
                                value={formData.faculty_id}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        faculty_id: e.target.value
                                    })
                                }
                                disabled={isSaving || faculties.length === 0}
                            >
                                {faculties.length === 0 && (
                                    <option value="">
                                        Няма създадени факултети
                                    </option>
                                )}
                                {faculties.map(fac => (
                                    <option key={fac.id} value={fac.id}>
                                        {fac.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '15px'
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
                        <th>Име на Катедра</th>
                        <th>Факултет</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {departments.map(dept => (
                        <tr key={dept.id}>
                            <td>{dept.id}</td>
                            <td>
                                <strong>{dept.name}</strong>
                            </td>
                            <td>{getFacultyName(dept.faculty_id)}</td>

                            {user?.isAdmin && (
                                <td>
                                    <button
                                        onClick={() => openForm(dept)}
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
                                        onClick={() => handleDelete(dept.id)}
                                        className="btn btn-danger"
                                    >
                                        Изтрий
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {departments.length === 0 && (
                        <tr>
                            <td
                                colSpan={user?.isAdmin ? 4 : 3}
                                style={{textAlign: 'center'}}
                            >
                                Няма въведени катедри.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
