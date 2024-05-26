// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'
import { Diet } from '../database/interfaces'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      username: string
      email: string
      session_id: string
      created_at: Date
    }
    meals: {
      id: string
      name: string
      description: string
      diet: Diet
      session_id: string
      created_at: Date
      updated_at: Date
    }
  }
}
