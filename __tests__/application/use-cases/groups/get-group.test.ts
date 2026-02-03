import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetGroupUseCase } from '@/src/application/use-cases/groups/get-group'
import type { GroupRepository, GroupMember } from '@/src/application/ports/group-repository'
import type {
  LocationRepository,
  LocationWithItemCount,
} from '@/src/application/ports/location-repository'
import { Group } from '@/src/domain/entities/group'
import { Location } from '@/src/domain/entities/location'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('GetGroupUseCase', () => {
  let useCase: GetGroupUseCase
  let mockGroupRepository: GroupRepository
  let mockLocationRepository: LocationRepository

  beforeEach(() => {
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

    mockLocationRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByGroupId: vi.fn(),
      findByGroupIdWithItemCounts: vi.fn(),
      delete: vi.fn(),
      getItemCount: vi.fn(),
    }

    useCase = new GetGroupUseCase(mockGroupRepository, mockLocationRepository)
  })

  it('should throw error if user is not a member', async () => {
    vi.mocked(mockGroupRepository.getMemberRole).mockResolvedValue(null)

    await expect(useCase.execute({ userId: 'user-123', groupId: 'group-456' })).rejects.toThrow(
      'You are not a member of this group',
    )
  })

  it('should throw error if group not found', async () => {
    vi.mocked(mockGroupRepository.getMemberRole).mockResolvedValue('MEMBER')
    vi.mocked(mockGroupRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute({ userId: 'user-123', groupId: 'group-456' })).rejects.toThrow(
      'Group not found',
    )
  })

  it('should return group with locations and members', async () => {
    const groupId = GroupId.create('group-456')
    const group = Group.reconstitute({
      id: 'group-456',
      name: 'Home',
      emoji: Emoji.create('🏠'),
      createdAt: new Date('2024-01-01'),
    })

    const locations: LocationWithItemCount[] = [
      {
        location: Location.reconstitute({
          id: 'loc-1',
          name: 'Living Room',
          emoji: Emoji.create('🛋️'),
          groupId,
          createdAt: new Date(),
        }),
        itemCount: 10,
      },
      {
        location: Location.reconstitute({
          id: 'loc-2',
          name: 'Kitchen',
          emoji: Emoji.create('🍳'),
          groupId,
          createdAt: new Date(),
        }),
        itemCount: 15,
      },
    ]

    const members: GroupMember[] = [
      {
        userId: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'OWNER',
        joinedAt: new Date('2024-01-01'),
      },
      {
        userId: 'user-456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'MEMBER',
        joinedAt: new Date('2024-01-15'),
      },
    ]

    vi.mocked(mockGroupRepository.getMemberRole).mockResolvedValue('OWNER')
    vi.mocked(mockGroupRepository.findById).mockResolvedValue(group)
    vi.mocked(mockLocationRepository.findByGroupIdWithItemCounts).mockResolvedValue(locations)
    vi.mocked(mockGroupRepository.getMembers).mockResolvedValue(members)

    const result = await useCase.execute({ userId: 'user-123', groupId: 'group-456' })

    expect(result.group.id).toBe('group-456')
    expect(result.group.name).toBe('Home')
    expect(result.group.emoji).toBe('🏠')
    expect(result.group.locationCount).toBe(2)
    expect(result.group.itemCount).toBe(25)
    expect(result.group.memberCount).toBe(2)
    expect(result.group.role).toBe('owner')

    expect(result.group.locations).toHaveLength(2)
    expect(result.group.locations[0]).toEqual({
      id: 'loc-1',
      name: 'Living Room',
      emoji: '🛋️',
      itemCount: 10,
    })

    expect(result.group.members).toHaveLength(2)
    expect(result.group.members[0]).toEqual({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      joinedAt: expect.any(Date),
    })
  })

  it('should handle group with no locations', async () => {
    const group = Group.reconstitute({
      id: 'group-456',
      name: 'Empty Group',
      emoji: Emoji.create('📦'),
      createdAt: new Date(),
    })

    vi.mocked(mockGroupRepository.getMemberRole).mockResolvedValue('MEMBER')
    vi.mocked(mockGroupRepository.findById).mockResolvedValue(group)
    vi.mocked(mockLocationRepository.findByGroupIdWithItemCounts).mockResolvedValue([])
    vi.mocked(mockGroupRepository.getMembers).mockResolvedValue([
      {
        userId: 'user-123',
        name: 'Solo User',
        email: 'solo@example.com',
        role: 'MEMBER',
        joinedAt: new Date(),
      },
    ])

    const result = await useCase.execute({ userId: 'user-123', groupId: 'group-456' })

    expect(result.group.locationCount).toBe(0)
    expect(result.group.itemCount).toBe(0)
    expect(result.group.locations).toEqual([])
  })
})
