import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteLocationUseCase } from '@/src/application/use-cases/locations/delete-location'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { Location } from '@/src/domain/entities/location'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'

describe('DeleteLocationUseCase', () => {
  let useCase: DeleteLocationUseCase
  let mockLocationRepository: LocationRepository
  let mockGroupRepository: GroupRepository

  beforeEach(() => {
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

    useCase = new DeleteLocationUseCase(mockLocationRepository, mockGroupRepository)
  })

  it('should delete location with no items', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockLocationRepository.getItemCount).mockResolvedValue(0)

    const result = await useCase.execute({
      userId: 'user-123',
      locationId: location.id.toString(),
      confirmed: false,
    })

    expect(result.success).toBe(true)
    expect(result.itemsDeleted).toBe(0)
    expect(mockLocationRepository.delete).toHaveBeenCalledOnce()
  })

  it('should delete location with items when confirmed', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockLocationRepository.getItemCount).mockResolvedValue(5)

    const result = await useCase.execute({
      userId: 'user-123',
      locationId: location.id.toString(),
      confirmed: true,
    })

    expect(result.success).toBe(true)
    expect(result.itemsDeleted).toBe(5)
    expect(mockLocationRepository.delete).toHaveBeenCalledOnce()
  })

  it('should require confirmation when location has items', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockLocationRepository.getItemCount).mockResolvedValue(3)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: location.id.toString(),
        confirmed: false,
      }),
    ).rejects.toThrow('This location contains 3 items. Please confirm deletion.')
  })

  it('should use singular item text when only one item', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockLocationRepository.getItemCount).mockResolvedValue(1)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: location.id.toString(),
        confirmed: false,
      }),
    ).rejects.toThrow('This location contains 1 item. Please confirm deletion.')
  })

  it('should reject when location not found', async () => {
    vi.mocked(mockLocationRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: 'non-existent',
        confirmed: false,
      }),
    ).rejects.toThrow('Location not found')
  })

  it('should reject when user is not a member of the group', async () => {
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
        confirmed: false,
      }),
    ).rejects.toThrow('You are not a member of this group')
  })
})
