import React, {useState, useEffect} from 'react';
import {schedulesApi} from '../../api/schedules.api';
import {coursesApi} from '../../api/courses.api';
import {useAuth} from '../../context/auth.context';
import {unwrapList} from '../../api/utils';

interface Schedule {
    id: number;
    place: string;
    courseId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    type: 'лекция' | 'семинар' | 'практикум';
    course?: {name: string; code: string};
}

interface Course {
    id: number;
    name: string;
    code: string;
}

const emptyForm = {
    place: '',
    courseId: 0,
    dayOfWeek: 'Понеделник',
    startTime: '',
    endTime: '',
    type: 'лекция' as 'лекция' | 'семинар' | 'практикум'
};

export const SchedulesPage = () => {
    const {user} = useAuth();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [schedRes, courseRes] = await Promise.all([
                schedulesApi.getAll(),
                coursesApi.getAll()
            ]);
            setSchedules(unwrapList<Schedule>(schedRes));
            setCourses(unwrapList<Course>(courseRes));
        } catch (err: any) {
            setError('Грешка при зареждане на графиците.');
        } finally {
            setIsLoading(false);
        }
    };

    const openForm = (sched?: Schedule) => {
        if (sched) {
            setEditId(sched.id);
            setFormData({
                place: sched.place,
                courseId: sched.courseId,
                dayOfWeek: sched.dayOfWeek,
                startTime: sched.startTime?.slice(0, 5) ?? '',
                endTime: sched.endTime?.slice(0, 5) ?? '',
                type: sched.type
            });
        } else {
            setEditId(null);
            setFormData({
                ...emptyForm,
                courseId: courses.length > 0 ? courses[0].id : 0
            });
        }
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !formData.place ||
            !formData.courseId ||
            !formData.startTime ||
            !formData.endTime
        ) {
            alert('Моля, попълнете всички задължителни полета!');
            return;
        }

        try {
            setIsSaving(true);
            if (editId) await schedulesApi.update(editId, formData);
            else await schedulesApi.create(formData);

            await loadData();
            setIsFormOpen(false);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Грешка при запис!');
        } finally {
            setIsSaving(false);
        }
    };

    const getCourseLabel = (schedule: Schedule) => {
        if (schedule.course) {
            return `${schedule.course.code} – ${schedule.course.name}`;
        }
        const course = courses.find(c => c.id === schedule.courseId);
        return course ? `${course.code} – ${course.name}` : schedule.courseId;
    };

    if (isLoading) return <div>Зареждане...</div>;
    if (error) return <div className="alert-error">{error}</div>;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                }}
            >
                <h2>Графици</h2>
                {user?.isAdmin && !isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn btn-primary"
                    >
                        + Нов Запис
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <h3>{editId ? 'Редактиране' : 'Добавяне'}</h3>
                    <form onSubmit={handleFormSubmit}>
                        <select
                            className="form-control"
                            value={formData.courseId}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    courseId: Number(e.target.value)
                                })
                            }
                        >
                            <option value={0}>-- Изберете курс --</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.code} – {c.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="form-control"
                            value={formData.dayOfWeek}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    dayOfWeek: e.target.value
                                })
                            }
                        >
                            {[
                                'Понеделник',
                                'Вторник',
                                'Сряда',
                                'Четвъртък',
                                'Петък',
                                'Събота',
                                'Неделя'
                            ].map(day => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>
                        <select
                            className="form-control"
                            value={formData.type}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    type: e.target
                                        .value as typeof formData.type
                                })
                            }
                        >
                            <option value="лекция">Лекция</option>
                            <option value="семинар">Семинар</option>
                            <option value="практикум">Практикум</option>
                        </select>
                        <input
                            type="time"
                            className="form-control"
                            value={formData.startTime}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    startTime: e.target.value
                                })
                            }
                        />
                        <input
                            type="time"
                            className="form-control"
                            value={formData.endTime}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    endTime: e.target.value
                                })
                            }
                        />
                        <input
                            className="form-control"
                            placeholder="Зала / място"
                            value={formData.place}
                            onChange={e =>
                                setFormData({...formData, place: e.target.value})
                            }
                        />
                        <button type="submit" disabled={isSaving}>
                            Запази
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                        >
                            Отказ
                        </button>
                    </form>
                </div>
            )}

            <table
                border={1}
                style={{width: '100%', borderCollapse: 'collapse'}}
            >
                <thead>
                    <tr>
                        <th>Курс</th>
                        <th>Ден</th>
                        <th>Тип</th>
                        <th>Час</th>
                        <th>Място</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(s => (
                        <tr key={s.id}>
                            <td>{getCourseLabel(s)}</td>
                            <td>{s.dayOfWeek}</td>
                            <td>{s.type}</td>
                            <td>
                                {s.startTime?.slice(0, 5)}–
                                {s.endTime?.slice(0, 5)}
                            </td>
                            <td>{s.place}</td>
                            {user?.isAdmin && (
                                <td>
                                    <button onClick={() => openForm(s)}>
                                        Редакция
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await schedulesApi.remove(s.id);
                                            loadData();
                                        }}
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
                                Няма записи в графика.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
