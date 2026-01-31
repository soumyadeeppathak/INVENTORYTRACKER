import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { DomainError } from '@/src/domain/errors/domain-error'

// Mock dependencies
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

vi.mock('@/lib/auth', () => ({
  createSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  getSessionId: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {},
}))

vi.mock('@/src/infrastructure/persistence/repositories/prisma-magic-link-repository', () => ({
  PrismaMagicLinkRepository: vi.fn(),
}))

vi.mock('@/src/infrastructure/persistence/repositories/prisma-user-repository', () => ({
  PrismaUserRepository: vi.fn(),
}))

vi.mock('@/src/infrastructure/persistence/repositories/prisma-session-repository', () => ({
  PrismaSessionRepository: vi.fn(),
}))

vi.mock('@/src/infrastructure/services/resend-email-service', () => ({
  ResendEmailService: vi.fn(),
}))

vi.mock('@/src/application/use-cases/auth/request-magic-link', () => ({
  RequestMagicLinkUseCase: vi.fn(),
}))

vi.mock('@/src/application/use-cases/auth/verify-magic-link', () => ({
  VerifyMagicLinkUseCase: vi.fn(),
}))

vi.mock('@/src/application/use-cases/auth/sign-out', () => ({
  SignOutUseCase: vi.fn(),
}))

describe('Auth Actions', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    vi.clearAllMocks()
    originalEnv = { ...process.env }
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('requestMagicLink', () => {
    it('should validate email is provided', async () => {
      const { requestMagicLink } = await import('@/src/server/actions/auth-actions')

      const formData = new FormData()
      const result = await requestMagicLink(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email is required')
    })

    it('should execute use case with correct parameters', async () => {
      const mockExecute = vi.fn().mockResolvedValue({ success: true })
      const { RequestMagicLinkUseCase } = await import(
        '@/src/application/use-cases/auth/request-magic-link'
      )
      vi.mocked(RequestMagicLinkUseCase).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown,
      )

      const { requestMagicLink } = await import('@/src/server/actions/auth-actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')

      try {
        await requestMagicLink(formData)
      } catch (error) {
        // Expect redirect error
        expect((error as Error).message).toContain('REDIRECT:/check-email')
      }

      expect(mockExecute).toHaveBeenCalledWith({
        email: 'test@example.com',
        callbackUrl: 'http://localhost:3000/verify',
      })
    })

    it('should handle domain errors', async () => {
      const mockExecute = vi.fn().mockRejectedValue(new DomainError('Invalid email'))
      const { RequestMagicLinkUseCase } = await import(
        '@/src/application/use-cases/auth/request-magic-link'
      )
      vi.mocked(RequestMagicLinkUseCase).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown,
      )

      const { requestMagicLink } = await import('@/src/server/actions/auth-actions')

      const formData = new FormData()
      formData.append('email', 'invalid')

      const result = await requestMagicLink(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email')
    })

    it('should handle generic errors gracefully', async () => {
      const mockExecute = vi.fn().mockRejectedValue(new Error('Database error'))
      const { RequestMagicLinkUseCase } = await import(
        '@/src/application/use-cases/auth/request-magic-link'
      )
      vi.mocked(RequestMagicLinkUseCase).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown,
      )

      const { requestMagicLink } = await import('@/src/server/actions/auth-actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await requestMagicLink(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to send magic link. Please try again.')
    })
  })

  describe('verifyMagicLink', () => {
    it('should validate token is provided', async () => {
      const { verifyMagicLink } = await import('@/src/server/actions/auth-actions')

      const result = await verifyMagicLink('')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Token is required')
    })

    it('should execute use case and set session cookie', async () => {
      const mockExecute = vi.fn().mockResolvedValue({
        userId: 'user-123',
        sessionId: 'session-456',
      })
      const { VerifyMagicLinkUseCase } = await import(
        '@/src/application/use-cases/auth/verify-magic-link'
      )
      vi.mocked(VerifyMagicLinkUseCase).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown,
      )

      const { createSessionCookie } = await import('@/lib/auth')
      const { verifyMagicLink } = await import('@/src/server/actions/auth-actions')

      try {
        await verifyMagicLink('test-token')
      } catch (error) {
        // Expect redirect error
        expect((error as Error).message).toBe('REDIRECT:/')
      }

      expect(mockExecute).toHaveBeenCalledWith({ token: 'test-token' })
      expect(createSessionCookie).toHaveBeenCalledWith('session-456')
    })

    it('should handle domain errors', async () => {
      const mockExecute = vi
        .fn()
        .mockRejectedValue(new DomainError('Invalid or expired magic link'))
      const { VerifyMagicLinkUseCase } = await import(
        '@/src/application/use-cases/auth/verify-magic-link'
      )
      vi.mocked(VerifyMagicLinkUseCase).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown,
      )

      const { verifyMagicLink } = await import('@/src/server/actions/auth-actions')

      const result = await verifyMagicLink('invalid-token')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid or expired magic link')
    })
  })

  describe('signOut', () => {
    it('should delete session and clear cookie', async () => {
      const mockExecute = vi.fn().mockResolvedValue({ success: true })
      const { SignOutUseCase } = await import('@/src/application/use-cases/auth/sign-out')
      vi.mocked(SignOutUseCase).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown,
      )

      const { getSessionId, clearSessionCookie } = await import('@/lib/auth')
      vi.mocked(getSessionId).mockResolvedValue('session-123')

      const { signOut } = await import('@/src/server/actions/auth-actions')

      try {
        await signOut()
      } catch (error) {
        // Expect redirect error
        expect((error as Error).message).toBe('REDIRECT:/login')
      }

      expect(mockExecute).toHaveBeenCalledWith({ sessionId: 'session-123' })
      expect(clearSessionCookie).toHaveBeenCalled()
    })

    it('should handle no session gracefully', async () => {
      const { getSessionId, clearSessionCookie } = await import('@/lib/auth')
      vi.mocked(getSessionId).mockResolvedValue(null)

      const { signOut } = await import('@/src/server/actions/auth-actions')

      try {
        await signOut()
      } catch (error) {
        // Expect redirect error
        expect((error as Error).message).toBe('REDIRECT:/login')
      }

      expect(clearSessionCookie).toHaveBeenCalled()
    })

    it('should redirect even if error occurs', async () => {
      const mockExecute = vi.fn().mockRejectedValue(new Error('Database error'))
      const { SignOutUseCase } = await import('@/src/application/use-cases/auth/sign-out')
      vi.mocked(SignOutUseCase).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown,
      )

      const { getSessionId } = await import('@/lib/auth')
      vi.mocked(getSessionId).mockResolvedValue('session-123')

      const { signOut } = await import('@/src/server/actions/auth-actions')

      try {
        await signOut()
      } catch (error) {
        // Should still redirect
        expect((error as Error).message).toBe('REDIRECT:/login')
      }
    })
  })
})
