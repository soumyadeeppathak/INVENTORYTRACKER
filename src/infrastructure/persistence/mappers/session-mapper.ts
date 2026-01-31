import type { Session as PrismaSession } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { Session } from '@/src/domain/entities/session'
import { UserId } from '@/src/domain/value-objects/user-id'

export function sessionToDomain(prismaSession: PrismaSession): Session {
  return Session.reconstitute({
    id: prismaSession.id,
    userId: UserId.create(prismaSession.userId),
    expiresAt: prismaSession.expiresAt,
    createdAt: prismaSession.createdAt,
  })
}

export function sessionToPrisma(session: Session): Prisma.SessionCreateInput {
  return {
    id: session.id,
    user: {
      connect: { id: session.userId.toString() },
    },
    expiresAt: session.expiresAt,
    createdAt: session.createdAt,
  }
}
