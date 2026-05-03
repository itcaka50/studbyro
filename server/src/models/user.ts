import { Model, RelationMappings, RelationMappingsThunk } from 'objection';
//import { Message } from './message'; 

export class User extends Model {
  static get tableName() {
    return 'users';
  }

  id!: number;
  username!: string;
  email!: string;
  password_hash!: string;
  is_admin!: boolean;
/*
  static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
    sentMessages: {
      relation: Model.HasManyRelation,
      modelClass: Message,           
      join: {
        from: 'users.id',             
        to: 'messages.sender_id'      
      }
    },
    receivedMessages: {
      relation: Model.HasManyRelation,
      modelClass: Message,
      join: {
        from: 'users.id',
        to: 'messages.receiver_id'
      }
    }
  });
*/
}