import { BaseModel } from './base.model';
import { Student } from './student.model';

export class Dormitory extends BaseModel {
    static get tableName() {
        return 'dormitories';
    }

    studentId!: string;

    static get relationMappings() {
        return {
            student: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Student,
                join: {
                    from: 'dormitories.studentId',
                    to: 'students.facultyNumber',
                },
            },
        };
    }
}
