import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-checkins-history.js'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkins-repository.js'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  return useCase
}
