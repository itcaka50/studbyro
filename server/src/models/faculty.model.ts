import { BaseModel } from './base.model';

export class Faculty extends BaseModel {
    static get tableName() {
        return 'faculties';
    }

    name!: string;
}
