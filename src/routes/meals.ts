import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import db from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { Diet } from '../database/interfaces'

interface CustomError extends Error {}

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { session_id } = request.cookies

    const meals = await db('meals').where('session_id', session_id).select()

    return {
      meals
    }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { session_id } = request.cookies

    const getMealsParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const meals = await db('meals')
      .where('id', id)
      .where('session_id', session_id)
      .first()

    return {
      meals
    }
  })

  app.post('/', async (request, reply) => {
    const createMealSchemaBody = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.nativeEnum(Diet)
    })

    const { name, description, diet } = createMealSchemaBody.parse(request.body)

    const { session_id } = request.cookies

    await db('meals').insert({
      name,
      description,
      diet,
      session_id
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const updateMealSchemaBody = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      diet: z.nativeEnum(Diet).optional()
    })

    const getMealSchemaParams = z.object({
      id: z.string()
    })

    const { name, description, diet } = updateMealSchemaBody.parse(request.body)

    const { id } = getMealSchemaParams.parse(request.params)

    const { session_id } = request.cookies

    try {
      await db('meals').where('id', id).where('session_id', session_id).update({
        name,
        description,
        diet,
        updated_at: db.fn.now()
      })
    } catch (error) {
      const typed_error = error as CustomError

      console.log('usersRoutes::create_user')
      console.log(`${typed_error.name}: ${typed_error.message}`)

      return reply.status(500).send()
    }
  })

  app.delete('/:id', async (request, reply) => {
    const getMealSchemaParams = z.object({
      id: z.string()
    })

    const { id } = getMealSchemaParams.parse(request.params)

    try {
      await db('meals').where('id', id).delete()

      return reply.status(204).send()
    } catch (error) {
      const typed_error = error as CustomError

      console.log('usersRoutes::create_user')
      console.log(`${typed_error.name}: ${typed_error.message}`)

      return reply.status(500).send()
    }
  })
}
