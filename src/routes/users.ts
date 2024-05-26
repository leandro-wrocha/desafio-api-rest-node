import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import db from '../database'
import { Diet } from '../database/interfaces'

interface CustomError extends Error {}

async function usersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get('/metrics', async (request, reply) => {
    const { session_id } = request.cookies

    const meals = await db('meals')
      .where('session_id', session_id)
      .select()
      .orderBy('created_at')

    let count_is_included = 0
    const metrics = {
      meals_registered: meals.length,
      meals_is_included: 0,
      meals_is_not_included: 0,
      better_sequencie_is_included: 0
    }

    meals.forEach((meal) => {
      if (meal.diet === 'is_included') {
        metrics.meals_is_included += 1

        count_is_included += 1
      }

      if (meal.diet === 'is_not_included') {
        metrics.meals_is_not_included += 1

        count_is_included = 0
      }

      if (count_is_included >= metrics.better_sequencie_is_included) {
        metrics.better_sequencie_is_included = count_is_included
      }
    })

    return reply.status(200).send(metrics)
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
      email: z.string()
    })

    const { username, email } = createUserBodySchema.parse(request.body)

    try {
      const [user] = await db('users')
        .insert({
          username,
          email
        })
        .returning('session_id')

      if (user.session_id) {
        reply.cookie('session_id', user.session_id, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
      }

      return reply.status(201).send()
    } catch (error) {
      const typed_error = error as CustomError

      console.log('usersRoutes::create_user')
      console.log(`${typed_error.name}: ${typed_error.message}`)

      return reply.status(500).send()
    }
  })
}

export default usersRoutes
