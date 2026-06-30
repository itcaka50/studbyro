import { Model } from 'objection';
import Knex from 'knex';
import bcrypt from 'bcrypt';
import knexConfig from '../knexfile';
import { User } from '../src/models/user.model';

const knex = Knex(knexConfig as any);
Model.knex(knex);

const ADMIN = {
    username: 'admin2',
    name: 'Administrator',
    email: 'admin2@studbyro.bg',
    phoneNumber: '0897849244',
    password: 'Admin1234',
};

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash(ADMIN.password, 10);

        const existing = await User.query()
            .where('email', ADMIN.email)
            .orWhere('username', ADMIN.username)
            .first();

        if (existing) {
            await User.query().patchAndFetchById(existing.id, {
                name: ADMIN.name,
                passwordHash: hashedPassword,
                isAdmin: true,
            });

            console.log(
                'Администраторът вече съществува — паролата е обновена.',
            );
            console.log(`  username: ${existing.username}`);
            console.log(`  email:    ${existing.email}`);
            console.log(`  password: ${ADMIN.password}`);
            return;
        }

        const phoneTaken = await User.query().findOne({
            phoneNumber: ADMIN.phoneNumber,
        });

        const admin = await User.query().insert({
            username: ADMIN.username,
            name: ADMIN.name,
            email: ADMIN.email,
            passwordHash: hashedPassword,
            isAdmin: true,
            ...(phoneTaken ? {} : { phoneNumber: ADMIN.phoneNumber }),
        });

        if (phoneTaken) {
            console.log(
                'Бележка: телефонът вече е зает — admin е създаден без phoneNumber.',
            );
        }

        console.log('Администраторът е създаден успешно.');
        console.log(`  username: ${admin.username}`);
        console.log(`  email:    ${admin.email}`);
        console.log(`  password: ${ADMIN.password}`);
    } catch (error) {
        console.error('Грешка при създаване на админ:', error);
        process.exitCode = 1;
    } finally {
        await knex.destroy();
    }
}

createAdmin();
