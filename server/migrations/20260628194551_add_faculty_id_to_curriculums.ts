import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('curriculums', (table) => {
        table
            .integer('faculty_id')
            .unsigned()
            .references('id')
            .inTable('faculties')
            .onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('curriculums', (table) => {
        table.dropColumn('faculty_id');
    });
}
