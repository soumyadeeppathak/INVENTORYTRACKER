import type { Group as PrismaGroup } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { Group } from '@/src/domain/entities/group'
import { Emoji } from '@/src/domain/value-objects/emoji'

export function groupToDomain(prismaGroup: PrismaGroup): Group {
  return Group.reconstitute({
    id: prismaGroup.id,
    name: prismaGroup.name,
    emoji: Emoji.create(prismaGroup.emoji),
    createdAt: prismaGroup.createdAt,
  })
}

export function groupToPrisma(group: Group): Prisma.GroupCreateInput {
  return {
    id: group.id.toString(),
    name: group.name,
    emoji: group.emoji.toString(),
    createdAt: group.createdAt,
  }
}
