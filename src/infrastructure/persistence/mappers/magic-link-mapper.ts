import type { MagicLink as PrismaMagicLink } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { MagicLink } from '@/src/domain/entities/magic-link'
import { Email } from '@/src/domain/value-objects/email'
import { UserId } from '@/src/domain/value-objects/user-id'

export function magicLinkToDomain(prismaMagicLink: PrismaMagicLink): MagicLink {
  return MagicLink.reconstitute({
    id: prismaMagicLink.id,
    token: prismaMagicLink.token,
    email: Email.create(prismaMagicLink.email),
    userId: prismaMagicLink.userId ? UserId.create(prismaMagicLink.userId) : null,
    expiresAt: prismaMagicLink.expiresAt,
    usedAt: prismaMagicLink.usedAt,
    createdAt: prismaMagicLink.createdAt,
  })
}

export function magicLinkToPrisma(magicLink: MagicLink): Prisma.MagicLinkCreateInput {
  return {
    id: magicLink.id,
    token: magicLink.token,
    email: magicLink.email.toString(),
    user: magicLink.userId
      ? {
          connect: { id: magicLink.userId.toString() },
        }
      : undefined,
    expiresAt: magicLink.expiresAt,
    usedAt: magicLink.usedAt,
    createdAt: magicLink.createdAt,
  }
}
