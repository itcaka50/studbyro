import { BaseModel } from './base.model';
import { User } from './user.model';
import { Department } from './department.model';
import { Course } from './course.model';

export class Teacher extends BaseModel {
    static get tableName() {
        return 'teachers';
    }

    static get idColumn() {
        return 'userId';
    }

    userId!: number;
    departmentId!: number;

    user?: User;
    department?: Department;
    courses?: Course[];

    static get relationMappings() {
        return {
            user: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'teachers.userId',
                    to: 'users.id',
                },
            },
            courses: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: Course,
                join: {
                    from: 'teachers.userId',
                    through: {
                        from: 'teachers_courses.teacher_id',
                        to: 'teachers_courses.course_id',
                    },
                    to: 'courses.id',
                },
            },
            department: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Department,
                join: {
                    from: 'teachers.departmentId',
                    to: 'departments.id',
                },
            },
        };
    }
}
