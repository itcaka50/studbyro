import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists("departments", (table) => {
        table.increments('id').primary();
        table.string('name').notNullable().unique();
        table.string('faculty_id')
            .notNullable()
            .references('id')
            .inTable('faculties')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('departments');
}

