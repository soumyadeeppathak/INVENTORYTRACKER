import type { PrismaClient } from '@prisma/client'
import type { MagicLinkRepository } from '@/src/application/ports/magic-link-repository'
import type { MagicLink } from '@/src/domain/entities/magic-link'
import { magicLinkToDomain, magicLinkToPrisma } from '../mappers/magic-link-mapper'

export class PrismaMagicLinkRepository implements MagicLinkRepository {
  constructor(private prisma: PrismaClient) {}

  async save(link: MagicLink): Promise<void> {
    const data = magicLinkToPrisma(link)
    await this.prisma.magicLink.upsert({
      where: { id: link.id },
      update: {
        usedAt: data.usedAt,
      },
      create: data,
    })
  }

  async findByToken(token: string): Promise<MagicLink | null> {
    const link = await this.prisma.magicLink.findUnique({
      where: { token },
    })
    return link ? magicLinkToDomain(link) : null
  }

  async markUsed(token: string): Promise<void> {
    await this.prisma.magicLink.update({
      where: { token },
      data: { usedAt: new Date() },
    })
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.magicLink.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
  }
}
