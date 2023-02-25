import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions')
      .insert({
        id: randomUUID(),
        session_id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
      })
      .returning('*')

    return response.status(201).send()
  })

  app.get('/transactions', async () => {
    const transaction = await knex('transactions')
      .insert({
        id: randomUUID(),
        session_id: randomUUID(),
        title: 'Transação de teste',
        amount: 19.99,
      })
      .returning('*')

    const transactions = await knex('transactions')
      .where('amount', 19.99)
      .select('*')

    return { insert: transaction, select: transactions }
  })
}
