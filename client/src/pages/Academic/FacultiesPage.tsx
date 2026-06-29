import React, {useState, useEffect} from 'react';
import {facultiesApi} from '../../api/faculties.api';
import {useAuth} from '../../context/auth.context';
import {unwrapList} from '../../api/utils';

interface Faculty {
    id: number;
    name: string;
    code: string;
}

export const FacultiesPage = () => {
    const {user} = useAuth();

    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({name: '', code: ''});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadFaculties();
    }, []);

    const loadFaculties = async () => {
        try {
            setIsLoading(true);
            const response = await facultiesApi.getAll();
            setFaculties(unwrapList<Faculty>(response));
        } catch (err: any) {
            console.error(err);
            setError('Грешка при зареждане на факултетите.');
        } finally {
            setIsLoading(false);
        }
    };

    const openForm = (faculty?: Faculty) => {
        if (faculty) {
            setEditId(faculty.id);
            setFormData({name: faculty.name, code: faculty.code});
        } else {
            setEditId(null);
            setFormData({name: '', code: ''});
        }
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.code)
            return alert('Попълнете всички полета!');

        try {
            setIsSaving(true);
            if (editId) await facultiesApi.update(editId, formData);
            else await facultiesApi.create(formData);

            await loadFaculties();
            setIsFormOpen(false);
            setFormData({name: '', code: ''});
        } catch (err: any) {
            alert(err.response?.data?.message || 'Грешка при запис!');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Сигурен ли си?')) return;
        try {
            await facultiesApi.remove(id);
            loadFaculties();
        } catch {
            alert('Грешка при изтриване!');
        }
    };

    if (isLoading) return <div>Зареждане...</div>;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                }}
            >
                <h2>Списък с Факултети</h2>
                {user?.isAdmin && !isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                    >
                        + Нов Факултет
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>{editId ? 'Редактиране' : 'Създаване'}</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control"
                                placeholder="Код (напр. FMI)"
                                value={formData.code}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value
                                    })
                                }
                            />
                            <input
                                className="form-control"
                                placeholder="Име на факултета"
                                value={formData.name}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })
                                }
                            />
                        </div>
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
                        >
                            Отказ
                        </button>
                    </form>
                </div>
            )}

            <table
                className="table"
                border={1}
                style={{width: '100%', borderCollapse: 'collapse'}}
            >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Код</th>
                        <th>Име</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {faculties.map(f => (
                        <tr key={f.id}>
                            <td>{f.id}</td>
                            <td>{f.code}</td>
                            <td>{f.name}</td>
                            {user?.isAdmin && (
                                <td>
                                    <button onClick={() => openForm(f)}>
                                        Редакция
                                    </button>
                                    <button onClick={() => handleDelete(f.id)}>
                                        Изтрий
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
