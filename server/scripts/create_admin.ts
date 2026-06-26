import { Model } from 'objection';
import Knex from 'knex';
import bcrypt from 'bcrypt';
import knexConfig from '../knexfile';
import { User } from '../src/models/user.model';

const knex = Knex(knexConfig as any);
Model.knex(knex);

async function createAdmin() {
    try {
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Създавам администратор...');

        const admin = await User.query().insert({
            username: 'admin',
            name: 'Administrator',
            phoneNumber: '0897849245',
            email: 'admin@studbyro.bg',
            passwordHash: hashedPassword,
            isAdmin: true,
        });

        console.log('Администраторът е създаден успешно:', admin.username);
    } catch (error) {
        console.error('Грешка при създаване на админ:', error);
    } finally {
        await knex.destroy();
    }
}

createAdmin();
