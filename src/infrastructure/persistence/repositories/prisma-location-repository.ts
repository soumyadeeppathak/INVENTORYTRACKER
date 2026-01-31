import type { PrismaClient } from '@prisma/client'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { Location } from '@/src/domain/entities/location'
import type { GroupId } from '@/src/domain/value-objects/group-id'
import type { LocationId } from '@/src/domain/value-objects/location-id'
import { locationToDomain, locationToPrisma } from '../mappers/location-mapper'

export class PrismaLocationRepository implements LocationRepository {
  constructor(private prisma: PrismaClient) {}

  async save(location: Location): Promise<void> {
    const data = locationToPrisma(location)
    await this.prisma.location.upsert({
      where: { id: location.id.toString() },
      update: {
        name: data.name,
        emoji: data.emoji,
      },
      create: data,
    })
  }

  async findById(id: LocationId): Promise<Location | null> {
    const location = await this.prisma.location.findUnique({
      where: { id: id.toString() },
    })
    return location ? locationToDomain(location) : null
  }

  async findByGroupId(groupId: GroupId): Promise<Location[]> {
    const locations = await this.prisma.location.findMany({
      where: { groupId: groupId.toString() },
    })
    return locations.map((location) => locationToDomain(location))
  }

  async delete(id: LocationId): Promise<void> {
    await this.prisma.location.delete({
      where: { id: id.toString() },
    })
  }

  async getItemCount(id: LocationId): Promise<number> {
    return await this.prisma.item.count({
      where: { locationId: id.toString() },
    })
  }
}
