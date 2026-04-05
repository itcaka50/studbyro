import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('users', (table) => {
        table.increments('id').primary();
        table.string('username', 25).unique().notNullable();
        table.string('name').notNullable().index();
        table.string('phone_number').unique();
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.boolean('is_admin').notNullable().defaultTo('0');
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('users');
}

