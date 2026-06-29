import { BaseModel } from './base.model';
import { Faculty } from './faculty.model';
import { Teacher } from './teacher.model';

export class Department extends BaseModel {
    static get tableName() {
        return 'departments';
    }

    name!: string;
    facultyId!: number;

    static get relationMappings() {
        return {
            faculty: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Faculty,
                join: { from: 'departments.facultyId', to: 'faculties.id' },
            },
            teachers: {
                relation: BaseModel.HasManyRelation,
                modelClass: Teacher,
                join: { from: 'departments.id', to: 'teachers.departmentId' },
            },
        };
    }
}
