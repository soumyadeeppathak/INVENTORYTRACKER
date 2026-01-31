'use server'

import { redirect } from 'next/navigation'
import { RequestMagicLinkUseCase } from '@/src/application/use-cases/auth/request-magic-link'
import { VerifyMagicLinkUseCase } from '@/src/application/use-cases/auth/verify-magic-link'
import { SignOutUseCase } from '@/src/application/use-cases/auth/sign-out'
import { PrismaMagicLinkRepository } from '@/src/infrastructure/persistence/repositories/prisma-magic-link-repository'
import { PrismaUserRepository } from '@/src/infrastructure/persistence/repositories/prisma-user-repository'
import { PrismaSessionRepository } from '@/src/infrastructure/persistence/repositories/prisma-session-repository'
import { ResendEmailService } from '@/src/infrastructure/services/resend-email-service'
import { createSessionCookie, clearSessionCookie, getSessionId } from '@/lib/auth'
import { DomainError } from '@/src/domain/errors/domain-error'
import { db } from '@/lib/db'

interface ActionResult {
  success: boolean
  error?: string
}

/**
 * Request a magic link to be sent to the provided email
 */
export async function requestMagicLink(formData: FormData): Promise<ActionResult> {
  try {
    const email = formData.get('email') as string

    if (!email) {
      return { success: false, error: 'Email is required' }
    }

    // Get base URL for callback
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const callbackUrl = `${baseUrl}/verify`

    // Initialize dependencies
    const magicLinkRepository = new PrismaMagicLinkRepository(db)
    const emailService = new ResendEmailService()

    // Execute use case
    const useCase = new RequestMagicLinkUseCase(magicLinkRepository, emailService)
    await useCase.execute({ email, callbackUrl })

    // Redirect to check-email page
    redirect(`/check-email?email=${encodeURIComponent(email)}`)
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message }
    }

    // Don't reveal internal errors to prevent user enumeration
    console.error('Error requesting magic link:', error)
    return { success: false, error: 'Failed to send magic link. Please try again.' }
  }
}

/**
 * Verify a magic link token and create a session
 */
export async function verifyMagicLink(token: string): Promise<ActionResult> {
  try {
    if (!token) {
      return { success: false, error: 'Token is required' }
    }

    // Initialize dependencies
    const magicLinkRepository = new PrismaMagicLinkRepository(db)
    const userRepository = new PrismaUserRepository(db)
    const sessionRepository = new PrismaSessionRepository(db)

    // Execute use case
    const useCase = new VerifyMagicLinkUseCase(
      magicLinkRepository,
      userRepository,
      sessionRepository,
    )
    const result = await useCase.execute({ token })

    // Set session cookie
    await createSessionCookie(result.sessionId)

    // Redirect to home
    redirect('/')
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message }
    }

    console.error('Error verifying magic link:', error)
    return { success: false, error: 'Failed to verify magic link. Please try again.' }
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    const sessionId = await getSessionId()

    if (sessionId) {
      // Delete session from database
      const sessionRepository = new PrismaSessionRepository(db)
      const useCase = new SignOutUseCase(sessionRepository)
      await useCase.execute({ sessionId })
    }

    // Clear session cookie
    await clearSessionCookie()
  } catch (error) {
    console.error('Error signing out:', error)
  }

  // Always redirect to login, even if there was an error
  redirect('/login')
}
