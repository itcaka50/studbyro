import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('students_courses', (table) => {
        table.increments('id').primary();
        table.integer('grade').unsigned().nullable();
        table
            .integer('student_id')
            .notNullable()
            .references('faculty_number')
            .inTable('students')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .integer('course_id')
            .notNullable()
            .references('id')
            .inTable('courses')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.unique(['student_id', 'course_id']);
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('students_courses');
}

