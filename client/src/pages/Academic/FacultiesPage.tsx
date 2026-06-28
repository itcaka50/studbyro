import React, {useState, useEffect} from 'react';
import {facultiesApi} from '../../api/faculties.api';
import {useAuth} from '../../context/auth.context';

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

            console.log('Отговор от сървъра:', response.data);

            if (Array.isArray(response.data)) {
                setFaculties(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setFaculties(response.data.data);
            } else if (
                response.data &&
                Array.isArray(response.data.faculties)
            ) {
                setFaculties(response.data.faculties);
            } else {
                setFaculties([]);
                console.error('Не успях да намеря масив в отговора!');
            }
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

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({name: '', code: ''});
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.code) {
            alert('Моля, попълнете всички полета!');
            return;
        }

        try {
            setIsSaving(true);
            if (editId) {
                await facultiesApi.update(editId, formData);
            } else {
                await facultiesApi.create(formData);
            }

            await loadFaculties();
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
            !window.confirm('Сигурен ли си, че искаш да изтриеш този факултет?')
        )
            return;

        try {
            await facultiesApi.remove(id);
            loadFaculties();
        } catch (err) {
            alert('Грешка при изтриване!');
        }
    };

    if (isLoading) return <div>Зареждане на факултети...</div>;
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
                <h2>Списък с Факултети</h2>

                {user?.isAdmin && !isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                        style={{width: 'auto'}}
                    >
                        + Нов Факултет
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>
                        {editId
                            ? 'Редактиране на Факултет'
                            : 'Създаване на Факултет'}
                    </h3>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{marginTop: '15px'}}
                    >
                        <div className="form-group">
                            <label>Код на факултета</label>
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
                                placeholder="Напр. FMI"
                            />
                        </div>
                        <div className="form-group">
                            <label>Име на факултета</label>
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
                                placeholder="Напр. Факултет по математика и информатика"
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
                        <th>Име на Факултет</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {faculties.map(faculty => (
                        <tr key={faculty.id}>
                            <td>{faculty.id}</td>
                            <td>{faculty.code}</td>
                            <td>{faculty.name}</td>

                            {user?.isAdmin && (
                                <td>
                                    <button
                                        onClick={() => openForm(faculty)}
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
                                        onClick={() => handleDelete(faculty.id)}
                                        className="btn btn-danger"
                                    >
                                        Изтрий
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {faculties.length === 0 && (
                        <tr>
                            <td
                                colSpan={user?.isAdmin ? 4 : 3}
                                style={{textAlign: 'center'}}
                            >
                                Няма намерени факултети.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
