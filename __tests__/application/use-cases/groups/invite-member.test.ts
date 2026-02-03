import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InviteMemberUseCase } from '@/src/application/use-cases/groups/invite-member'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import type { UserRepository } from '@/src/application/ports/user-repository'
import type { InviteRepository } from '@/src/application/ports/invite-repository'
import type { EmailService } from '@/src/application/ports/email-service'
import { User } from '@/src/domain/entities/user'
import { Group } from '@/src/domain/entities/group'
import { Email } from '@/src/domain/value-objects/email'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('InviteMemberUseCase', () => {
  let useCase: InviteMemberUseCase
  let mockGroupRepository: GroupRepository
  let mockUserRepository: UserRepository
  let mockInviteRepository: InviteRepository
  let mockEmailService: EmailService

  const mockUser = User.reconstitute({
    id: 'user-123',
    email: Email.create('inviter@example.com'),
    name: 'Inviter',
    createdAt: new Date(),
  })

  const mockGroup = Group.reconstitute({
    id: 'group-456',
    name: 'Test Group',
    emoji: Emoji.create('🏠'),
    createdAt: new Date(),
  })

  beforeEach(() => {
    mockGroupRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(mockGroup),
      findByUserId: vi.fn(),
      findByUserIdWithCounts: vi.fn(),
      delete: vi.fn(),
      addMember: vi.fn(),
      removeMember: vi.fn(),
      getMemberCount: vi.fn(),
      getMembers: vi.fn(),
      getMemberRole: vi.fn(),
      isMember: vi.fn().mockResolvedValue(true),
    }

    mockUserRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(mockUser),
      findByEmail: vi.fn(),
      delete: vi.fn(),
    }

    mockInviteRepository = {
      save: vi.fn(),
      findByToken: vi.fn(),
      findByGroupAndEmail: vi.fn().mockResolvedValue(null),
      markAccepted: vi.fn(),
    }

    mockEmailService = {
      sendMagicLink: vi.fn(),
      sendGroupInvite: vi.fn().mockResolvedValue(undefined),
    }

    useCase = new InviteMemberUseCase(
      mockGroupRepository,
      mockUserRepository,
      mockInviteRepository,
      mockEmailService,
    )
  })

  it('should create invite and send email', async () => {
    const result = await useCase.execute({
      inviterId: 'user-123',
      groupId: 'group-456',
      email: 'invitee@example.com',
      baseUrl: 'http://localhost:3000',
    })

    expect(result.success).toBe(true)
    expect(mockInviteRepository.save).toHaveBeenCalledOnce()
    expect(mockEmailService.sendGroupInvite).toHaveBeenCalledWith(
      'invitee@example.com',
      'Inviter',
      'Test Group',
      expect.stringContaining('http://localhost:3000/invite/'),
    )
  })

  it('should throw error if inviter is not a member', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(false)

    await expect(
      useCase.execute({
        inviterId: 'user-123',
        groupId: 'group-456',
        email: 'invitee@example.com',
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrow('You are not a member of this group')
  })

  it('should throw error if inviter not found', async () => {
    vi.mocked(mockUserRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        inviterId: 'user-123',
        groupId: 'group-456',
        email: 'invitee@example.com',
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrow('Inviter not found')
  })

  it('should throw error if group not found', async () => {
    vi.mocked(mockGroupRepository.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        inviterId: 'user-123',
        groupId: 'group-456',
        email: 'invitee@example.com',
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrow('Group not found')
  })

  it('should reject invalid email', async () => {
    await expect(
      useCase.execute({
        inviterId: 'user-123',
        groupId: 'group-456',
        email: 'invalid-email',
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrow(DomainError)
  })

  it('should still return success if email fails', async () => {
    vi.mocked(mockEmailService.sendGroupInvite).mockRejectedValue(new Error('Email failed'))

    const result = await useCase.execute({
      inviterId: 'user-123',
      groupId: 'group-456',
      email: 'invitee@example.com',
      baseUrl: 'http://localhost:3000',
    })

    expect(result.success).toBe(true)
  })
})
