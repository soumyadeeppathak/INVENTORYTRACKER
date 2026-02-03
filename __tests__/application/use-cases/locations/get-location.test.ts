import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetLocationUseCase } from '@/src/application/use-cases/locations/get-location'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { Location } from '@/src/domain/entities/location'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'

describe('GetLocationUseCase', () => {
  let useCase: GetLocationUseCase
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

    useCase = new GetLocationUseCase(mockLocationRepository, mockGroupRepository)
  })

  it('should return location with item count when user is a member', async () => {
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
    })

    expect(result.location.name).toBe('Kitchen')
    expect(result.location.emoji).toBe('🍳')
    expect(result.location.itemCount).toBe(5)
    expect(result.location.id).toBe(location.id.toString())
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
      }),
    ).rejects.toThrow('You are not a member of this group')
  })
})
