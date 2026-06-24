import { BaseModel } from './base.model';
import { Course } from './course.model';

export type DayOfWeek =
    | 'Понеделник'
    | 'Вторник'
    | 'Сряда'
    | 'Четвъртък'
    | 'Петък'
    | 'Събота'
    | 'Неделя';

export type ScheduleType = 'лекция' | 'семинар' | 'практикум';

export class Schedule extends BaseModel {
    static get tableName() {
        return 'schedules';
    }

    place!: string;
    courseId!: number;
    dayOfWeek!: DayOfWeek;
    startTime!: string;
    endTime!: string;
    type!: ScheduleType;

    static get relationMappings() {
        return {
            course: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Course,
                join: {
                    from: 'schedules.courseId',
                    to: 'courses.id',
                },
            },
        };
    }
}
