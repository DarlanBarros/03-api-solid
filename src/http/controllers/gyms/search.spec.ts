import request from 'supertest'
import { app } from '@/app.js'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gym (e2)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

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

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Goat',
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
