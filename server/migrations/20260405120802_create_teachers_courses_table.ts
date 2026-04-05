import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists("teachers_courses", (table) => {
        table.increments('id').primary();
        table.integer('teacher_id')
            .notNullable()
            .references('user_id')
            .inTable('teachers')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.integer('course_id')
            .notNullable()
            .references('id')
            .inTable('courses')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.unique(['teacher_id', 'course_id']);
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('teachers_courses');
}

