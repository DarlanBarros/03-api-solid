import { GymUseCase } from '../create-gym.js'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'

export function makeGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new GymUseCase(gymsRepository)

  return useCase
}
