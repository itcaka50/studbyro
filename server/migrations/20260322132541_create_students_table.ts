import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('students', (table) => {
        table.string('faculty_number').primary().index();
        table.string('ucn').unique().notNullable();
        table
            .enum('financing', ['държавна поръчка', 'платено обучение'])
            .notNullable();
        table.string('address').notNullable();
        table
            .integer('user_id')
            .notNullable()
            .unique()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .integer('curriculum_id')
            .notNullable()
            .references('id')
            .inTable('curriculums')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('students');
}
