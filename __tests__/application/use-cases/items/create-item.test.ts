import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateItemUseCase } from '@/src/application/use-cases/items/create-item'
import type { ItemRepository } from '@/src/application/ports/item-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { Location } from '@/src/domain/entities/location'
import { Item } from '@/src/domain/entities/item'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { LocationId } from '@/src/domain/value-objects/location-id'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('CreateItemUseCase', () => {
  let useCase: CreateItemUseCase
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

    useCase = new CreateItemUseCase(mockItemRepository, mockLocationRepository, mockGroupRepository)
  })

  it('should create an item when user is a member', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockItemRepository.findByLocationAndName).mockResolvedValue(null)

    const result = await useCase.execute({
      userId: 'user-123',
      locationId: location.id.toString(),
      name: 'Toaster',
      emoji: '🍞',
      quantity: 1,
    })

    expect(result.itemId).toBeDefined()
    expect(mockItemRepository.save).toHaveBeenCalledOnce()
  })

  it('should reject when location not found', async () => {
    vi.mocked(mockLocationRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: 'non-existent',
        name: 'Toaster',
        emoji: '🍞',
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
        name: 'Toaster',
        emoji: '🍞',
      }),
    ).rejects.toThrow('You are not a member of this group')
  })

  it('should reject duplicate item name in same location', async () => {
    const groupId = GroupId.create('group-123')
    const locationId = LocationId.create('loc-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })
    const existingItem = Item.create({
      name: 'Toaster',
      emoji: Emoji.create('🍞'),
      locationId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockItemRepository.findByLocationAndName).mockResolvedValue(existingItem)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: location.id.toString(),
        name: 'Toaster',
        emoji: '🍞',
      }),
    ).rejects.toThrow('An item with this name already exists in this location')
  })

  it('should reject invalid emoji', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockItemRepository.findByLocationAndName).mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: location.id.toString(),
        name: 'Toaster',
        emoji: 'not-an-emoji',
      }),
    ).rejects.toThrow(DomainError)
  })
})
