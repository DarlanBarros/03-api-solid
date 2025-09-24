import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms.js'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Smart Fit',
      latitude: 123,
      longitude: 123,
    })

    await gymsRepository.create({
      title: 'Academia Brasil',
      latitude: 123,
      longitude: 123,
    })

    await gymsRepository.create({
      title: 'Galo CrossFit',
      latitude: 123,
      longitude: 123,
    })

    const { gyms } = await sut.execute({
      query: 'Fit',
      page: 1,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Smart Fit' }),
      expect.objectContaining({ title: 'Galo CrossFit' }),
    ])
  })

  it('shoud be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Smart Fit ${i}`,
        latitude: 123,
        longitude: 123,
      })
    }

    const { gyms } = await sut.execute({
      page: 2,
      query: 'Fit',
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Smart Fit 21' }),
      expect.objectContaining({ title: 'Smart Fit 22' }),
    ])
  })
})
