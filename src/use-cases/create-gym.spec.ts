import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { GymUseCase } from './create-gym.js'

let gymsRespository: InMemoryGymsRepository
let sut: GymUseCase

describe('Gyms Use Case', () => {
  beforeEach(() => {
    gymsRespository = new InMemoryGymsRepository()
    sut = new GymUseCase(gymsRespository)
  })

  it('shoud be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia do Bode',
      description: 'Boost your energy',
      latitude: -23.55018,
      longitude: -46.63386,
      phone: '2555-0102',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
