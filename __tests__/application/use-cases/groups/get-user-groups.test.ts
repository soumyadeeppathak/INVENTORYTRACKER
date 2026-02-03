import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetUserGroupsUseCase } from '@/src/application/use-cases/groups/get-user-groups'
import type { GroupRepository, GroupWithCounts } from '@/src/application/ports/group-repository'
import { Group } from '@/src/domain/entities/group'
import { Emoji } from '@/src/domain/value-objects/emoji'

describe('GetUserGroupsUseCase', () => {
  let useCase: GetUserGroupsUseCase
  let mockGroupRepository: GroupRepository

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

    useCase = new GetUserGroupsUseCase(mockGroupRepository)
  })

  it('should return empty array when user has no groups', async () => {
    vi.mocked(mockGroupRepository.findByUserIdWithCounts).mockResolvedValue([])

    const result = await useCase.execute({ userId: 'user-123' })

    expect(result.groups).toEqual([])
  })

  it('should return groups with counts', async () => {
    const group1 = Group.reconstitute({
      id: 'group-1',
      name: 'Home',
      emoji: Emoji.create('🏠'),
      createdAt: new Date(),
    })

    const group2 = Group.reconstitute({
      id: 'group-2',
      name: 'Office',
      emoji: Emoji.create('🏢'),
      createdAt: new Date(),
    })

    const groupsWithCounts: GroupWithCounts[] = [
      {
        group: group1,
        locationCount: 3,
        itemCount: 25,
        memberCount: 2,
        role: 'OWNER',
      },
      {
        group: group2,
        locationCount: 1,
        itemCount: 10,
        memberCount: 5,
        role: 'MEMBER',
      },
    ]

    vi.mocked(mockGroupRepository.findByUserIdWithCounts).mockResolvedValue(groupsWithCounts)

    const result = await useCase.execute({ userId: 'user-123' })

    expect(result.groups).toHaveLength(2)

    expect(result.groups[0]).toEqual({
      id: 'group-1',
      name: 'Home',
      emoji: '🏠',
      locationCount: 3,
      itemCount: 25,
      memberCount: 2,
      role: 'owner',
    })

    expect(result.groups[1]).toEqual({
      id: 'group-2',
      name: 'Office',
      emoji: '🏢',
      locationCount: 1,
      itemCount: 10,
      memberCount: 5,
      role: 'member',
    })
  })

  it('should convert role to lowercase', async () => {
    const group = Group.reconstitute({
      id: 'group-1',
      name: 'Home',
      emoji: Emoji.create('🏠'),
      createdAt: new Date(),
    })

    vi.mocked(mockGroupRepository.findByUserIdWithCounts).mockResolvedValue([
      {
        group,
        locationCount: 0,
        itemCount: 0,
        memberCount: 1,
        role: 'OWNER',
      },
    ])

    const result = await useCase.execute({ userId: 'user-123' })

    expect(result.groups[0].role).toBe('owner')
  })
})
