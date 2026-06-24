import { BaseModel } from './base.model';
import { Teacher } from './teacher.model';
import { Course } from './course.model';

export class TeacherCourse extends BaseModel {
    static get tableName() {
        return 'teachers_courses';
    }

    teacherId!: number;
    courseId!: number;

    static get relationMappings() {
        return {
            teacher: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Teacher,
                join: {
                    from: 'teachers_courses.teacherId',
                    to: 'teachers.userId',
                },
            },
            course: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Course,
                join: {
                    from: 'teachers_courses.courseId',
                    to: 'courses.id',
                },
            },
        };
    }
}
