import { ItemId } from '@/src/domain/value-objects/item-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { ItemRepository } from '@/src/application/ports/item-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface DeleteItemInput {
  userId: string
  itemId: string
}

export interface DeleteItemOutput {
  success: true
}

export class DeleteItemUseCase {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: DeleteItemInput): Promise<DeleteItemOutput> {
    const userId = UserId.create(input.userId)
    const itemId = ItemId.create(input.itemId)

    // Find item
    const item = await this.itemRepository.findById(itemId)
    if (!item) {
      throw new DomainError('Item not found')
    }

    // Find location
    const location = await this.locationRepository.findById(item.locationId)
    if (!location) {
      throw new DomainError('Location not found')
    }

    // Verify user is member of group
    const isMember = await this.groupRepository.isMember(location.groupId, userId)
    if (!isMember) {
      throw new DomainError('You are not a member of this group')
    }

    // Delete item
    await this.itemRepository.delete(itemId)

    return { success: true }
  }
}
