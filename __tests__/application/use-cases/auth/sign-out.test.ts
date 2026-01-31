import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SignOutUseCase } from '@/src/application/use-cases/auth/sign-out'
import type { SessionRepository } from '@/src/application/ports/session-repository'

describe('SignOutUseCase', () => {
  let useCase: SignOutUseCase
  let mockSessionRepository: SessionRepository

  beforeEach(() => {
    mockSessionRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      delete: vi.fn(),
      deleteExpired: vi.fn(),
    }

    useCase = new SignOutUseCase(mockSessionRepository)
  })

  it('should delete session successfully', async () => {
    const sessionId = 'session-123'

    const result = await useCase.execute({ sessionId })

    expect(result.success).toBe(true)
    expect(mockSessionRepository.delete).toHaveBeenCalledWith(sessionId)
    expect(mockSessionRepository.delete).toHaveBeenCalledOnce()
  })

  it('should return success even if session does not exist', async () => {
    // Simulate session not found (delete succeeds anyway in Prisma)
    vi.mocked(mockSessionRepository.delete).mockResolvedValue(undefined)

    const result = await useCase.execute({ sessionId: 'non-existent' })

    expect(result.success).toBe(true)
  })
})
