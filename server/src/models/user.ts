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

    static get relationMappings() {
        const { Message } = require('./Message.model');

        return {
            sentMessages: {
                relation: BaseModel.HasManyRelation,
                modelClass: Message,
                join: {
                    from: 'users.id',
                    to: 'messages.senderId',
                },
            },
        };
    }
}
