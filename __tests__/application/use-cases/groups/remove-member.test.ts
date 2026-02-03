import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RemoveMemberUseCase } from '@/src/application/use-cases/groups/remove-member'
import type { GroupRepository, GroupMember } from '@/src/application/ports/group-repository'

describe('RemoveMemberUseCase', () => {
  let useCase: RemoveMemberUseCase
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

    useCase = new RemoveMemberUseCase(mockGroupRepository)
  })

  it('should remove a regular member when requester is owner', async () => {
    vi.mocked(mockGroupRepository.getMemberRole)
      .mockResolvedValueOnce('OWNER') // requester
      .mockResolvedValueOnce('MEMBER') // target

    const result = await useCase.execute({
      requesterId: 'owner-123',
      groupId: 'group-456',
      targetUserId: 'member-789',
    })

    expect(result.success).toBe(true)
    expect(mockGroupRepository.removeMember).toHaveBeenCalledOnce()
  })

  it('should throw error if requester is not owner', async () => {
    vi.mocked(mockGroupRepository.getMemberRole).mockResolvedValueOnce('MEMBER')

    await expect(
      useCase.execute({
        requesterId: 'member-123',
        groupId: 'group-456',
        targetUserId: 'member-789',
      }),
    ).rejects.toThrow('Only group owners can remove members')
  })

  it('should throw error if requester is not a member', async () => {
    vi.mocked(mockGroupRepository.getMemberRole).mockResolvedValueOnce(null)

    await expect(
      useCase.execute({
        requesterId: 'stranger-123',
        groupId: 'group-456',
        targetUserId: 'member-789',
      }),
    ).rejects.toThrow('Only group owners can remove members')
  })

  it('should throw error if target is not a member', async () => {
    vi.mocked(mockGroupRepository.getMemberRole)
      .mockResolvedValueOnce('OWNER') // requester
      .mockResolvedValueOnce(null) // target not a member

    await expect(
      useCase.execute({
        requesterId: 'owner-123',
        groupId: 'group-456',
        targetUserId: 'stranger-789',
      }),
    ).rejects.toThrow('User is not a member of this group')
  })

  it('should allow removing an owner if there are multiple owners', async () => {
    const members: GroupMember[] = [
      {
        userId: 'owner-123',
        name: 'Owner 1',
        email: 'o1@test.com',
        role: 'OWNER',
        joinedAt: new Date(),
      },
      {
        userId: 'owner-456',
        name: 'Owner 2',
        email: 'o2@test.com',
        role: 'OWNER',
        joinedAt: new Date(),
      },
      {
        userId: 'member-789',
        name: 'Member',
        email: 'm@test.com',
        role: 'MEMBER',
        joinedAt: new Date(),
      },
    ]

    vi.mocked(mockGroupRepository.getMemberRole)
      .mockResolvedValueOnce('OWNER') // requester
      .mockResolvedValueOnce('OWNER') // target is also owner
    vi.mocked(mockGroupRepository.getMembers).mockResolvedValue(members)

    const result = await useCase.execute({
      requesterId: 'owner-123',
      groupId: 'group-456',
      targetUserId: 'owner-456',
    })

    expect(result.success).toBe(true)
    expect(mockGroupRepository.removeMember).toHaveBeenCalledOnce()
  })

  it('should throw error when trying to remove the only owner', async () => {
    const members: GroupMember[] = [
      {
        userId: 'owner-123',
        name: 'Only Owner',
        email: 'o@test.com',
        role: 'OWNER',
        joinedAt: new Date(),
      },
      {
        userId: 'member-456',
        name: 'Member',
        email: 'm@test.com',
        role: 'MEMBER',
        joinedAt: new Date(),
      },
    ]

    vi.mocked(mockGroupRepository.getMemberRole)
      .mockResolvedValueOnce('OWNER') // requester (self-removal)
      .mockResolvedValueOnce('OWNER') // target is owner
    vi.mocked(mockGroupRepository.getMembers).mockResolvedValue(members)

    await expect(
      useCase.execute({
        requesterId: 'owner-123',
        groupId: 'group-456',
        targetUserId: 'owner-123',
      }),
    ).rejects.toThrow('Cannot remove the only owner of the group')
  })
})
