import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists("courses", (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('code').notNullable().unique();
        table.text('link').nullable();
        table.integer('total_hours').unsigned().nullable();
        table.integer('department_id')
            .notNullable()
            .references('id')
            .inTable('departments')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.integer('teacher_id')
            .notNullable()
            .references('user_id')
            .inTable('teachers')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.timestamps(true, true);

    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('courses');
}

