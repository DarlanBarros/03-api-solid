import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkins-repository.js'
import { ValidateCheckInUseCase } from '../validate-checkin.js'

export function makeValidadeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(checkInsRepository)

  return useCase
}
