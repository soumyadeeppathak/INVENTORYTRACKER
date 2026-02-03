import { Emoji } from '@/src/domain/value-objects/emoji'
import { ItemId } from '@/src/domain/value-objects/item-id'
import { CategoryId } from '@/src/domain/value-objects/category-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { ItemRepository } from '@/src/application/ports/item-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface UpdateItemInput {
  userId: string
  itemId: string
  name?: string
  emoji?: string
  quantity?: number
  categoryId?: string | null
}

export interface UpdateItemOutput {
  success: true
}

export class UpdateItemUseCase {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: UpdateItemInput): Promise<UpdateItemOutput> {
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

    // Validate name uniqueness if changed
    if (input.name !== undefined && input.name.trim() !== item.name) {
      const existingItem = await this.itemRepository.findByLocationAndName(
        item.locationId,
        input.name.trim(),
      )
      if (existingItem && existingItem.id.toString() !== item.id.toString()) {
        throw new DomainError('An item with this name already exists in this location')
      }
    }

    // Update item details
    if (input.name !== undefined || input.emoji !== undefined || input.quantity !== undefined) {
      item.updateDetails({
        name: input.name?.trim(),
        emoji: input.emoji ? Emoji.create(input.emoji) : undefined,
        quantity: input.quantity,
      })
    }

    // Update category if provided
    if (input.categoryId !== undefined) {
      const categoryId = input.categoryId ? CategoryId.create(input.categoryId) : null
      item.assignCategory(categoryId)
    }

    // Save item
    await this.itemRepository.save(item)

    return { success: true }
  }
}
