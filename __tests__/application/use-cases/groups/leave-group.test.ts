import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LeaveGroupUseCase } from '@/src/application/use-cases/groups/leave-group'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('LeaveGroupUseCase', () => {
  let useCase: LeaveGroupUseCase
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

    useCase = new LeaveGroupUseCase(mockGroupRepository)
  })

  it('should throw error if user is not a member', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(false)

    await expect(useCase.execute({ userId: 'user-123', groupId: 'group-456' })).rejects.toThrow(
      'You are not a member of this group',
    )
  })

  it('should remove membership and keep group if other members exist', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockGroupRepository.getMemberCount).mockResolvedValue(2)

    const result = await useCase.execute({ userId: 'user-123', groupId: 'group-456' })

    expect(result.deleted).toBe(false)
    expect(mockGroupRepository.removeMember).toHaveBeenCalledOnce()
    expect(mockGroupRepository.delete).not.toHaveBeenCalled()
  })

  it('should delete group if last member leaves', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockGroupRepository.getMemberCount).mockResolvedValue(0)

    const result = await useCase.execute({ userId: 'user-123', groupId: 'group-456' })

    expect(result.deleted).toBe(true)
    expect(mockGroupRepository.removeMember).toHaveBeenCalledOnce()
    expect(mockGroupRepository.delete).toHaveBeenCalledOnce()
  })

  it('should check membership count after removing member', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    vi.mocked(mockGroupRepository.getMemberCount).mockResolvedValue(1)

    const result = await useCase.execute({ userId: 'user-123', groupId: 'group-456' })

    // 1 member remaining after removal means group stays
    expect(result.deleted).toBe(false)

    // Verify order of operations
    const removeMemberOrder = vi.mocked(mockGroupRepository.removeMember).mock
      .invocationCallOrder[0]
    const getMemberCountOrder = vi.mocked(mockGroupRepository.getMemberCount).mock
      .invocationCallOrder[0]

    expect(removeMemberOrder).toBeLessThan(getMemberCountOrder)
  })
})
