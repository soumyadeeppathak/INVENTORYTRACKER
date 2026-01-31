import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RequestMagicLinkUseCase } from '@/src/application/use-cases/auth/request-magic-link'
import type { MagicLinkRepository } from '@/src/application/ports/magic-link-repository'
import type { EmailService } from '@/src/application/ports/email-service'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('RequestMagicLinkUseCase', () => {
  let useCase: RequestMagicLinkUseCase
  let mockMagicLinkRepository: MagicLinkRepository
  let mockEmailService: EmailService

  beforeEach(() => {
    mockMagicLinkRepository = {
      save: vi.fn(),
      findByToken: vi.fn(),
      markUsed: vi.fn(),
      deleteExpired: vi.fn(),
    }

    mockEmailService = {
      sendMagicLink: vi.fn().mockResolvedValue(undefined),
      sendGroupInvite: vi.fn(),
    }

    useCase = new RequestMagicLinkUseCase(mockMagicLinkRepository, mockEmailService)
  })

  it('should create magic link and send email', async () => {
    const result = await useCase.execute({
      email: 'user@example.com',
      callbackUrl: 'http://localhost:3000/verify',
    })

    expect(result.success).toBe(true)
    expect(mockMagicLinkRepository.save).toHaveBeenCalledOnce()
    expect(mockEmailService.sendMagicLink).toHaveBeenCalledOnce()
  })

  it('should normalize email to lowercase', async () => {
    await useCase.execute({
      email: 'User@Example.COM',
      callbackUrl: 'http://localhost:3000/verify',
    })

    const saveCalls = vi.mocked(mockMagicLinkRepository.save).mock.calls
    const magicLink = saveCalls[0][0]
    expect(magicLink.email.toString()).toBe('user@example.com')
  })

  it('should reject invalid email', async () => {
    await expect(
      useCase.execute({
        email: 'invalid-email',
        callbackUrl: 'http://localhost:3000/verify',
      }),
    ).rejects.toThrow(DomainError)
  })

  it('should include token in callback URL', async () => {
    await useCase.execute({
      email: 'user@example.com',
      callbackUrl: 'http://localhost:3000/verify',
    })

    const emailCalls = vi.mocked(mockEmailService.sendMagicLink).mock.calls
    const linkUrl = emailCalls[0][1]
    expect(linkUrl).toContain('http://localhost:3000/verify?token=')
  })

  it('should always return success even if email fails', async () => {
    // Simulate email failure
    vi.mocked(mockEmailService.sendMagicLink).mockRejectedValue(new Error('Email failed'))

    const result = await useCase.execute({
      email: 'user@example.com',
      callbackUrl: 'http://localhost:3000/verify',
    })

    expect(result.success).toBe(true)
  })
})
