import { BaseModel } from './base.model';
import { Student } from './student.model';
import { Teacher } from './teacher.model';

export class User extends BaseModel {
    static get tableName() {
        return 'users';
    }

    username!: string;
    name!: string;
    phoneNumber?: string;
    email!: string;
    passwordHash!: string;
    isAdmin!: boolean;

    static get relationMappings() {
        return {
            student: {
                relation: BaseModel.HasOneRelation,
                modelClass: Student,
                join: {
                    from: 'users.id',
                    to: 'students.userId',
                },
            },
            teacher: {
                relation: BaseModel.HasOneRelation,
                modelClass: Teacher,
                join: {
                    from: 'users.id',
                    to: 'teachers.userId',
                },
            },
        };
    }
}
