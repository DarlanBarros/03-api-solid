import { makeValidadeCheckInUseCase } from '@/use-cases/factories/make-validate-checkin.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const checkInsParamsSchema = z.object({
    checkInId: z.uuid(),
  })

  const { checkInId } = checkInsParamsSchema.parse(request.params)

  const validateCheckInsUseCase = makeValidadeCheckInUseCase()

  await validateCheckInsUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
