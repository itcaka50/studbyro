import { BaseModel } from './base.model';
import { Student } from './student.model';

export class Scholarship extends BaseModel {
    static get tableName() {
        return 'scholarships';
    }

    type!: string;
    status!: boolean;
    studentId!: string;

    static get relationMappings() {
        return {
            student: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Student,
                join: {
                    from: 'scholarships.studentId',
                    to: 'students.facultyNumber',
                },
            },
        };
    }
}
