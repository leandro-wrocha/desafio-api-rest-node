import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('session_id').unique().defaultTo(knex.fn.uuid())
  })

  await knex.schema.alterTable('meals', (table) => {
    table.string('session_id').unique().defaultTo(knex.fn.uuid())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('session_id')
  })

  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('session_id')
  })
}
