import { ItemId } from '@/src/domain/value-objects/item-id'
import { LocationId } from '@/src/domain/value-objects/location-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { ItemRepository } from '@/src/application/ports/item-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface MoveItemInput {
  userId: string
  itemId: string
  targetLocationId: string
}

export interface MoveItemOutput {
  success: true
}

export class MoveItemUseCase {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: MoveItemInput): Promise<MoveItemOutput> {
    const userId = UserId.create(input.userId)
    const itemId = ItemId.create(input.itemId)
    const targetLocationId = LocationId.create(input.targetLocationId)

    // Find item
    const item = await this.itemRepository.findById(itemId)
    if (!item) {
      throw new DomainError('Item not found')
    }

    // Find source location
    const sourceLocation = await this.locationRepository.findById(item.locationId)
    if (!sourceLocation) {
      throw new DomainError('Source location not found')
    }

    // Find target location
    const targetLocation = await this.locationRepository.findById(targetLocationId)
    if (!targetLocation) {
      throw new DomainError('Target location not found')
    }

    // Verify both locations are in the same group
    if (!sourceLocation.groupId.equals(targetLocation.groupId)) {
      throw new DomainError('Cannot move item to a location in a different group')
    }

    // Verify user is member of group
    const isMember = await this.groupRepository.isMember(sourceLocation.groupId, userId)
    if (!isMember) {
      throw new DomainError('You are not a member of this group')
    }

    // Check if moving to same location
    if (item.locationId.equals(targetLocationId)) {
      return { success: true } // No-op
    }

    // Validate name uniqueness in target location
    const existingItem = await this.itemRepository.findByLocationAndName(targetLocationId, item.name)
    if (existingItem) {
      throw new DomainError('An item with this name already exists in the target location')
    }

    // Move item
    item.moveTo(targetLocationId)

    // Save item
    await this.itemRepository.save(item)

    return { success: true }
  }
}
