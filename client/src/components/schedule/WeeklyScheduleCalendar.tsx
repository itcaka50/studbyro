import React from 'react';

export interface ScheduleCalendarEntry {
    id: number;
    place: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    type: string;
    course?: {name: string; code: string};
}

const DAYS = [
    'Понеделник',
    'Вторник',
    'Сряда',
    'Четвъртък',
    'Петък',
    'Събота',
    'Неделя'
];

const DAY_SHORT: Record<string, string> = {
    Понеделник: 'Пн',
    Вторник: 'Вт',
    Сряда: 'Ср',
    Четвъртък: 'Чт',
    Петък: 'Пт',
    Събота: 'Сб',
    Неделя: 'Нд'
};

const TYPE_COLORS: Record<string, {bg: string; border: string}> = {
    лекция: {bg: '#dbeafe', border: '#2563eb'},
    семинар: {bg: '#dcfce7', border: '#16a34a'},
    практикум: {bg: '#ffedd5', border: '#ea580c'}
};

const DEFAULT_START = 8 * 60;
const DEFAULT_END = 20 * 60;

const timeToMinutes = (time: string) => {
    const [h, m] = time.slice(0, 5).split(':').map(Number);
    return h * 60 + (m || 0);
};

const formatTime = (time: string) => time?.slice(0, 5) ?? '';

interface WeeklyScheduleCalendarProps {
    entries: ScheduleCalendarEntry[];
    emptyMessage?: string;
}

export const WeeklyScheduleCalendar = ({
    entries,
    emptyMessage = 'Няма записи в графика.'
}: WeeklyScheduleCalendarProps) => {
    if (entries.length === 0) {
        return (
            <div className="schedule-calendar-empty">{emptyMessage}</div>
        );
    }

    const allStarts = entries.map(e => timeToMinutes(e.startTime));
    const allEnds = entries.map(e => timeToMinutes(e.endTime));
    const rangeStart = Math.min(DEFAULT_START, ...allStarts);
    const rangeEnd = Math.max(DEFAULT_END, ...allEnds);
    const range = rangeEnd - rangeStart;

    const hourLabels: number[] = [];
    for (let m = rangeStart; m <= rangeEnd; m += 60) {
        hourLabels.push(m);
    }

    const entriesByDay = DAYS.reduce(
        (acc, day) => {
            acc[day] = entries
                .filter(e => e.dayOfWeek === day)
                .sort(
                    (a, b) =>
                        timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
                );
            return acc;
        },
        {} as Record<string, ScheduleCalendarEntry[]>
    );

    return (
        <div className="schedule-calendar">
            <div className="schedule-calendar-legend">
                {Object.entries(TYPE_COLORS).map(([type, colors]) => (
                    <span key={type} className="schedule-legend-item">
                        <span
                            className="schedule-legend-dot"
                            style={{backgroundColor: colors.border}}
                        />
                        {type}
                    </span>
                ))}
            </div>

            <div className="schedule-calendar-grid">
                <div className="schedule-time-column">
                    <div className="schedule-corner" />
                    {hourLabels.map(minutes => (
                        <div key={minutes} className="schedule-time-label">
                            {String(Math.floor(minutes / 60)).padStart(2, '0')}
                            :00
                        </div>
                    ))}
                </div>

                {DAYS.map(day => (
                    <div key={day} className="schedule-day-column">
                        <div className="schedule-day-header">
                            <span className="schedule-day-short">
                                {DAY_SHORT[day]}
                            </span>
                            <span className="schedule-day-full">{day}</span>
                        </div>
                        <div
                            className="schedule-day-body"
                            style={{
                                minHeight: `${hourLabels.length * 52}px`
                            }}
                        >
                            {hourLabels.map(minutes => (
                                <div
                                    key={minutes}
                                    className="schedule-hour-line"
                                />
                            ))}
                            {entriesByDay[day].map(entry => {
                                const start = timeToMinutes(entry.startTime);
                                const end = timeToMinutes(entry.endTime);
                                const top =
                                    ((start - rangeStart) / range) * 100;
                                const height = Math.max(
                                    ((end - start) / range) * 100,
                                    6
                                );
                                const colors =
                                    TYPE_COLORS[entry.type] ??
                                    TYPE_COLORS['лекция'];

                                return (
                                    <div
                                        key={entry.id}
                                        className="schedule-event"
                                        style={{
                                            top: `${top}%`,
                                            height: `${height}%`,
                                            backgroundColor: colors.bg,
                                            borderLeftColor: colors.border
                                        }}
                                        title={`${entry.course?.name ?? ''} · ${entry.place}`}
                                    >
                                        <div className="schedule-event-code">
                                            {entry.course?.code ?? '—'}
                                        </div>
                                        <div className="schedule-event-time">
                                            {formatTime(entry.startTime)}–
                                            {formatTime(entry.endTime)}
                                        </div>
                                        <div className="schedule-event-meta">
                                            {entry.type} · {entry.place}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
