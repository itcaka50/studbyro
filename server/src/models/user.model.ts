import { BaseModel } from './base.model';

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
}
