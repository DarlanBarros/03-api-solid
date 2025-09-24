import type { UsersRepository } from '@/repositories/users-repository.js'
import type { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface GetUserProfileRequest {
  userId: string
}

interface GetuserProfileResponse {
  user: User
}

export class GetUserProfileUseCase {
  private usersRepository: UsersRepository
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({
    userId,
  }: GetUserProfileRequest): Promise<GetuserProfileResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
