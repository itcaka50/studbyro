import { Model, snakeCaseMappers } from 'objection';

export class BaseModel extends Model {
    static get columnNameMappers() {
        return snakeCaseMappers();
    }

    id!: number;
    createdAt!: Date;
    updatedAt!: Date;

    $beforeInsert() {
        const now = new Date();
        this.createdAt = now;
        this.updatedAt = now;
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }
}
