import React, {useState, useEffect} from 'react';
import {departmentsApi} from '../../api/departments.api';
import {facultiesApi} from '../../api/faculties.api';
import {useAuth} from '../../context/auth.context';
import {unwrapList} from '../../api/utils';

interface Department {
    id: number;
    name: string;
    facultyId: number;
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
        facultyId: 0
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

            setDepartments(unwrapList<Department>(deptRes));
            setFaculties(unwrapList<Faculty>(facRes));
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
                facultyId: dept.facultyId
            });
        } else {
            setEditId(null);
            setFormData({
                name: '',
                facultyId: faculties.length > 0 ? faculties[0].id : 0
            });
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({name: '', facultyId: 0});
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || formData.facultyId === 0) {
            alert('Моля, попълнете името и изберете факултет!');
            return;
        }

        try {
            setIsSaving(true);
            if (editId) {
                await departmentsApi.update(editId, formData);
            } else {
                await departmentsApi.create(formData);
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
                                value={formData.facultyId}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        facultyId: Number(e.target.value)
                                    })
                                }
                                disabled={isSaving || faculties.length === 0}
                            >
                                <option value={0}>
                                    -- Изберете факултет --
                                </option>
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
                            <td>{getFacultyName(dept.facultyId)}</td>
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
