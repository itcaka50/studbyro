import React, {useState, useEffect} from 'react';
import {schedulesApi} from '../../api/schedules.api';
import {useAuth} from '../../context/auth.context';

interface Schedule {
    id: number;
    subject: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room: string;
}

export const SchedulesPage = () => {
    const {user} = useAuth();

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        subject: '',
        day_of_week: 'Понеделник',
        start_time: '',
        end_time: '',
        room: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {
            setIsLoading(true);
            const res = await schedulesApi.getAll();

            setSchedules(
                Array.isArray(res.data) ? res.data : res.data?.data || []
            );
        } catch (err: any) {
            console.error(err);
            setError('Грешка при зареждане на графиците.');
        } finally {
            setIsLoading(false);
        }
    };

    const openForm = (sched?: Schedule) => {
        if (sched) {
            setEditId(sched.id);
            setFormData({
                subject: sched.subject,
                day_of_week: sched.day_of_week,
                start_time: sched.start_time,
                end_time: sched.end_time,
                room: sched.room
            });
        } else {
            setEditId(null);
            setFormData({
                subject: '',
                day_of_week: 'Понеделник',
                start_time: '',
                end_time: '',
                room: ''
            });
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData({
            subject: '',
            day_of_week: 'Понеделник',
            start_time: '',
            end_time: '',
            room: ''
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.subject || !formData.start_time || !formData.end_time) {
            alert('Моля, попълнете предмета и часовете!');
            return;
        }

        try {
            setIsSaving(true);
            if (editId) {
                await schedulesApi.update(editId, formData);
            } else {
                await schedulesApi.create(formData);
            }

            await loadSchedules();
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
                'Сигурен ли си, че искаш да изтриеш този запис от графика?'
            )
        )
            return;

        try {
            await schedulesApi.remove(id);
            loadSchedules();
        } catch (err) {
            alert('Грешка при изтриване!');
        }
    };

    if (isLoading) return <div>Зареждане на графици...</div>;
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
                <h2>Графици</h2>

                {user?.isAdmin && !isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                        style={{width: 'auto'}}
                    >
                        + Нов Запис
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>
                        {editId ? 'Редактиране на График' : 'Добавяне в График'}
                    </h3>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{marginTop: '15px'}}
                    >
                        <div className="form-group">
                            <label>Предмет (Курс)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.subject}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        subject: e.target.value
                                    })
                                }
                                disabled={isSaving}
                                placeholder="Напр. Висша Математика"
                            />
                        </div>

                        <div style={{display: 'flex', gap: '15px'}}>
                            <div className="form-group" style={{flex: 1}}>
                                <label>Ден от седмицата</label>
                                <select
                                    className="form-control"
                                    value={formData.day_of_week}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            day_of_week: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                >
                                    <option value="Понеделник">
                                        Понеделник
                                    </option>
                                    <option value="Вторник">Вторник</option>
                                    <option value="Сряда">Сряда</option>
                                    <option value="Четвъртък">Четвъртък</option>
                                    <option value="Петък">Петък</option>
                                    <option value="Събота">Събота</option>
                                    <option value="Неделя">Неделя</option>
                                </select>
                            </div>

                            <div className="form-group" style={{flex: 1}}>
                                <label>Зала (Кабинет)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.room}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            room: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                    placeholder="Напр. Зала 324"
                                />
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: '15px'}}>
                            <div className="form-group" style={{flex: 1}}>
                                <label>Начален час</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={formData.start_time}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            start_time: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="form-group" style={{flex: 1}}>
                                <label>Краен час</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={formData.end_time}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            end_time: e.target.value
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
                        <th>Предмет</th>
                        <th>Ден</th>
                        <th>Час</th>
                        <th>Зала</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(sched => (
                        <tr key={sched.id}>
                            <td>{sched.id}</td>
                            <td>{sched.subject}</td>
                            <td>{sched.day_of_week}</td>
                            <td>
                                {sched.start_time} - {sched.end_time}
                            </td>
                            <td>{sched.room}</td>

                            {user?.isAdmin && (
                                <td>
                                    <button
                                        onClick={() => openForm(sched)}
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
                                        onClick={() => handleDelete(sched.id)}
                                        className="btn btn-danger"
                                    >
                                        Изтрий
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {schedules.length === 0 && (
                        <tr>
                            <td
                                colSpan={user?.isAdmin ? 6 : 5}
                                style={{textAlign: 'center'}}
                            >
                                Няма въведени графици.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
