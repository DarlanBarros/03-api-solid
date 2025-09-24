import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositories.js'
import { GetUserProfileUseCase } from '../get-user-profile.js'

export function makeGetUserProfileUseCase() {
  const userRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(userRepository)

  return useCase
}
