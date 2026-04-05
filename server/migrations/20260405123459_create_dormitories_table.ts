import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('dormitories', (table) => {
        table.increments('id').primary();
        table
            .integer('student_id')
            .notNullable()
            .references('faculty_number')
            .inTable('students')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('dormitories');
}

