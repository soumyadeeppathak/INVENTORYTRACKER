import { LocationId } from '@/src/domain/value-objects/location-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { ItemRepository } from '@/src/application/ports/item-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import type { ItemDTO } from '@/src/application/dtos/item-dto'

export interface GetLocationItemsInput {
  userId: string
  locationId: string
}

export interface GetLocationItemsOutput {
  items: ItemDTO[]
}

export class GetLocationItemsUseCase {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: GetLocationItemsInput): Promise<GetLocationItemsOutput> {
    const userId = UserId.create(input.userId)
    const locationId = LocationId.create(input.locationId)

    // Find location
    const location = await this.locationRepository.findById(locationId)
    if (!location) {
      throw new DomainError('Location not found')
    }

    // Verify user is member of group
    const isMember = await this.groupRepository.isMember(location.groupId, userId)
    if (!isMember) {
      throw new DomainError('You are not a member of this group')
    }

    // Fetch items with category
    const itemsWithCategory = await this.itemRepository.findByLocationIdWithCategory(locationId)

    // Map to DTOs
    const items: ItemDTO[] = itemsWithCategory.map(({ item, category }) => ({
      id: item.id.toString(),
      name: item.name,
      emoji: item.emoji.toString(),
      quantity: item.quantity,
      category: category
        ? {
            id: category.id.toString(),
            name: category.name,
            emoji: category.emoji.toString(),
            isSystem: category.isSystem,
          }
        : null,
      locationId: item.locationId.toString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))

    return { items }
  }
}
