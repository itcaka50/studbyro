import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('schedules', (table) => {
        table.increments('id').primary();
        table.string('place').notNullable();
        table
            .integer('course_id')
            .notNullable()
            .references('id')
            .inTable('courses')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .enum('day_of_week', [
                'Понеделник',
                'Вторник',
                'Сряда',
                'Четвъртък',
                'Петък',
                'Събота',
                'Неделя',
            ])
            .notNullable();
        table.time('start_time').notNullable();
        table.time('end_time').notNullable();
        table.enu('type', ['лекция', 'семинар', 'практикум']).notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('schedules');
}
