import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositories.js'
import { RegisterUseCase } from '../register.js'

export function makeRegisterUseCase() {
  const userRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(userRepository)

  return registerUseCase
}
