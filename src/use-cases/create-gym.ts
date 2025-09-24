import type { GymsRepository } from '@/repositories/gyms-repository.js'
import type { Gym } from '@prisma/client'

interface GymUseCaseRequest {
  title: string
  phone: string | null
  description: string | null
  latitude: number
  longitude: number
}

interface GymUseCaseResponse {
  gym: Gym
}

export class GymUseCase {
  constructor(private gymsRespository: GymsRepository) {}

  async execute({
    title,
    phone,
    description,
    latitude,
    longitude,
  }: GymUseCaseRequest): Promise<GymUseCaseResponse> {
    const gym = await this.gymsRespository.create({
      title,
      phone,
      description,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
