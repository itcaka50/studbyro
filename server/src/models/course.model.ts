import { BaseModel } from './base.model';
import { Department } from './department.model';
import { Teacher } from './teacher.model';

export class Course extends BaseModel {
    static get tableName() {
        return 'courses';
    }

    name!: string;
    code!: string;
    link?: string;
    totalHours?: number;
    departmentId!: number;

    static get relationMappings() {
        return {
            department: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Department,
                join: {
                    from: 'courses.departmentId',
                    to: 'departments.id',
                },
            },
            teachers: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: Teacher,
                join: {
                    from: 'courses.id',
                    through: {
                        from: 'teachers_courses.courseId',
                        to: 'teachers_courses.teacherId',
                    },
                    to: 'teachers.userId',
                },
            },
        };
    }
}
