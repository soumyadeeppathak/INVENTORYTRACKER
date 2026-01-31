import type { PrismaClient } from '@prisma/client'
import type { UserRepository } from '@/src/application/ports/user-repository'
import type { User } from '@/src/domain/entities/user'
import type { Email } from '@/src/domain/value-objects/email'
import type { UserId } from '@/src/domain/value-objects/user-id'
import { userToDomain, userToPrisma } from '../mappers/user-mapper'

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    const data = userToPrisma(user)
    await this.prisma.user.upsert({
      where: { id: user.id.toString() },
      update: {
        email: data.email,
        name: data.name,
      },
      create: data,
    })
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id.toString() },
    })
    return user ? userToDomain(user) : null
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toString() },
    })
    return user ? userToDomain(user) : null
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.toString() },
    })
  }
}
