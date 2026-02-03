import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateLocationUseCase } from '@/src/application/use-cases/locations/update-location'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { Location } from '@/src/domain/entities/location'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('UpdateLocationUseCase', () => {
  let useCase: UpdateLocationUseCase
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

    useCase = new UpdateLocationUseCase(mockLocationRepository, mockGroupRepository)
  })

  it('should update location when user is a member of the group', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)

    const result = await useCase.execute({
      userId: 'user-123',
      locationId: location.id.toString(),
      name: 'Updated Kitchen',
      emoji: '🍽️',
    })

    expect(result.success).toBe(true)
    expect(mockLocationRepository.save).toHaveBeenCalledOnce()

    const savedLocation = vi.mocked(mockLocationRepository.save).mock.calls[0][0]
    expect(savedLocation.name).toBe('Updated Kitchen')
    expect(savedLocation.emoji.toString()).toBe('🍽️')
  })

  it('should reject when location not found', async () => {
    vi.mocked(mockLocationRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: 'non-existent',
        name: 'Updated',
        emoji: '🍳',
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
        name: 'Updated',
        emoji: '🍳',
      }),
    ).rejects.toThrow('You are not a member of this group')
  })

  it('should reject empty name', async () => {
    const groupId = GroupId.create('group-123')
    const location = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })

    vi.mocked(mockLocationRepository.findById).mockResolvedValue(location)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: location.id.toString(),
        name: '',
        emoji: '🍳',
      }),
    ).rejects.toThrow(DomainError)
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

    await expect(
      useCase.execute({
        userId: 'user-123',
        locationId: location.id.toString(),
        name: 'Updated',
        emoji: 'not-an-emoji',
      }),
    ).rejects.toThrow(DomainError)
  })
})
