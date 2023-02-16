import { randomUUID } from 'node:crypto'
import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

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

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running')
})
