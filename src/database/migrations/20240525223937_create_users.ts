import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid())
    table.string('username', 32).notNullable()
    table.string('email', 255).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
