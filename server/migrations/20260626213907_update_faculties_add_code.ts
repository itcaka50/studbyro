import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('faculties', (table) => {
        table.string('code', 10).unique().notNullable().defaultTo('N/A');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('faculties', (table) => {
        table.dropColumn('code');
    });
}
