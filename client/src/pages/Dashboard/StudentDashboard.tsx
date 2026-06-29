import React, {useState, useEffect, useCallback} from 'react';
import {useAuth} from '../../context/auth.context';
import {studentsApi} from '../../api/students.api';
import {unwrapList, unwrapData} from '../../api/utils';
import {WeeklyScheduleCalendar} from '../../components/schedule/WeeklyScheduleCalendar';
import {StudentGradesPanel} from '../../components/schedule/StudentGradesPanel';

type Tab = 'specialty' | 'courses' | 'program' | 'grades' | 'schedule';

interface ProgramCourse {
    id: number;
    code: string;
    name: string;
    credits?: number;
    enrolled: boolean;
    grade?: number;
}

interface StudentProfile {
    facultyNumber: string;
    ucn: string;
    financing: string;
    address: string;
    curriculum?: {
        name: string;
        type: string;
        educationForm: string;
        semesterCount: number;
        startYear: string;
        faculty?: {name: string};
    };
}

interface EnrolledCourse {
    id: number;
    grade?: number;
    course?: {id: number; name: string; code: string};
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

export const StudentDashboard = () => {
    const {user} = useAuth();
    const [tab, setTab] = useState<Tab>('specialty');
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [enrolled, setEnrolled] = useState<EnrolledCourse[]>([]);
    const [program, setProgram] = useState<ProgramCourse[]>([]);
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrollingId, setEnrollingId] = useState<number | null>(null);

    const loadProfile = useCallback(async () => {
        const res = await studentsApi.getMyProfile();
        setProfile(unwrapData<StudentProfile>(res));
    }, []);

    const loadCourses = useCallback(async () => {
        const res = await studentsApi.getMyCourses();
        setEnrolled(unwrapList<EnrolledCourse>(res));
    }, []);

    const loadProgram = useCallback(async () => {
        const res = await studentsApi.getMyProgram();
        setProgram(unwrapList<ProgramCourse>(res));
    }, []);

    const loadSchedule = useCallback(async () => {
        const res = await studentsApi.getMySchedule();
        setSchedule(unwrapList<ScheduleEntry>(res));
    }, []);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setError('');
            try {
                if (tab === 'specialty') await loadProfile();
                if (tab === 'courses' || tab === 'grades') await loadCourses();
                if (tab === 'program') await loadProgram();
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
    }, [tab, loadProfile, loadCourses, loadProgram, loadSchedule]);

    const handleEnroll = async (courseId: number) => {
        try {
            setEnrollingId(courseId);
            await studentsApi.enrollInCourse(courseId);
            await loadProgram();
            if (tab === 'courses' || tab === 'grades') await loadCourses();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Грешка при записване!');
        } finally {
            setEnrollingId(null);
        }
    };

    return (
        <div style={{padding: '20px'}}>
            <h1>Здравей, {user?.name ?? user?.username}!</h1>
            <p style={{marginBottom: '20px', color: '#666'}}>
                Студентски портал
                {profile?.facultyNumber && ` · Фак. № ${profile.facultyNumber}`}
            </p>

            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <button
                    style={tabStyle(tab === 'specialty')}
                    onClick={() => setTab('specialty')}
                >
                    Моята специалност
                </button>
                <button
                    style={tabStyle(tab === 'courses')}
                    onClick={() => setTab('courses')}
                >
                    Мои курсове
                </button>
                <button
                    style={tabStyle(tab === 'program')}
                    onClick={() => setTab('program')}
                >
                    Програма
                </button>
                <button
                    style={tabStyle(tab === 'grades')}
                    onClick={() => setTab('grades')}
                >
                    Оценки
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
                    {tab === 'specialty' && profile && (
                        <div className="card">
                            <h3>Учебен план</h3>
                            <p>
                                <strong>{profile.curriculum?.name ?? '—'}</strong>
                            </p>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                    marginTop: '15px'
                                }}
                            >
                                <div>
                                    <strong>Факултет:</strong>{' '}
                                    {profile.curriculum?.faculty?.name ?? '—'}
                                </div>
                                <div>
                                    <strong>Степен:</strong>{' '}
                                    {profile.curriculum?.type ?? '—'}
                                </div>
                                <div>
                                    <strong>Форма:</strong>{' '}
                                    {profile.curriculum?.educationForm ?? '—'}
                                </div>
                                <div>
                                    <strong>Семестри:</strong>{' '}
                                    {profile.curriculum?.semesterCount ?? '—'}
                                </div>
                                <div>
                                    <strong>Начална година:</strong>{' '}
                                    {profile.curriculum?.startYear?.slice(0, 4) ??
                                        '—'}
                                </div>
                                <div>
                                    <strong>Финансиране:</strong>{' '}
                                    {profile.financing}
                                </div>
                                <div style={{gridColumn: '1 / -1'}}>
                                    <strong>Адрес:</strong> {profile.address}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'courses' && (
                        <table border={1} cellPadding={10} style={tableStyle}>
                            <thead>
                                <tr style={{backgroundColor: '#f4f4f9'}}>
                                    <th>Код</th>
                                    <th>Дисциплина</th>
                                    <th>Оценка</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrolled.map(row => (
                                    <tr key={row.id}>
                                        <td>{row.course?.code ?? '—'}</td>
                                        <td>{row.course?.name ?? '—'}</td>
                                        <td>{row.grade ?? '—'}</td>
                                    </tr>
                                ))}
                                {enrolled.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{textAlign: 'center'}}>
                                            Не сте записани за курсове.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {tab === 'program' && (
                        <table border={1} cellPadding={10} style={tableStyle}>
                            <thead>
                                <tr style={{backgroundColor: '#f4f4f9'}}>
                                    <th>Код</th>
                                    <th>Дисциплина</th>
                                    <th>Кредити</th>
                                    <th>Статус</th>
                                    <th>Оценка</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {program.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.code}</td>
                                        <td>{course.name}</td>
                                        <td>{course.credits ?? '—'}</td>
                                        <td>
                                            {course.enrolled
                                                ? 'Записан'
                                                : 'Незаписан'}
                                        </td>
                                        <td>{course.grade ?? '—'}</td>
                                        <td>
                                            {!course.enrolled && (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{width: 'auto'}}
                                                    disabled={
                                                        enrollingId ===
                                                        course.id
                                                    }
                                                    onClick={() =>
                                                        handleEnroll(course.id)
                                                    }
                                                >
                                                    {enrollingId === course.id
                                                        ? '...'
                                                        : 'Запиши се'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {program.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            style={{textAlign: 'center'}}
                                        >
                                            Учебният план няма добавени
                                            дисциплини.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {tab === 'grades' && (
                        <StudentGradesPanel enrolled={enrolled} />
                    )}

                    {tab === 'schedule' && (
                        <WeeklyScheduleCalendar
                            entries={schedule}
                            emptyMessage="Няма график за записаните курсове. Запишете се за дисциплини от таб „Програма“."
                        />
                    )}
                </div>
            )}
        </div>
    );
};
