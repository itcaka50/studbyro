import { Schedule, DayOfWeek, ScheduleType } from '../models/schedule.model';

export interface ScheduleCreateData {
    place: string;
    courseId: number;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    type: ScheduleType;
}

export const getAllSchedules = async () => {
    return await Schedule.query()
        .withGraphFetched('course')
        .orderBy('dayOfWeek')
        .orderBy('startTime');
};

export const createScheduleRecord = async (data: ScheduleCreateData) => {
    return await Schedule.query().insert(data);
};

export const getCourseSchedule = async (courseId: number) => {
    return await Schedule.query()
        .where({ courseId })
        .orderBy('startTime', 'ASC');
};

export const updateScheduleRecord = async (
    id: number,
    data: Partial<ScheduleCreateData>,
) => {
    const updated = await Schedule.query().patchAndFetchById(id, data);
    if (!updated) throw new Error('Записът в графика не е намерен!');
    return updated;
};

export const deleteScheduleRecord = async (id: number) => {
    const deleted = await Schedule.query().deleteById(id);
    if (!deleted) throw new Error('Записът в графика не е намерен!');
    return true;
};
