import React, {useState, useEffect} from 'react';
import {studentsApi} from '../../api/students.api';
import {useAuth} from '../../context/auth.context';

interface Student {
    faculty_number: string;
    ucn: string;
    financing: 'държавна поръчка' | 'платено обучение';
    address: string;
    user_id: number;
    curriculum_id: number;
}

export const StudentsPage = () => {
    const {user} = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        faculty_number: '',
        ucn: '',
        financing: 'държавна поръчка' as const,
        address: '',
        user_id: '',
        curriculum_id: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            const res = await studentsApi.getAll();
            setStudents(
                Array.isArray(res.data) ? res.data : res.data?.data || []
            );
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                user_id: Number(formData.user_id),
                curriculum_id: Number(formData.curriculum_id)
            };

            await studentsApi.create(payload);
            await loadStudents();
            setIsFormOpen(false);
        } catch (err) {
            alert('Грешка при запис!');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div>Зареждане...</div>;

    return (
        <div>
            <h2>Списък със Студенти</h2>
            {user?.isAdmin && (
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="btn btn-primary"
                    style={{marginBottom: '20px'}}
                >
                    {isFormOpen ? 'Затвори формата' : '+ Нов Студент'}
                </button>
            )}

            {isFormOpen && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label>Фак. номер</label>
                            <input
                                className="form-control"
                                value={formData.faculty_number}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        faculty_number: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>ЕГН (UCN)</label>
                            <input
                                className="form-control"
                                value={formData.ucn}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        ucn: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Финансиране</label>
                            <select
                                className="form-control"
                                value={formData.financing}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        financing: e.target.value as any
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
                        </div>
                        <div className="form-group">
                            <label>Адрес</label>
                            <input
                                className="form-control"
                                value={formData.address}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>User ID</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.user_id}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        user_id: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Curriculum ID</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.curriculum_id}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        curriculum_id: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                        <button className="btn btn-primary" disabled={isSaving}>
                            Запази
                        </button>
                    </form>
                </div>
            )}

            <table
                border={1}
                cellPadding={10}
                style={{borderCollapse: 'collapse', width: '100%'}}
            >
                <thead>
                    <tr>
                        <th>Фак. №</th>
                        <th>ЕГН</th>
                        <th>Финансиране</th>
                        <th>Адрес</th>
                        <th>User ID</th>
                        <th>Curriculum ID</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s => (
                        <tr key={s.faculty_number}>
                            <td>{s.faculty_number}</td>
                            <td>{s.ucn}</td>
                            <td>{s.financing}</td>
                            <td>{s.address}</td>
                            <td>{s.user_id}</td>
                            <td>{s.curriculum_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
