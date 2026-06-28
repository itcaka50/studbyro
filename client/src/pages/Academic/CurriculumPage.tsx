import React, {useState, useEffect} from 'react';
import {curriculumsApi} from '../../api/curriculums.api';
import {facultiesApi} from '../../api/faculties.api';
import {useAuth} from '../../context/auth.context';
import {unwrapList} from '../../api/utils';

interface Curriculum {
    id: number;
    name: string;
    startYear: string;
    educationForm: 'задочно' | 'редовно';
    semesterCount: number;
    type: 'бакалавър' | 'магистър' | 'доктор';
    facultyId: number;
    faculty?: {name: string};
}

interface Faculty {
    id: number;
    name: string;
}

const emptyForm = {
    name: '',
    facultyId: 0,
    startYear: new Date().getFullYear().toString(),
    educationForm: 'редовно' as 'задочно' | 'редовно',
    semesterCount: 8,
    type: 'бакалавър' as 'бакалавър' | 'магистър' | 'доктор'
};

export const CurriculumsPage = () => {
    const {user} = useAuth();

    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadCurriculums();
    }, []);

    const loadCurriculums = async () => {
        try {
            setIsLoading(true);
            const [currRes, facRes] = await Promise.all([
                curriculumsApi.getAll(),
                facultiesApi.getAll()
            ]);
            setCurriculums(unwrapList<Curriculum>(currRes));
            setFaculties(unwrapList<Faculty>(facRes));
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
                facultyId: curr.facultyId,
                startYear: curr.startYear?.slice(0, 4) ?? '',
                educationForm: curr.educationForm,
                semesterCount: curr.semesterCount,
                type: curr.type
            });
        } else {
            setEditId(null);
            setFormData({
                ...emptyForm,
                facultyId: faculties.length > 0 ? faculties[0].id : 0
            });
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormData(emptyForm);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.facultyId) {
            alert('Моля, попълнете името и изберете факултет!');
            return;
        }

        const payload = {
            ...formData,
            startYear: `${formData.startYear}-09-01`
        };

        try {
            setIsSaving(true);
            if (editId) {
                await curriculumsApi.update(editId, payload);
            } else {
                await curriculumsApi.create(payload);
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

    const getFacultyName = (facultyId: number) => {
        const fac =
            faculties.find(f => f.id === facultyId) ??
            curriculums.find(c => c.facultyId === facultyId)?.faculty;
        return fac?.name ?? '—';
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

                        <div className="form-group">
                            <label>Факултет</label>
                            <select
                                className="form-control"
                                value={formData.facultyId}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        facultyId: Number(e.target.value)
                                    })
                                }
                                disabled={isSaving}
                            >
                                <option value={0}>-- Изберете факултет --</option>
                                {faculties.map(f => (
                                    <option key={f.id} value={f.id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{display: 'flex', gap: '15px'}}>
                            <div className="form-group" style={{flex: 1}}>
                                <label>Начална година</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.startYear}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            startYear: e.target.value
                                        })
                                    }
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="form-group" style={{flex: 1}}>
                                <label>Форма на обучение</label>
                                <select
                                    className="form-control"
                                    value={formData.educationForm}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            educationForm: e.target
                                                .value as typeof formData.educationForm
                                        })
                                    }
                                    disabled={isSaving}
                                >
                                    <option value="редовно">Редовно</option>
                                    <option value="задочно">Задочно</option>
                                </select>
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: '15px'}}>
                            <div className="form-group" style={{flex: 1}}>
                                <label>ОКС (Степен)</label>
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
                                    disabled={isSaving}
                                >
                                    <option value="бакалавър">Бакалавър</option>
                                    <option value="магистър">Магистър</option>
                                    <option value="доктор">Доктор</option>
                                </select>
                            </div>

                            <div className="form-group" style={{flex: 1}}>
                                <label>Брой семестри</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    value={formData.semesterCount}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            semesterCount: Number(
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
                        <th>Факултет</th>
                        <th>Степен</th>
                        <th>Форма</th>
                        <th>Семестри</th>
                        {user?.isAdmin && <th>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {curriculums.map(curr => (
                        <tr key={curr.id}>
                            <td>{curr.id}</td>
                            <td>{curr.name}</td>
                            <td>{getFacultyName(curr.facultyId)}</td>
                            <td>{curr.type}</td>
                            <td>{curr.educationForm}</td>
                            <td>{curr.semesterCount}</td>
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
                                colSpan={user?.isAdmin ? 7 : 6}
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
