import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('students_courses', (table) => {
        table.increments('id').primary();
        table.integer('grade').unsigned().nullable();
        table
            .integer('student_id')
            .notNullable()
            .references('students')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .integer('course_id')
            .notNullable()
            .references('courses')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('students_courses');
}

