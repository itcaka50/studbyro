import { BaseModel } from './base.model';
import { User } from './user.model';
import { Curriculum } from './curriculum.model';

export type FinancingType = 'държавна поръчка' | 'платено обучение';

export class Student extends BaseModel {
    static get tableName() {
        return 'students';
    }

    static get idColumn() {
        return 'faculty_number';
    }

    facultyNumber!: string;
    ucn!: string;
    financing!: FinancingType;
    address!: string;
    userId!: number;
    curriculumId!: number;

    static get relationMappings() {
        return {
            user: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'students.userId',
                    to: 'users.id',
                },
            },
            curriculum: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Curriculum,
                join: {
                    from: 'students.curriculumId',
                    to: 'curriculums.id',
                },
            },
        };
    }
}
