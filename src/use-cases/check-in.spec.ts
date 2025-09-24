import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in.js'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { Prisma } from '@prisma/client'
import { MaxDistanceError } from './errors/max-distance-error.js'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkins-error.js'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Improve Your Body',
      description: null,
      phone: null,
      latitude: new Prisma.Decimal(-27.2092052),
      longitude: new Prisma.Decimal(-49.6401091),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    const { checkin } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkin.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 8, 12, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should be able to check in but in different days', async () => {
    vi.setSystemTime(new Date(2025, 8, 12, 0, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    vi.setSystemTime(new Date(2025, 8, 13, 0, 0, 0))

    const { checkin } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkin.id).toEqual(expect.any(String))
  })

  it('should not be able to chack in on distant gym', async () => {
    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.55094,
        userLongitude: -46.63231,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
