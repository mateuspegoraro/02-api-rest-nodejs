import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
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
