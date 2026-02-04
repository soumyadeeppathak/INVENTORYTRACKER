import type { PrismaClient } from '@prisma/client'
import type { ItemRepository, ItemWithCategory, SearchResultItem } from '@/src/application/ports/item-repository'
import type { Item } from '@/src/domain/entities/item'
import type { ItemId } from '@/src/domain/value-objects/item-id'
import type { LocationId } from '@/src/domain/value-objects/location-id'
import type { UserId } from '@/src/domain/value-objects/user-id'
import { itemToDomain, itemToPrisma } from '../mappers/item-mapper'
import { categoryToDomain } from '../mappers/category-mapper'

export class PrismaItemRepository implements ItemRepository {
  constructor(private prisma: PrismaClient) { }

  async save(item: Item): Promise<void> {
    const data = itemToPrisma(item)
    await this.prisma.item.upsert({
      where: { id: item.id.toString() },
      update: {
        name: data.name,
        emoji: data.emoji,
        quantity: data.quantity,
        locationId: item.locationId.toString(),
        categoryId: item.categoryId?.toString() ?? null,
        updatedAt: data.updatedAt,
      },
      create: data,
    })
  }

  async findById(id: ItemId): Promise<Item | null> {
    const item = await this.prisma.item.findUnique({
      where: { id: id.toString() },
    })
    return item ? itemToDomain(item) : null
  }

  async findByLocationId(locationId: LocationId): Promise<Item[]> {
    const items = await this.prisma.item.findMany({
      where: { locationId: locationId.toString() },
    })
    return items.map((item) => itemToDomain(item))
  }

  async findByLocationIdWithCategory(locationId: LocationId): Promise<ItemWithCategory[]> {
    const items = await this.prisma.item.findMany({
      where: { locationId: locationId.toString() },
      include: { category: true },
      orderBy: { name: 'asc' },
    })

    return items.map((item) => ({
      item: itemToDomain(item),
      category: item.category ? categoryToDomain(item.category) : null,
    }))
  }

  async findByLocationAndName(locationId: LocationId, name: string): Promise<Item | null> {
    const item = await this.prisma.item.findUnique({
      where: {
        locationId_name: {
          locationId: locationId.toString(),
          name,
        },
      },
    })
    return item ? itemToDomain(item) : null
  }

  async delete(id: ItemId): Promise<void> {
    await this.prisma.item.delete({
      where: { id: id.toString() },
    })
  }

  async searchByName(userId: UserId, query: string): Promise<Item[]> {
    const items = await this.prisma.item.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
        location: {
          group: {
            memberships: {
              some: {
                userId: userId.toString(),
              },
            },
          },
        },
      },
      take: 20,
    })
    return items.map((item) => itemToDomain(item))
  }

  async searchWithContext(userId: UserId, query: string, limit = 20): Promise<SearchResultItem[]> {
    const items = await this.prisma.item.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
        location: {
          group: {
            memberships: {
              some: {
                userId: userId.toString(),
              },
            },
          },
        },
      },
      include: {
        location: {
          include: {
            group: true,
          },
        },
      },
      orderBy: [
        { name: 'asc' },
      ],
      take: limit,
    })

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      emoji: item.emoji,
      quantity: item.quantity,
      location: {
        id: item.location.id,
        name: item.location.name,
        emoji: item.location.emoji,
      },
      group: {
        id: item.location.group.id,
        name: item.location.group.name,
        emoji: item.location.group.emoji,
      },
    }))
  }
}

