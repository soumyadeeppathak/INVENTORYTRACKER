import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetGroupLocationsUseCase } from '@/src/application/use-cases/locations/get-group-locations'
import type { LocationRepository, LocationWithItemCount } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { Location } from '@/src/domain/entities/location'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'

describe('GetGroupLocationsUseCase', () => {
  let useCase: GetGroupLocationsUseCase
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

    useCase = new GetGroupLocationsUseCase(mockLocationRepository, mockGroupRepository)
  })

  it('should return locations with item counts when user is a member', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)

    const groupId = GroupId.create('group-123')
    const location1 = Location.create({
      name: 'Kitchen',
      emoji: Emoji.create('🍳'),
      groupId,
    })
    const location2 = Location.create({
      name: 'Bedroom',
      emoji: Emoji.create('🛏️'),
      groupId,
    })

    const locationsWithCounts: LocationWithItemCount[] = [
      { location: location1, itemCount: 5 },
      { location: location2, itemCount: 3 },
    ]

    vi.mocked(mockLocationRepository.findByGroupIdWithItemCounts).mockResolvedValue(
      locationsWithCounts,
    )

    const result = await useCase.execute({
      userId: 'user-123',
      groupId: 'group-123',
    })

    expect(result.locations).toHaveLength(2)
    expect(result.locations[0].name).toBe('Kitchen')
    expect(result.locations[0].emoji).toBe('🍳')
    expect(result.locations[0].itemCount).toBe(5)
    expect(result.locations[1].name).toBe('Bedroom')
    expect(result.locations[1].itemCount).toBe(3)
  })

  it('should reject when user is not a member of the group', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(false)

    await expect(
      useCase.execute({
        userId: 'user-123',
        groupId: 'group-123',
      }),
    ).rejects.toThrow('You are not a member of this group')
  })

  it('should return empty array when group has no locations', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockLocationRepository.findByGroupIdWithItemCounts).mockResolvedValue([])

    const result = await useCase.execute({
      userId: 'user-123',
      groupId: 'group-123',
    })

    expect(result.locations).toEqual([])
  })
})
