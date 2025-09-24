import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.js'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to list nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Smart Fit',
      latitude: -23.5558,
      longitude: -46.6323,
    })

    await gymsRepository.create({
      title: 'Brasil CrossFit',
      latitude: -23.564,
      longitude: -46.652,
    })

    await gymsRepository.create({
      title: 'Goat Gym',
      latitude: -23.9608,
      longitude: -46.3336,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.55052,
      userLongitude: -46.633308,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Smart Fit' }),
      expect.objectContaining({ title: 'Brasil CrossFit' }),
    ])
  })
})
