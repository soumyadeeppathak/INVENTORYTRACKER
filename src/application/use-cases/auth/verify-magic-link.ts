import type { MagicLinkRepository } from '@/src/application/ports/magic-link-repository'
import type { SessionRepository } from '@/src/application/ports/session-repository'
import type { UserRepository } from '@/src/application/ports/user-repository'
import { Session } from '@/src/domain/entities/session'
import { User } from '@/src/domain/entities/user'
import { DomainError } from '@/src/domain/errors/domain-error'

export interface VerifyMagicLinkInput {
  token: string
}

export interface VerifyMagicLinkOutput {
  userId: string
  sessionId: string
}

export class VerifyMagicLinkUseCase {
  constructor(
    private magicLinkRepository: MagicLinkRepository,
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(input: VerifyMagicLinkInput): Promise<VerifyMagicLinkOutput> {
    // Find magic link by token
    const magicLink = await this.magicLinkRepository.findByToken(input.token)
    if (!magicLink) {
      throw new DomainError('Invalid or expired magic link')
    }

    // Validate link is still valid
    if (!magicLink.isValid) {
      throw new DomainError('Invalid or expired magic link')
    }

    // Find or create user
    let user = await this.userRepository.findByEmail(magicLink.email)
    if (!user) {
      // Create new user from magic link email
      // Extract name from email (before @) as default
      const defaultName = magicLink.email.toString().split('@')[0]
      user = User.create({
        email: magicLink.email,
        name: defaultName,
      })
      await this.userRepository.save(user)
    }

    // Mark magic link as used
    magicLink.markAsUsed()
    await this.magicLinkRepository.save(magicLink)

    // Create session (30-day expiry)
    const session = Session.create({
      userId: user.id,
      expiresInDays: 30,
    })
    await this.sessionRepository.save(session)

    return {
      userId: user.id.toString(),
      sessionId: session.id,
    }
  }
}
