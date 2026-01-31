import type { Location as PrismaLocation } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { Location } from '@/src/domain/entities/location'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'

export function locationToDomain(prismaLocation: PrismaLocation): Location {
  return Location.reconstitute({
    id: prismaLocation.id,
    name: prismaLocation.name,
    emoji: Emoji.create(prismaLocation.emoji),
    groupId: GroupId.create(prismaLocation.groupId),
    createdAt: prismaLocation.createdAt,
  })
}

export function locationToPrisma(location: Location): Prisma.LocationCreateInput {
  return {
    id: location.id.toString(),
    name: location.name,
    emoji: location.emoji.toString(),
    group: {
      connect: { id: location.groupId.toString() },
    },
    createdAt: location.createdAt,
  }
}
