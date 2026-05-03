import { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { config } from './src/config';

export default {
    client: 'pg',
    connection: config.db,
    ...knexSnakeCaseMappers(),
    debug: true,
    migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
    },
} as Knex.Config;
