import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('curriculums_courses', (table) => {
        table.increments('id').primary();
        table
            .integer('curriculum_id')
            .notNullable()
            .references('id')
            .inTable('curriculums')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .integer('course_id')
            .notNullable()
            .references('id')
            .inTable('courses')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.integer('credits').notNullable();
        table.timestamps(true, true);
        table.unique(['curriculum_id', 'course_id']);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('curriculums_courses');
}

