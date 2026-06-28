import React, {useState, useEffect} from 'react';
import {scholarshipsApi} from '../../api/scholarships.api';
import {useAuth} from '../../context/auth.context';

interface Scholarship {
    id: number;
    name: string;
    type: string;
    amount: number;
    description?: string;
}

export const ScholarshipsPage = () => {
    const {user} = useAuth();

    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'За успех',
        amount: 0,
        description: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadScholarships();
    }, []);

    const loadScholarships = async () => {
        try {
            setIsLoading(true);
            const res = await scholarshipsApi.getAll();

            setScholarships(
                Array.isArray(res.data) ? res.data : res.data?.data || []
            );
        } catch (err: any) {
            console.error(err);
            setError('Грешка при зареждане на стипендиите.');
        } finally {
            setIsLoading(false);
        }
    };

    const openForm = (scholarship?: Scholarship) => {
        if (scholarship) {
            setEditId(scholarship.id);
            setFormData({
                name: scholarship.name,
                type: scholarship.type,
                amount: scholarship.amount,
                description: scholarship.description || ''
            });
        } else {
            setEditId(null);
            setFormData({
                name: '',
                type: 'За успех',
                amount: 0,
                description: ''
            });
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({name: '', type: 'За успех', amount: 0, description: ''});
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || formData.amount <= 0) {
            alert('Моля, попълнете името и въведете валидна сума!');
            return;
        }

        try {
            setIsSaving(true);
            if (editId) {
                await scholarshipsApi.update(editId, formData);
            } else {
                await scholarshipsApi.create(formData);
            }

            await loadScholarships();
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
                'Сигурен ли си, че искаш да изтриеш тази стипендия?'
            )
        )
            return;

        try {
            await scholarshipsApi.remove(id);
            loadScholarships();
        } catch (err) {
            alert('Грешка при изтриване!');
        }
    };

    if (isLoading) return <div>Зареждане на стипендии...</div>;
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
                <h2>Стипендии</h2>

                {user?.isAdmin && !isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                        style={{width: 'auto'}}
                    >
                        + Нова Стипендия
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>{editId ? 'Редактиране' : 'Създаване на Стипендия'}</h3>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{marginTop: '15px'}}
                    >
                        <div className="form-group">
                            <label>Наименование на стипендията</label>
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
                                placeholder="Напр. Стипендия за отличен успех над 5.50"
                            />
                        </div>

                        <div style={{display: 'flex', gap: '15px'}}>
                            <div className="form-group" style={{flex: 1}}>
                                <label>Тип</label>
                                <select
                                    className="form-control"
                                    value={formData.type}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            type: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                >
                                    <option value="За успех">За успех</option>
                                    <option value="Социална">Социална</option>
                                    <option value="Спортна">Спортна</option>
                                    <option value="Специална/Целева">
                                        Специална/Целева
                                    </option>
                                </select>
                            </div>

                            <div className="form-group" style={{flex: 1}}>
                                <label>Сума на месец (BGN)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.amount}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            amount: Number(e.target.value)
                                        })
                                    }
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Допълнително описание (опционално)</label>
                            <textarea
                                className="form-control"
                                value={formData.description}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value
                                    })
                                }
                                disabled={isSaving}
                                rows={2}
                                placeholder="Условия за получаване..."
                            />
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
                        <th>Наименование</th>
                        <th>Тип</th>
                        <th>Сума</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {scholarships.map(schol => (
                        <tr key={schol.id}>
                            <td>{schol.id}</td>
                            <td>
                                <strong>{schol.name}</strong>
                                {schol.description && (
                                    <div
                                        style={{
                                            fontSize: '0.85em',
                                            color: '#666',
                                            marginTop: '4px'
                                        }}
                                    >
                                        {schol.description}
                                    </div>
                                )}
                            </td>
                            <td>{schol.type}</td>
                            <td>
                                <span
                                    style={{color: 'green', fontWeight: 'bold'}}
                                >
                                    {schol.amount} лв.
                                </span>
                            </td>

                            {user?.isAdmin && (
                                <td>
                                    <button
                                        onClick={() => openForm(schol)}
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
                                        onClick={() => handleDelete(schol.id)}
                                        className="btn btn-danger"
                                    >
                                        Изтрий
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {scholarships.length === 0 && (
                        <tr>
                            <td
                                colSpan={user?.isAdmin ? 5 : 4}
                                style={{textAlign: 'center'}}
                            >
                                Няма въведени стипендии.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
