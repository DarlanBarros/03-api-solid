import type { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import type { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-checkin-validation-error.js'

interface ValidadeCheckInRequest {
  checkInId: string
}

interface ValidadeCheckInResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidadeCheckInRequest): Promise<ValidadeCheckInResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const differenceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (differenceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
