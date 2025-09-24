import type { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import type { GymsRepository } from '@/repositories/gyms-repository.js'
import type { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkins-error.js'
import { MaxDistanceError } from './errors/max-distance-error.js'

interface CheckInRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInResponse {
  checkin: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInRequest): Promise<CheckInResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KM = 0.1

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkin = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkin,
    }
  }
}
