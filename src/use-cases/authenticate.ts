import type { UsersRepository } from '@/repositories/users-repository.js'
import { compare } from 'bcryptjs'
import { InvalidCredentialError } from './errors/invalid-credentials-error.js'
import type { User } from '@prisma/client'

interface AuthenticateRequest {
  email: string
  password: string
}

interface AuthenticateResponse {
  user: User
}

export class AuthenticateUseCase {
  private userRepository

  constructor(userRepository: UsersRepository) {
    this.userRepository = userRepository
  }

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialError()
    }

    return {
      user,
    }
  }
}
