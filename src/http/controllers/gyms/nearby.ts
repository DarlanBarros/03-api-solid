import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gym.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    userLatitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    userLongitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { userLatitude, userLongitude } = nearbyGymsQuerySchema.parse(
    request.query,
  )

  const fetchNearbyGymUseCase = makeFetchNearbyGymsUseCase()

  const gyms = await fetchNearbyGymUseCase.execute({
    userLatitude,
    userLongitude,
  })

  return reply.status(200).send(gyms)
}
