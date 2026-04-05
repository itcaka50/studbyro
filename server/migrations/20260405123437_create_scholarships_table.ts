import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('scholarships', (table) => {
        table.increments('id').primary();
        table.string('type').notNullable(); 
        table.boolean('status').defaultTo('0').notNullable();
        table
            .integer('student_id')
            .notNullable()
            .references('students')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('scholarships');
}

