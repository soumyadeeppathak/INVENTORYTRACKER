import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MoveItemUseCase } from '@/src/application/use-cases/items/move-item'
import type { ItemRepository } from '@/src/application/ports/item-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { Location } from '@/src/domain/entities/location'
import { Item } from '@/src/domain/entities/item'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { LocationId } from '@/src/domain/value-objects/location-id'

describe('MoveItemUseCase', () => {
  let useCase: MoveItemUseCase
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

    useCase = new MoveItemUseCase(mockItemRepository, mockLocationRepository, mockGroupRepository)
  })

  it('should move item to different location in same group', async () => {
    const groupId = GroupId.create('group-123')
    const sourceLocationId = LocationId.create('loc-source')
    const targetLocationId = LocationId.create('loc-target')

    const sourceLocation = Location.reconstitute({
      id: sourceLocationId.toString(),
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
      createdAt: new Date(),
    })
    const targetLocation = Location.reconstitute({
      id: targetLocationId.toString(),
      name: 'Bedroom',
      emoji: Emoji.create('🛏️'),
      groupId,
      createdAt: new Date(),
    })
    const item = Item.create({
      name: 'Lamp',
      emoji: Emoji.create('💡'),
      locationId: sourceLocationId,
    })

    vi.mocked(mockItemRepository.findById).mockResolvedValue(item)
    vi.mocked(mockLocationRepository.findById)
      .mockResolvedValueOnce(sourceLocation)
      .mockResolvedValueOnce(targetLocation)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockItemRepository.findByLocationAndName).mockResolvedValue(null)

    const result = await useCase.execute({
      userId: 'user-123',
      itemId: item.id.toString(),
      targetLocationId: targetLocationId.toString(),
    })

    expect(result.success).toBe(true)
    expect(mockItemRepository.save).toHaveBeenCalledOnce()
  })

  it('should reject when item not found', async () => {
    vi.mocked(mockItemRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: 'user-123',
        itemId: 'non-existent',
        targetLocationId: 'loc-target',
      }),
    ).rejects.toThrow('Item not found')
  })

  it('should reject when target location not found', async () => {
    const groupId = GroupId.create('group-123')
    const sourceLocationId = LocationId.create('loc-source')
    const sourceLocation = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })
    const item = Item.create({
      name: 'Lamp',
      emoji: Emoji.create('💡'),
      locationId: sourceLocationId,
    })

    vi.mocked(mockItemRepository.findById).mockResolvedValue(item)
    vi.mocked(mockLocationRepository.findById)
      .mockResolvedValueOnce(sourceLocation)
      .mockResolvedValueOnce(null)

    await expect(
      useCase.execute({
        userId: 'user-123',
        itemId: item.id.toString(),
        targetLocationId: 'non-existent',
      }),
    ).rejects.toThrow('Target location not found')
  })

  it('should reject moving to different group', async () => {
    const groupId1 = GroupId.create('group-1')
    const groupId2 = GroupId.create('group-2')
    const sourceLocationId = LocationId.create('loc-source')
    const targetLocationId = LocationId.create('loc-target')

    const sourceLocation = Location.reconstitute({
      id: sourceLocationId.toString(),
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId: groupId1,
      createdAt: new Date(),
    })
    const targetLocation = Location.reconstitute({
      id: targetLocationId.toString(),
      name: 'Bedroom',
      emoji: Emoji.create('🛏️'),
      groupId: groupId2,
      createdAt: new Date(),
    })
    const item = Item.create({
      name: 'Lamp',
      emoji: Emoji.create('💡'),
      locationId: sourceLocationId,
    })

    vi.mocked(mockItemRepository.findById).mockResolvedValue(item)
    vi.mocked(mockLocationRepository.findById)
      .mockResolvedValueOnce(sourceLocation)
      .mockResolvedValueOnce(targetLocation)

    await expect(
      useCase.execute({
        userId: 'user-123',
        itemId: item.id.toString(),
        targetLocationId: targetLocationId.toString(),
      }),
    ).rejects.toThrow('Cannot move item to a location in a different group')
  })

  it('should reject duplicate name in target location', async () => {
    const groupId = GroupId.create('group-123')
    const sourceLocationId = LocationId.create('loc-source')
    const targetLocationId = LocationId.create('loc-target')

    const sourceLocation = Location.reconstitute({
      id: sourceLocationId.toString(),
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
      createdAt: new Date(),
    })
    const targetLocation = Location.reconstitute({
      id: targetLocationId.toString(),
      name: 'Bedroom',
      emoji: Emoji.create('🛏️'),
      groupId,
      createdAt: new Date(),
    })
    const item = Item.create({
      name: 'Lamp',
      emoji: Emoji.create('💡'),
      locationId: sourceLocationId,
    })
    const existingItem = Item.create({
      name: 'Lamp',
      emoji: Emoji.create('💡'),
      locationId: targetLocationId,
    })

    vi.mocked(mockItemRepository.findById).mockResolvedValue(item)
    vi.mocked(mockLocationRepository.findById)
      .mockResolvedValueOnce(sourceLocation)
      .mockResolvedValueOnce(targetLocation)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockItemRepository.findByLocationAndName).mockResolvedValue(existingItem)

    await expect(
      useCase.execute({
        userId: 'user-123',
        itemId: item.id.toString(),
        targetLocationId: targetLocationId.toString(),
      }),
    ).rejects.toThrow('An item with this name already exists in the target location')
  })

  it('should succeed as no-op when moving to same location', async () => {
    const groupId = GroupId.create('group-123')
    const locationId = LocationId.create('loc-123')
    const location = Location.reconstitute({
      id: locationId.toString(),
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
      createdAt: new Date(),
    })
    const item = Item.create({
      name: 'Lamp',
      emoji: Emoji.create('💡'),
      locationId,
    })

    vi.mocked(mockItemRepository.findById).mockResolvedValue(item)
    vi.mocked(mockLocationRepository.findById)
      .mockResolvedValueOnce(location)
      .mockResolvedValueOnce(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)

    const result = await useCase.execute({
      userId: 'user-123',
      itemId: item.id.toString(),
      targetLocationId: locationId.toString(),
    })

    expect(result.success).toBe(true)
    // No save called since it's a no-op (item.moveTo doesn't update when same location)
  })
})
