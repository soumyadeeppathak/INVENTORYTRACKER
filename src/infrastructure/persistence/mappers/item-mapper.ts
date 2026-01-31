import type { Item as PrismaItem } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { Item } from '@/src/domain/entities/item'
import { CategoryId } from '@/src/domain/value-objects/category-id'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { LocationId } from '@/src/domain/value-objects/location-id'

export function itemToDomain(prismaItem: PrismaItem): Item {
  return Item.reconstitute({
    id: prismaItem.id,
    name: prismaItem.name,
    emoji: Emoji.create(prismaItem.emoji),
    quantity: prismaItem.quantity,
    locationId: LocationId.create(prismaItem.locationId),
    categoryId: prismaItem.categoryId ? CategoryId.create(prismaItem.categoryId) : null,
    createdAt: prismaItem.createdAt,
    updatedAt: prismaItem.updatedAt,
  })
}

export function itemToPrisma(item: Item): Prisma.ItemCreateInput {
  return {
    id: item.id.toString(),
    name: item.name,
    emoji: item.emoji.toString(),
    quantity: item.quantity,
    location: {
      connect: { id: item.locationId.toString() },
    },
    category: item.categoryId
      ? {
          connect: { id: item.categoryId.toString() },
        }
      : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}
