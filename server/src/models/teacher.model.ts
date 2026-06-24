import { BaseModel } from './base.model';
import { User } from './user.model';
import { Department } from './department.model';

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
