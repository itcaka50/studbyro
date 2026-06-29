import React, {useState, useEffect, useCallback} from 'react';
import {useAuth} from '../../context/auth.context';
import {teachersApi} from '../../api/teachers.api';
import {unwrapList} from '../../api/utils';
import {WeeklyScheduleCalendar} from '../../components/schedule/WeeklyScheduleCalendar';

type Tab = 'courses' | 'grades' | 'schedule';

interface TeacherCourse {
    id: number;
    courseId: number;
    course?: {id: number; name: string; code: string};
}

interface CourseStudent {
    id: number;
    grade?: number;
    studentId: string;
    student?: {
        facultyNumber: string;
        user?: {name: string; email: string};
    };
}

interface ScheduleEntry {
    id: number;
    place: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    type: string;
    course?: {name: string; code: string};
}

const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: active ? '#007bff' : 'white',
    color: active ? 'white' : '#333',
    cursor: 'pointer',
    width: 'auto'
});

const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    marginTop: '15px'
};

export const TeacherDashboard = () => {
    const {user} = useAuth();
    const [tab, setTab] = useState<Tab>('courses');
    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
    const [students, setStudents] = useState<CourseStudent[]>([]);
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
    const [gradeInputs, setGradeInputs] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingGrade, setIsSavingGrade] = useState<string | null>(null);
    const [error, setError] = useState('');

    const loadCourses = useCallback(async () => {
        const res = await teachersApi.getMyCourses();
        const list = unwrapList<TeacherCourse>(res);
        setCourses(list);
        setSelectedCourseId(prev =>
            prev === 0 && list.length > 0 ? list[0].courseId : prev,
        );
    }, []);

    const loadStudents = useCallback(async (courseId: number) => {
        if (!courseId) {
            setStudents([]);
            return;
        }
        const res = await teachersApi.getCourseStudents(courseId);
        const list = unwrapList<CourseStudent>(res);
        setStudents(list);
        const inputs: Record<string, string> = {};
        list.forEach(row => {
            inputs[row.studentId] =
                row.grade !== undefined && row.grade !== null
                    ? String(row.grade)
                    : '';
        });
        setGradeInputs(inputs);
    }, []);

    const loadSchedule = useCallback(async () => {
        const res = await teachersApi.getMySchedule();
        setSchedule(unwrapList<ScheduleEntry>(res));
    }, []);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setError('');
            try {
                if (tab === 'courses') await loadCourses();
                if (tab === 'grades') {
                    await loadCourses();
                    if (selectedCourseId) await loadStudents(selectedCourseId);
                }
                if (tab === 'schedule') await loadSchedule();
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                        'Грешка при зареждане на данните.'
                );
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [tab, selectedCourseId, loadCourses, loadStudents, loadSchedule]);

    useEffect(() => {
        if (tab === 'grades' && selectedCourseId) {
            loadStudents(selectedCourseId).catch(() => {});
        }
    }, [selectedCourseId, tab, loadStudents]);

    const handleSaveGrade = async (facultyNumber: string) => {
        const grade = Number(gradeInputs[facultyNumber]);
        if (!grade || grade < 2 || grade > 6) {
            alert('Въведете валидна оценка между 2 и 6.');
            return;
        }

        try {
            setIsSavingGrade(facultyNumber);
            await teachersApi.gradeStudent(
                selectedCourseId,
                facultyNumber,
                grade
            );
            await loadStudents(selectedCourseId);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Грешка при запис на оценка!');
        } finally {
            setIsSavingGrade(null);
        }
    };

    return (
        <div style={{padding: '20px'}}>
            <h1>Здравей, {user?.name ?? user?.username}!</h1>
            <p style={{marginBottom: '20px', color: '#666'}}>
                Преподавателски портал
            </p>

            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <button
                    style={tabStyle(tab === 'courses')}
                    onClick={() => setTab('courses')}
                >
                    Моите курсове
                </button>
                <button
                    style={tabStyle(tab === 'grades')}
                    onClick={() => setTab('grades')}
                >
                    Оценяване
                </button>
                <button
                    style={tabStyle(tab === 'schedule')}
                    onClick={() => setTab('schedule')}
                >
                    Моят график
                </button>
            </div>

            {error && (
                <div className="alert-error" style={{marginTop: '15px'}}>
                    {error}
                </div>
            )}

            {isLoading ? (
                <div style={{marginTop: '20px'}}>Зареждане...</div>
            ) : (
                <div style={{marginTop: '20px'}}>
                    {tab === 'courses' && (
                        <table border={1} cellPadding={10} style={tableStyle}>
                            <thead>
                                <tr style={{backgroundColor: '#f4f4f9'}}>
                                    <th>Код</th>
                                    <th>Дисциплина</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(row => (
                                    <tr key={row.id}>
                                        <td>{row.course?.code ?? '—'}</td>
                                        <td>{row.course?.name ?? '—'}</td>
                                    </tr>
                                ))}
                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan={2} style={{textAlign: 'center'}}>
                                            Нямате назначени курсове.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {tab === 'grades' && (
                        <>
                            <div className="form-group" style={{maxWidth: '400px'}}>
                                <label>Изберете курс</label>
                                <select
                                    className="form-control"
                                    value={selectedCourseId}
                                    onChange={e =>
                                        setSelectedCourseId(Number(e.target.value))
                                    }
                                >
                                    <option value={0}>-- Изберете курс --</option>
                                    {courses.map(row => (
                                        <option
                                            key={row.id}
                                            value={row.courseId}
                                        >
                                            {row.course?.code} – {row.course?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedCourseId > 0 && (
                                <table
                                    border={1}
                                    cellPadding={10}
                                    style={tableStyle}
                                >
                                    <thead>
                                        <tr style={{backgroundColor: '#f4f4f9'}}>
                                            <th>Фак. №</th>
                                            <th>Име</th>
                                            <th>Оценка</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(row => (
                                            <tr key={row.id}>
                                                <td>{row.studentId}</td>
                                                <td>
                                                    {row.student?.user?.name ??
                                                        '—'}
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min={2}
                                                        max={6}
                                                        className="form-control"
                                                        style={{width: '80px'}}
                                                        value={
                                                            gradeInputs[
                                                                row.studentId
                                                            ] ?? ''
                                                        }
                                                        onChange={e =>
                                                            setGradeInputs({
                                                                ...gradeInputs,
                                                                [row.studentId]:
                                                                    e.target.value
                                                            })
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{width: 'auto'}}
                                                        disabled={
                                                            isSavingGrade ===
                                                            row.studentId
                                                        }
                                                        onClick={() =>
                                                            handleSaveGrade(
                                                                row.studentId
                                                            )
                                                        }
                                                    >
                                                        {isSavingGrade ===
                                                        row.studentId
                                                            ? '...'
                                                            : 'Запази'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {students.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    style={{textAlign: 'center'}}
                                                >
                                                    Няма записани студенти за
                                                    този курс.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}

                    {tab === 'schedule' && (
                        <WeeklyScheduleCalendar
                            entries={schedule}
                            emptyMessage="Няма график за вашите курсове."
                        />
                    )}
                </div>
            )}
        </div>
    );
};
