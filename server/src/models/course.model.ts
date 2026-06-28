import { BaseModel } from './base.model';
import { Teacher } from './teacher.model';
import { Curriculum } from './curriculum.model';
import { Department } from './department.model';

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
                        from: 'teachers_courses.course_id',
                        to: 'teachers_courses.teacher_id',
                    },
                    to: 'teachers.userId',
                },
            },
            curriculums: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: Curriculum,
                join: {
                    from: 'courses.id',
                    through: {
                        from: 'curriculums_courses.course_id',
                        to: 'curriculums_courses.curriculum_id',
                    },
                    to: 'curriculums.id',
                },
            },
        };
    }
}
