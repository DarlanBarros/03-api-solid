import request from 'supertest'
import { app } from '@/app.js'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Goat Gym',
        description: 'Improve your energy',
        phone: '22222222',
        latitude: -23.5558,
        longitude: -46.6323,
      })

    expect(response.statusCode).toEqual(201)
  })
})
