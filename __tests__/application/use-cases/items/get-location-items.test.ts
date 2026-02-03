import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetLocationItemsUseCase } from '@/src/application/use-cases/items/get-location-items'
import type { ItemRepository, ItemWithCategory } from '@/src/application/ports/item-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { Location } from '@/src/domain/entities/location'
import { Item } from '@/src/domain/entities/item'
import { Category } from '@/src/domain/entities/category'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { LocationId } from '@/src/domain/value-objects/location-id'

describe('GetLocationItemsUseCase', () => {
  let useCase: GetLocationItemsUseCase
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

    useCase = new GetLocationItemsUseCase(
      mockItemRepository,
      mockLocationRepository,
      mockGroupRepository,
    )
  })

  it('should return items with categories', async () => {
    const groupId = GroupId.create('group-123')
    const locationId = LocationId.create('loc-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    const item1 = Item.create({
      name: 'Toaster',
      emoji: Emoji.create('🍞'),
      quantity: 1,
      locationId,
    })
    const item2 = Item.create({
      name: 'Blender',
      emoji: Emoji.create('🍹'),
      quantity: 1,
      locationId,
    })
    const category = Category.create({
      name: 'Electronics',
      emoji: Emoji.create('📱'),
      isSystem: true,
    })

    const itemsWithCategory: ItemWithCategory[] = [
      { item: item1, category },
      { item: item2, category: null },
    ]

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockItemRepository.findByLocationIdWithCategory).mockResolvedValue(itemsWithCategory)

    const result = await useCase.execute({
      userId: 'user-123',
      locationId: location.id.toString(),
    })

    expect(result.items).toHaveLength(2)
    expect(result.items[0].name).toBe('Toaster')
    expect(result.items[0].category?.name).toBe('Electronics')
    expect(result.items[1].name).toBe('Blender')
    expect(result.items[1].category).toBeNull()
  })

  it('should reject when location not found', async () => {
    vi.mocked(mockLocationRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: 'non-existent',
      }),
    ).rejects.toThrow('Location not found')
  })

  it('should reject when user is not a member', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(false)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: location.id.toString(),
      }),
    ).rejects.toThrow('You are not a member of this group')
  })

  it('should return empty array when no items', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockItemRepository.findByLocationIdWithCategory).mockResolvedValue([])

    const result = await useCase.execute({
      userId: 'user-123',
      locationId: location.id.toString(),
    })

    expect(result.items).toEqual([])
  })
})
