import type { PrismaClient } from '@prisma/client'
import type { SessionRepository } from '@/src/application/ports/session-repository'
import type { Session } from '@/src/domain/entities/session'
import type { UserId } from '@/src/domain/value-objects/user-id'
import { sessionToDomain, sessionToPrisma } from '../mappers/session-mapper'

export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaClient) {}

  async save(session: Session): Promise<void> {
    const data = sessionToPrisma(session)
    await this.prisma.session.upsert({
      where: { id: session.id },
      update: {
        expiresAt: data.expiresAt,
      },
      create: data,
    })
  }

  async findById(id: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { id },
    })
    return session ? sessionToDomain(session) : null
  }

  async findByUserId(userId: UserId): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId: userId.toString() },
    })
    return sessions.map((session) => sessionToDomain(session))
  }

  async delete(id: string): Promise<void> {
    await this.prisma.session.delete({
      where: { id },
    })
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
  }
}
