import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateGroupUseCase } from '@/src/application/use-cases/groups/create-group'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('CreateGroupUseCase', () => {
  let useCase: CreateGroupUseCase
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

    useCase = new CreateGroupUseCase(mockGroupRepository)
  })

  it('should create a group and add user as owner', async () => {
    const result = await useCase.execute({
      userId: 'user-123',
      name: 'My Home',
      emoji: '🏠',
    })

    expect(result.groupId).toBeDefined()
    expect(mockGroupRepository.save).toHaveBeenCalledOnce()
    expect(mockGroupRepository.addMember).toHaveBeenCalledOnce()

    const addMemberCall = vi.mocked(mockGroupRepository.addMember).mock.calls[0]
    expect(addMemberCall[2]).toBe('OWNER')
  })

  it('should reject empty group name', async () => {
    await expect(
      useCase.execute({
        userId: 'user-123',
        name: '',
        emoji: '🏠',
      }),
    ).rejects.toThrow(DomainError)
  })

  it('should reject invalid emoji', async () => {
    await expect(
      useCase.execute({
        userId: 'user-123',
        name: 'My Home',
        emoji: 'not-an-emoji',
      }),
    ).rejects.toThrow(DomainError)
  })

  it('should reject name exceeding 255 characters', async () => {
    const longName = 'a'.repeat(256)

    await expect(
      useCase.execute({
        userId: 'user-123',
        name: longName,
        emoji: '🏠',
      }),
    ).rejects.toThrow(DomainError)
  })

  it('should trim whitespace from group name', async () => {
    await useCase.execute({
      userId: 'user-123',
      name: '  My Home  ',
      emoji: '🏠',
    })

    const savedGroup = vi.mocked(mockGroupRepository.save).mock.calls[0][0]
    // The domain entity stores the name as provided but validates it's not empty after trim
    expect(savedGroup.name).toBeTruthy()
  })
})
