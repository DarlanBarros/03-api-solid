import type { FastifyInstance } from 'fastify'
import { register } from './register.js'
import { autheticate } from './authenticate.js'
import { profile } from './profile.js'
import { verifyJWT } from '@/http/middlewares/verify-jwt.js'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', autheticate)

  // Authenticated routes
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
