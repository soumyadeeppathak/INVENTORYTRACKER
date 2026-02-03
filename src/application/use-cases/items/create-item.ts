import { Item } from '@/src/domain/entities/item'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { LocationId } from '@/src/domain/value-objects/location-id'
import { CategoryId } from '@/src/domain/value-objects/category-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { ItemRepository } from '@/src/application/ports/item-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface CreateItemInput {
  userId: string
  locationId: string
  name: string
  emoji: string
  quantity?: number
  categoryId?: string
}

export interface CreateItemOutput {
  itemId: string
}

export class CreateItemUseCase {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: CreateItemInput): Promise<CreateItemOutput> {
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

    // Validate name uniqueness within location
    const existingItem = await this.itemRepository.findByLocationAndName(locationId, input.name.trim())
    if (existingItem) {
      throw new DomainError('An item with this name already exists in this location')
    }

    // Validate and create value objects
    const emoji = Emoji.create(input.emoji)
    const categoryId = input.categoryId ? CategoryId.create(input.categoryId) : null

    // Create item entity (validates name and quantity)
    const item = Item.create({
      name: input.name.trim(),
      emoji,
      quantity: input.quantity,
      locationId,
      categoryId,
    })

    // Save item
    await this.itemRepository.save(item)

    return { itemId: item.id.toString() }
  }
}
