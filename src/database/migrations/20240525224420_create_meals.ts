import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid())
    table.string('name', 255)
    table.string('description', 255)
    table.enum('diet', ['is_included', 'is_not_included'])
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}
