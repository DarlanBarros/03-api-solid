import request from 'supertest'
import { app } from '@/app.js'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby Gym (e2)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to search nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Goat Gym',
        description: 'Improve your energy',
        phone: '22222222',
        latitude: -23.5558,
        longitude: -46.6323,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Predator Gym',
        description: 'Boost your strength',
        phone: '22222222',
        latitude: -23.9608,
        longitude: -46.3336,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        userLatitude: -23.55052,
        userLongitude: -46.633308,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Goat Gym',
      }),
    ])
  })
})
