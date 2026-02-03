import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AcceptInviteUseCase } from '@/src/application/use-cases/groups/accept-invite'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import type { UserRepository } from '@/src/application/ports/user-repository'
import type { InviteRepository } from '@/src/application/ports/invite-repository'
import { User } from '@/src/domain/entities/user'
import { GroupInvite } from '@/src/domain/entities/group-invite'
import { Email } from '@/src/domain/value-objects/email'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { UserId } from '@/src/domain/value-objects/user-id'

describe('AcceptInviteUseCase', () => {
  let useCase: AcceptInviteUseCase
  let mockInviteRepository: InviteRepository
  let mockUserRepository: UserRepository
  let mockGroupRepository: GroupRepository

  const groupId = GroupId.create('group-456')
  const inviterId = UserId.create('inviter-123')

  const createValidInvite = () =>
    GroupInvite.reconstitute({
      id: 'invite-1',
      token: 'valid-token',
      email: 'invitee@example.com',
      groupId,
      invitedBy: inviterId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      acceptedAt: null,
      createdAt: new Date(),
    })

  const createExpiredInvite = () =>
    GroupInvite.reconstitute({
      id: 'invite-2',
      token: 'expired-token',
      email: 'invitee@example.com',
      groupId,
      invitedBy: inviterId,
      expiresAt: new Date(Date.now() - 1000), // expired
      acceptedAt: null,
      createdAt: new Date(),
    })

  const createAcceptedInvite = () =>
    GroupInvite.reconstitute({
      id: 'invite-3',
      token: 'accepted-token',
      email: 'invitee@example.com',
      groupId,
      invitedBy: inviterId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      acceptedAt: new Date(), // already accepted
      createdAt: new Date(),
    })

  const existingUser = User.reconstitute({
    id: 'user-existing',
    email: Email.create('invitee@example.com'),
    name: 'Existing User',
    createdAt: new Date(),
  })

  beforeEach(() => {
    mockInviteRepository = {
      save: vi.fn(),
      findByToken: vi.fn(),
      findByGroupAndEmail: vi.fn(),
      markAccepted: vi.fn(),
    }

    mockUserRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      delete: vi.fn(),
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
      isMember: vi.fn().mockResolvedValue(false),
    }

    useCase = new AcceptInviteUseCase(mockInviteRepository, mockUserRepository, mockGroupRepository)
  })

  it('should accept invite for existing user with userId', async () => {
    vi.mocked(mockInviteRepository.findByToken).mockResolvedValue(createValidInvite())
    vi.mocked(mockUserRepository.findById).mockResolvedValue(existingUser)

    const result = await useCase.execute({
      token: 'valid-token',
      userId: 'user-existing',
    })

    expect(result.groupId).toBe('group-456')
    expect(result.userId).toBe('user-existing')
    expect(mockGroupRepository.addMember).toHaveBeenCalledOnce()
    expect(mockInviteRepository.markAccepted).toHaveBeenCalledWith('valid-token')
  })

  it('should accept invite for existing user by email', async () => {
    vi.mocked(mockInviteRepository.findByToken).mockResolvedValue(createValidInvite())
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser)

    const result = await useCase.execute({
      token: 'valid-token',
    })

    expect(result.groupId).toBe('group-456')
    expect(result.userId).toBe('user-existing')
    expect(mockGroupRepository.addMember).toHaveBeenCalledOnce()
  })

  it('should create new user if not exists', async () => {
    vi.mocked(mockInviteRepository.findByToken).mockResolvedValue(createValidInvite())
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null)

    const result = await useCase.execute({
      token: 'valid-token',
    })

    expect(result.groupId).toBe('group-456')
    expect(result.userId).toBeDefined()
    expect(mockUserRepository.save).toHaveBeenCalledOnce()
    expect(mockGroupRepository.addMember).toHaveBeenCalledOnce()
  })

  it('should throw error for invalid token', async () => {
    vi.mocked(mockInviteRepository.findByToken).mockResolvedValue(null)

    await expect(useCase.execute({ token: 'invalid-token' })).rejects.toThrow(
      'Invalid invite token',
    )
  })

  it('should throw error for expired invite', async () => {
    vi.mocked(mockInviteRepository.findByToken).mockResolvedValue(createExpiredInvite())

    await expect(useCase.execute({ token: 'expired-token' })).rejects.toThrow(
      'This invite has expired',
    )
  })

  it('should throw error for already accepted invite', async () => {
    vi.mocked(mockInviteRepository.findByToken).mockResolvedValue(createAcceptedInvite())

    await expect(useCase.execute({ token: 'accepted-token' })).rejects.toThrow(
      'This invite has already been used',
    )
  })

  it('should throw error if user is already a member', async () => {
    vi.mocked(mockInviteRepository.findByToken).mockResolvedValue(createValidInvite())
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser)
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)

    await expect(useCase.execute({ token: 'valid-token' })).rejects.toThrow(
      'You are already a member of this group',
    )
  })

  it('should throw error if provided userId not found', async () => {
    vi.mocked(mockInviteRepository.findByToken).mockResolvedValue(createValidInvite())
    vi.mocked(mockUserRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        token: 'valid-token',
        userId: 'nonexistent-user',
      }),
    ).rejects.toThrow('User not found')
  })
})
