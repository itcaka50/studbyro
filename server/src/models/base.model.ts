import { Model, snakeCaseMappers } from 'objection';

export class BaseModel extends Model {
    static get columnNameMappers() {
        return snakeCaseMappers();
    }

    id!: number;
    createdAt!: Date;
    updatedAt!: Date;

    $beforeUpdate() {
        this.updatedAt = new Date();
    }
}
