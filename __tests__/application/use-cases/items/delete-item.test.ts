import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteItemUseCase } from '@/src/application/use-cases/items/delete-item'
import type { ItemRepository } from '@/src/application/ports/item-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { Location } from '@/src/domain/entities/location'
import { Item } from '@/src/domain/entities/item'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { LocationId } from '@/src/domain/value-objects/location-id'

describe('DeleteItemUseCase', () => {
  let useCase: DeleteItemUseCase
  let mockItemRepository: ItemRepository
  let mockLocationRepository: LocationRepository
  let mockGroupRepository: GroupRepository

  beforeEach(() => {
    mockItemRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByLocationId: vi.fn(),
      findByLocationIdWithCategory: vi.fn(),
      findByLocationAndName: vi.fn(),
      delete: vi.fn(),
      searchByName: vi.fn(),
    }

    mockLocationRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByGroupId: vi.fn(),
      findByGroupIdWithItemCounts: vi.fn(),
      delete: vi.fn(),
      getItemCount: vi.fn(),
    }

    mockGroupRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByUserIdWithCounts: vi.fn(),
      delete: vi.fn(),
      addMember: vi.fn(),
      removeMember: vi.fn(),
      getMemberCount: vi.fn(),
      getMembers: vi.fn(),
      getMemberRole: vi.fn(),
      isMember: vi.fn(),
    }

    useCase = new DeleteItemUseCase(mockItemRepository, mockLocationRepository, mockGroupRepository)
  })

  it('should delete item when user is a member', async () => {
    const groupId = GroupId.create('group-123')
    const locationId = LocationId.create('loc-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })
    const item = Item.create({
      name: 'Toaster',
      emoji: Emoji.create('🍞'),
      locationId,
    })

    vi.mocked(mockItemRepository.findById).mockResolvedValue(item)
    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)

    const result = await useCase.execute({
      userId: 'user-123',
      itemId: item.id.toString(),
    })

    expect(result.success).toBe(true)
    expect(mockItemRepository.delete).toHaveBeenCalledOnce()
  })

  it('should reject when item not found', async () => {
    vi.mocked(mockItemRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: 'user-123',
        itemId: 'non-existent',
      }),
    ).rejects.toThrow('Item not found')
  })

  it('should reject when user is not a member', async () => {
    const groupId = GroupId.create('group-123')
    const locationId = LocationId.create('loc-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })
    const item = Item.create({
      name: 'Toaster',
      emoji: Emoji.create('🍞'),
      locationId,
    })

    vi.mocked(mockItemRepository.findById).mockResolvedValue(item)
    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(false)

    await expect(
      useCase.execute({
        userId: 'user-123',
        itemId: item.id.toString(),
      }),
    ).rejects.toThrow('You are not a member of this group')
  })
})
