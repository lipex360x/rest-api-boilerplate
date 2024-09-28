import { inject, injectable } from 'tsyringe'

import { User } from '@/domain/entities'
import type { UserRepository } from '@/infra/repositories'

@injectable()
export class ListUsersUseCase {
  private DEFAULT_PAGE = 1
  private DEFAULT_PERPAGE = 15

  constructor(
    @inject('userRepository')
    private readonly repository: UserRepository,
  ) {}

  async execute(input?: Input): Promise<Output<UserData>> {
    const page = input && input.page && input.page >= 1 ? input.page : this.DEFAULT_PAGE
    const perPage =
      input && input.perPage && input.perPage >= 1 && input.perPage <= this.DEFAULT_PERPAGE
        ? input.perPage
        : this.DEFAULT_PERPAGE
    const getUsers = await this.repository.list(page, perPage)
    const users: UserData[] = []
    for (const data of getUsers.data) {
      const user = new User(data.userId, data.name, data.email)
      users.push({
        userId: user.userId,
        name: user.name,
        email: user.email,
      })
    }
    return { page, perPage, registers: getUsers.registers, totalPages: getUsers.totalPages, data: users }
  }
}

type UserData = {
  userId: string
  name: string
  email: string
}

type Output<T> = {
  page: number
  perPage: number
  registers: number
  totalPages: number
  data: T[]
}

type Input = {
  page?: number
  perPage?: number
}
