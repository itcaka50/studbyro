import { BaseModel } from './base.model';
import { Department } from './department.model';
import { Curriculum } from './curriculum.model';

export class Faculty extends BaseModel {
    static get tableName() {
        return 'faculties';
    }

    name!: string;
    code!: string;

    static get relationMappings() {
        return {
            departments: {
                relation: BaseModel.HasManyRelation,
                modelClass: Department,
                join: { from: 'faculties.id', to: 'departments.facultyId' },
            },
            curriculums: {
                relation: BaseModel.HasManyRelation,
                modelClass: Curriculum,
                join: { from: 'faculties.id', to: 'curriculums.facultyId' },
            },
        };
    }
}
