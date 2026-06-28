import React, {useState, useEffect} from 'react';
import {dormitoriesApi} from '../../api/dormitories.api';
import {useAuth} from '../../context/auth.context';

interface DormitoryRequest {
    id: number;
    student_id: string;
    created_at?: string;
}

export const DormitoriesPage = () => {
    const {user} = useAuth();

    const [requests, setRequests] = useState<DormitoryRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        student_id: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setIsLoading(true);
            const res = await dormitoriesApi.getAll();

            setRequests(
                Array.isArray(res.data) ? res.data : res.data?.data || []
            );
        } catch (err: any) {
            console.error(err);
            setError('Грешка при зареждане на заявките за общежитие.');
        } finally {
            setIsLoading(false);
        }
    };

    const openForm = (req?: DormitoryRequest) => {
        if (req) {
            setEditId(req.id);
            setFormData({
                student_id: req.student_id
            });
        } else {
            setEditId(null);
            setFormData({student_id: ''});
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({student_id: ''});
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.student_id) {
            alert('Моля, въведете факултетен номер!');
            return;
        }

        try {
            setIsSaving(true);
            if (editId) {
                await dormitoriesApi.update(editId, formData);
            } else {
                await dormitoriesApi.create(formData);
            }

            await loadRequests();
            closeForm();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Грешка при запазване!');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Сигурен ли си, че искаш да изтриеш тази заявка?'))
            return;

        try {
            await dormitoriesApi.remove(id);
            loadRequests();
        } catch (err) {
            alert('Грешка при изтриване!');
        }
    };

    if (isLoading) return <div>Зареждане на заявки...</div>;
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
                <h2>Заявки за Общежитие</h2>

                {!isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                        style={{width: 'auto'}}
                    >
                        + Нова Заявка
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>
                        {editId
                            ? 'Редактиране на заявка'
                            : 'Подаване на заявка за общежитие'}
                    </h3>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{marginTop: '15px'}}
                    >
                        <div className="form-group">
                            <label>Факултетен номер на студента</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.student_id}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        student_id: e.target.value
                                    })
                                }
                                disabled={isSaving}
                                placeholder="Напр. 20013444"
                            />
                            <small
                                style={{
                                    color: '#666',
                                    marginTop: '5px',
                                    display: 'block'
                                }}
                            >
                                Трябва да съвпада със съществуващ faculty_number
                                от таблицата със студенти.
                            </small>
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
                        <th>Факултетен Номер</th>
                        <th>Дата на заявка</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id}>
                            <td>{req.id}</td>
                            <td>
                                <strong>{req.student_id}</strong>
                            </td>
                            <td>
                                {req.created_at
                                    ? new Date(
                                          req.created_at
                                      ).toLocaleDateString('bg-BG')
                                    : 'Няма данни'}
                            </td>

                            {user?.isAdmin && (
                                <td>
                                    <button
                                        onClick={() => openForm(req)}
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
                                        onClick={() => handleDelete(req.id)}
                                        className="btn btn-danger"
                                    >
                                        Изтрий
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td
                                colSpan={user?.isAdmin ? 4 : 3}
                                style={{textAlign: 'center'}}
                            >
                                Няма подадени заявки.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
