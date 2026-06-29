import React from 'react';

export interface GradeEntry {
    id: number;
    grade?: number | null;
    course?: {id: number; name: string; code: string};
}

const gradeLabel = (grade: number) => {
    if (grade >= 5.5) return 'Отличен';
    if (grade >= 4.5) return 'Много добър';
    if (grade >= 3.5) return 'Добър';
    if (grade >= 3) return 'Среден';
    return 'Слаб';
};

const gradeClass = (grade: number) => {
    if (grade >= 5) return 'grade-excellent';
    if (grade >= 4) return 'grade-good';
    if (grade >= 3) return 'grade-average';
    return 'grade-poor';
};

interface StudentGradesPanelProps {
    enrolled: GradeEntry[];
}

export const StudentGradesPanel = ({enrolled}: StudentGradesPanelProps) => {
    const graded = enrolled.filter(
        row => row.grade !== undefined && row.grade !== null
    );
    const pending = enrolled.filter(
        row => row.grade === undefined || row.grade === null
    );

    const average =
        graded.length > 0
            ? (
                  graded.reduce((sum, row) => sum + (row.grade ?? 0), 0) /
                  graded.length
              ).toFixed(2)
            : null;

    if (enrolled.length === 0) {
        return (
            <div className="schedule-calendar-empty">
                Не сте записани за курсове.
            </div>
        );
    }

    return (
        <div className="grades-panel">
            <div className="grades-summary">
                <div className="grades-stat">
                    <span className="grades-stat-value">{graded.length}</span>
                    <span className="grades-stat-label">Оценени</span>
                </div>
                <div className="grades-stat">
                    <span className="grades-stat-value">{pending.length}</span>
                    <span className="grades-stat-label">Без оценка</span>
                </div>
                <div className="grades-stat grades-stat-highlight">
                    <span className="grades-stat-value">
                        {average ?? '—'}
                    </span>
                    <span className="grades-stat-label">Среден успех</span>
                </div>
            </div>

            {graded.length > 0 && (
                <section className="grades-section">
                    <h3>Оценени дисциплини</h3>
                    <div className="grades-cards">
                        {graded.map(row => (
                            <div
                                key={row.id}
                                className={`grade-card ${gradeClass(row.grade!)}`}
                            >
                                <div className="grade-card-main">
                                    <span className="grade-card-code">
                                        {row.course?.code ?? '—'}
                                    </span>
                                    <span className="grade-card-name">
                                        {row.course?.name ?? '—'}
                                    </span>
                                </div>
                                <div className="grade-card-score">
                                    <span className="grade-number">
                                        {row.grade}
                                    </span>
                                    <span className="grade-word">
                                        {gradeLabel(row.grade!)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {pending.length > 0 && (
                <section className="grades-section">
                    <h3>Очакват оценка</h3>
                    <table
                        border={1}
                        cellPadding={10}
                        className="grades-pending-table"
                    >
                        <thead>
                            <tr>
                                <th>Код</th>
                                <th>Дисциплина</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pending.map(row => (
                                <tr key={row.id}>
                                    <td>{row.course?.code ?? '—'}</td>
                                    <td>{row.course?.name ?? '—'}</td>
                                    <td className="grade-pending">—</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {graded.length === 0 && (
                <p className="grades-empty-note">
                    Все още няма въведени оценки от преподавателите ви.
                </p>
            )}
        </div>
    );
};
