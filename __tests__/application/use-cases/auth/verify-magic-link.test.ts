import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VerifyMagicLinkUseCase } from '@/src/application/use-cases/auth/verify-magic-link'
import type { MagicLinkRepository } from '@/src/application/ports/magic-link-repository'
import type { UserRepository } from '@/src/application/ports/user-repository'
import type { SessionRepository } from '@/src/application/ports/session-repository'
import { MagicLink } from '@/src/domain/entities/magic-link'
import { User } from '@/src/domain/entities/user'
import { Email } from '@/src/domain/value-objects/email'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('VerifyMagicLinkUseCase', () => {
  let useCase: VerifyMagicLinkUseCase
  let mockMagicLinkRepository: MagicLinkRepository
  let mockUserRepository: UserRepository
  let mockSessionRepository: SessionRepository

  beforeEach(() => {
    mockMagicLinkRepository = {
      save: vi.fn(),
      findByToken: vi.fn(),
      markUsed: vi.fn(),
      deleteExpired: vi.fn(),
    }

    mockUserRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      delete: vi.fn(),
    }

    mockSessionRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      delete: vi.fn(),
      deleteExpired: vi.fn(),
    }

    useCase = new VerifyMagicLinkUseCase(
      mockMagicLinkRepository,
      mockUserRepository,
      mockSessionRepository,
    )
  })

  it('should verify valid magic link and create session for existing user', async () => {
    const email = Email.create('user@example.com')
    const magicLink = MagicLink.create({ email })
    const existingUser = User.create({ email, name: 'Test User' })

    vi.mocked(mockMagicLinkRepository.findByToken).mockResolvedValue(magicLink)
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser)

    const result = await useCase.execute({ token: magicLink.token })

    expect(result.userId).toBe(existingUser.id.toString())
    expect(result.sessionId).toBeDefined()
    expect(mockSessionRepository.save).toHaveBeenCalledOnce()
    expect(mockMagicLinkRepository.save).toHaveBeenCalledOnce()
  })

  it('should create new user if email does not exist', async () => {
    const email = Email.create('newuser@example.com')
    const magicLink = MagicLink.create({ email })

    vi.mocked(mockMagicLinkRepository.findByToken).mockResolvedValue(magicLink)
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null)

    const result = await useCase.execute({ token: magicLink.token })

    expect(result.userId).toBeDefined()
    expect(mockUserRepository.save).toHaveBeenCalledOnce()
    expect(mockSessionRepository.save).toHaveBeenCalledOnce()
  })

  it('should reject invalid token', async () => {
    vi.mocked(mockMagicLinkRepository.findByToken).mockResolvedValue(null)

    await expect(useCase.execute({ token: 'invalid-token' })).rejects.toThrow(DomainError)
    await expect(useCase.execute({ token: 'invalid-token' })).rejects.toThrow(
      'Invalid or expired magic link',
    )
  })

  it('should reject expired magic link', async () => {
    const email = Email.create('user@example.com')
    const magicLink = MagicLink.create({ email, expiresInMinutes: -1 }) // Already expired

    vi.mocked(mockMagicLinkRepository.findByToken).mockResolvedValue(magicLink)

    await expect(useCase.execute({ token: magicLink.token })).rejects.toThrow(DomainError)
  })

  it('should mark magic link as used', async () => {
    const email = Email.create('user@example.com')
    const magicLink = MagicLink.create({ email })
    const existingUser = User.create({ email, name: 'Test User' })

    vi.mocked(mockMagicLinkRepository.findByToken).mockResolvedValue(magicLink)
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser)

    await useCase.execute({ token: magicLink.token })

    const saveCalls = vi.mocked(mockMagicLinkRepository.save).mock.calls
    const savedLink = saveCalls[0][0]
    expect(savedLink.isUsed).toBe(true)
  })

  it('should create session with 30-day expiry', async () => {
    const email = Email.create('user@example.com')
    const magicLink = MagicLink.create({ email })
    const existingUser = User.create({ email, name: 'Test User' })

    vi.mocked(mockMagicLinkRepository.findByToken).mockResolvedValue(magicLink)
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser)

    await useCase.execute({ token: magicLink.token })

    const sessionCalls = vi.mocked(mockSessionRepository.save).mock.calls
    const session = sessionCalls[0][0]

    const expiryDays = Math.floor(
      (session.expiresAt.getTime() - session.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    )
    expect(expiryDays).toBe(30)
  })
})
