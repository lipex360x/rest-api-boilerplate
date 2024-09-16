import { describe, expect, test } from 'bun:test'

import { ShowUserUseCase } from '@/application/usecases'
import { User } from '@/domain/entities'
import { UserRepositoryMemory } from '@/infra/repositories/memory'

describe('INT', () => {
  test('show user', async () => {
    const repository = new UserRepositoryMemory()
    const user1 = User.create('john doe', 'johndoe@mail.com')
    const user2 = User.create('john three', 'johntrhee@mail.com')
    const user3 = User.create('john travolta', 'johntravolta@mail.com')
    repository.database.push(user1)
    repository.database.push(user2)
    repository.database.push(user3)
    const usecase = new ShowUserUseCase(repository)
    const userId = user3.userId
    const output = await usecase.execute(userId)
    expect(output.userId).toEqual(userId)
    expect(output).toEqual({
      userId: expect.any(String),
      name: 'john travolta',
      email: 'johntravolta@mail.com',
    })
  })
})
