import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register.js'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-alredy-exists-error.js'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register an user.', async () => {
    const { user } = await sut.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration.', async () => {
    const { user } = await sut.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    })

    const isPasswordCorrectHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectHashed).toBe(true)
  })

  it('should not be able to register with the same email twice.', async () => {
    const email = 'jhondoe@gmail.com'

    await sut.execute({
      name: 'Jhon Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Jhon Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
