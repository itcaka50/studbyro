import React, {useState, useEffect} from 'react';
import {curriculumsApi} from '../../api/curriculums.api';
import {useAuth} from '../../context/auth.context';

interface Curriculum {
    id: number;
    name: string;
    degree: string;
    total_credits: number;
}

export const CurriculumsPage = () => {
    const {user} = useAuth();

    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        degree: 'Бакалавър',
        total_credits: 0
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadCurriculums();
    }, []);

    const loadCurriculums = async () => {
        try {
            setIsLoading(true);
            const res = await curriculumsApi.getAll();

            setCurriculums(
                Array.isArray(res.data) ? res.data : res.data?.data || []
            );
        } catch (err: any) {
            console.error(err);
            setError('Грешка при зареждане на учебните планове.');
        } finally {
            setIsLoading(false);
        }
    };

    const openForm = (curr?: Curriculum) => {
        if (curr) {
            setEditId(curr.id);
            setFormData({
                name: curr.name,
                degree: curr.degree,
                total_credits: curr.total_credits
            });
        } else {
            setEditId(null);
            setFormData({name: '', degree: 'Бакалавър', total_credits: 0});
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({name: '', degree: 'Бакалавър', total_credits: 0});
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            alert('Моля, попълнете името на учебния план!');
            return;
        }

        try {
            setIsSaving(true);
            if (editId) {
                await curriculumsApi.update(editId, formData);
            } else {
                await curriculumsApi.create(formData);
            }

            await loadCurriculums();
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
                'Сигурен ли си, че искаш да изтриеш този учебен план?'
            )
        )
            return;

        try {
            await curriculumsApi.remove(id);
            loadCurriculums();
        } catch (err) {
            alert('Грешка при изтриване!');
        }
    };

    if (isLoading) return <div>Зареждане на учебни планове...</div>;
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
                <h2>Учебни планове</h2>

                {user?.isAdmin && !isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                        style={{width: 'auto'}}
                    >
                        + Нов План
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>
                        {editId ? 'Редактиране на План' : 'Създаване на План'}
                    </h3>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{marginTop: '15px'}}
                    >
                        <div className="form-group">
                            <label>Име на плана (Специалност и випуск)</label>
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
                                placeholder="Напр. Софтуерно инженерство 2024"
                            />
                        </div>

                        <div style={{display: 'flex', gap: '15px'}}>
                            <div className="form-group" style={{flex: 1}}>
                                <label>ОКС (Степен)</label>
                                <select
                                    className="form-control"
                                    value={formData.degree}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            degree: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                >
                                    <option value="Бакалавър">Бакалавър</option>
                                    <option value="Магистър">Магистър</option>
                                    <option value="Доктор">Доктор</option>
                                </select>
                            </div>

                            <div className="form-group" style={{flex: 1}}>
                                <label>Общо кредити</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.total_credits}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            total_credits: Number(
                                                e.target.value
                                            )
                                        })
                                    }
                                    disabled={isSaving}
                                />
                            </div>
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
                        <th>Име на план</th>
                        <th>Степен</th>
                        <th>Кредити</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {curriculums.map(curr => (
                        <tr key={curr.id}>
                            <td>{curr.id}</td>
                            <td>{curr.name}</td>
                            <td>{curr.degree}</td>
                            <td>{curr.total_credits}</td>

                            {user?.isAdmin && (
                                <td>
                                    <button
                                        onClick={() => openForm(curr)}
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
                                        onClick={() => handleDelete(curr.id)}
                                        className="btn btn-danger"
                                    >
                                        Изтрий
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {curriculums.length === 0 && (
                        <tr>
                            <td
                                colSpan={user?.isAdmin ? 5 : 4}
                                style={{textAlign: 'center'}}
                            >
                                Няма намерени учебни планове.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
