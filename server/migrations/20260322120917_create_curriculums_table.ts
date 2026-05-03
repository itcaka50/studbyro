import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('curriculums', (table) => {
        table.increments('id').primary();
        table.string('name').unique().notNullable();
        table.date('start_year').notNullable();
        table.enum('education_form', ['задочно', 'редовно']).notNullable();
        table.integer('semester_count').unsigned().notNullable();
        table.enum('type', ['бакалавър', 'магистър', 'доктор']).notNullable();
        table.text('link').nullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('curriculums');
}
