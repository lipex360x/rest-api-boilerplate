import { StatusCodes } from 'http-status-codes'
import { inject, injectable } from 'tsyringe'

import type { UserRepository } from '@/infra/repositories'

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('userRepository')
    private readonly repository: UserRepository,
  ) {}

  async execute(userId: string) {
    const getUser = await this.repository.findById(userId)
    if (!getUser) throw new Error('user not found', { cause: StatusCodes.NOT_FOUND })
    await this.repository.delete(userId)
  }
}
