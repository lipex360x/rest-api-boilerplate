/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/domain/entities'

import type { PaginatedResults, UserRepository } from '../user.repository'

export class UserRepositoryMemory implements UserRepository {
  database: unknown[] = []

  async save(user: User): Promise<void> {
    this.database.push(user)
  }

  async list(page: number, perPage: number): Promise<PaginatedResults<User>> {
    const totalPages = Math.ceil(this.database.length / perPage)
    if (totalPages !== 0 && page > totalPages) throw new Error(`invalid page. last page: ${totalPages}`)
    const getUsers: any[] = this.database.slice((page - 1) * perPage, page * perPage)
    const users: User[] = []
    for (const data of getUsers) {
      const user = new User(data.userId, data.name, data.email)
      users.push(user)
    }
    return { page, perPage, registers: this.database.length, totalPages, data: users }
  }

  async findById(userId: string): Promise<User | null> {
    const getUser: any = this.database.find((data: any) => data.userId === userId)
    if (!getUser) return null
    return new User(getUser.userId, getUser.name, getUser.email)
  }

  async findByEmail(email: string): Promise<User | null> {
    const getUser: any = this.database.find((data: any) => data.email === email)
    if (!getUser) return null
    return new User(getUser.userId, getUser.name, getUser.email)
  }

  async update(user: User): Promise<void> {
    const index = this.database.findIndex((data: any) => data.userId === user.userId)
    this.database[index] = user
  }

  async delete(userId: string): Promise<void> {
    this.database = this.database.filter((data: any) => data.userId !== userId)
  }
}
