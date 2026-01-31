import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { userToDomain } from '@/src/infrastructure/persistence/mappers/user-mapper'
import type { User } from '@/src/domain/entities/user'

const SESSION_COOKIE = 'session'
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

/**
 * Create a session cookie with secure settings
 */
export async function createSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * Get the current session ID from cookies
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

/**
 * Clear the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

/**
 * Get the current authenticated user
 * Returns null if no session or session expired
 */
export async function getCurrentUser(): Promise<User | null> {
  const sessionId = await getSessionId()
  if (!sessionId) {
    return null
  }

  // Fetch session from database with user
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })

  // Check if session exists and is not expired
  if (!session || session.expiresAt < new Date()) {
    return null
  }

  // Map to domain entity
  return userToDomain(session.user)
}

/**
 * Require authentication, redirect to login if not authenticated
 * Use this in Server Components and Server Actions that require auth
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}
