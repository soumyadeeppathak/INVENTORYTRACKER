import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createSessionCookie, getSessionId, clearSessionCookie, getCurrentUser } from '@/lib/auth'
import type { User as PrismaUser, Session as PrismaSession } from '@prisma/client'

// Mock Next.js cookies
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => mockCookieStore),
}))

// Mock database
vi.mock('@/lib/db', () => ({
  db: {
    session: {
      findUnique: vi.fn(),
    },
  },
}))

// Mock navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Auth Library', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createSessionCookie', () => {
    it('should set session cookie with correct parameters', async () => {
      const sessionId = 'session-123'

      await createSessionCookie(sessionId)

      const call = mockCookieStore.set.mock.calls[0]
      expect(call[0]).toBe('session')
      expect(call[1]).toBe(sessionId)
      expect(call[2]).toMatchObject({
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      // secure flag depends on NODE_ENV, which is set by test runner
      expect(call[2]).toHaveProperty('secure')
    })

    it('should set 30-day expiry', async () => {
      await createSessionCookie('session-789')

      const callArgs = mockCookieStore.set.mock.calls[0]
      const options = callArgs[2]
      const expectedSeconds = 30 * 24 * 60 * 60

      expect(options.maxAge).toBe(expectedSeconds)
    })

    it('should set httpOnly flag', async () => {
      await createSessionCookie('session-abc')

      const callArgs = mockCookieStore.set.mock.calls[0]
      const options = callArgs[2]

      expect(options.httpOnly).toBe(true)
    })
  })

  describe('getSessionId', () => {
    it('should return session ID from cookie', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'session-123' })

      const sessionId = await getSessionId()

      expect(mockCookieStore.get).toHaveBeenCalledWith('session')
      expect(sessionId).toBe('session-123')
    })

    it('should return null if no session cookie', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      const sessionId = await getSessionId()

      expect(sessionId).toBeNull()
    })

    it('should return null if cookie value is undefined', async () => {
      mockCookieStore.get.mockReturnValue({ value: undefined })

      const sessionId = await getSessionId()

      expect(sessionId).toBeNull()
    })
  })

  describe('clearSessionCookie', () => {
    it('should delete session cookie', async () => {
      await clearSessionCookie()

      expect(mockCookieStore.delete).toHaveBeenCalledWith('session')
      expect(mockCookieStore.delete).toHaveBeenCalledOnce()
    })
  })

  describe('getCurrentUser', () => {
    const mockPrismaUser: PrismaUser = {
      id: 'user-123',
      email: 'user@example.com',
      name: 'Test User',
      createdAt: new Date('2024-01-01'),
    }

    const mockSession: PrismaSession & { user: PrismaUser } = {
      id: 'session-123',
      userId: 'user-123',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      createdAt: new Date(),
      user: mockPrismaUser,
    }

    it('should return null if no session cookie', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })

    it('should return null if session not found in database', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'session-123' })

      const { db } = await import('@/lib/db')
      vi.mocked(db.session.findUnique).mockResolvedValue(null)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })

    it('should return null if session is expired', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'session-123' })

      const expiredSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() - 1000), // Expired
      }

      const { db } = await import('@/lib/db')
      vi.mocked(db.session.findUnique).mockResolvedValue(expiredSession)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })

    it('should return user if session is valid', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'session-123' })

      const { db } = await import('@/lib/db')
      vi.mocked(db.session.findUnique).mockResolvedValue(mockSession)

      const user = await getCurrentUser()

      expect(user).not.toBeNull()
      expect(user?.id.toString()).toBe('user-123')
      expect(user?.email.toString()).toBe('user@example.com')
      expect(user?.name).toBe('Test User')
    })

    it('should query database with session ID', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'session-456' })

      const { db } = await import('@/lib/db')
      vi.mocked(db.session.findUnique).mockResolvedValue(mockSession)

      await getCurrentUser()

      expect(db.session.findUnique).toHaveBeenCalledWith({
        where: { id: 'session-456' },
        include: { user: true },
      })
    })

    it('should include user in database query', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'session-123' })

      const { db } = await import('@/lib/db')
      vi.mocked(db.session.findUnique).mockResolvedValue(mockSession)

      await getCurrentUser()

      const callArgs = vi.mocked(db.session.findUnique).mock.calls[0][0]
      expect(callArgs.include).toEqual({ user: true })
    })
  })
})
