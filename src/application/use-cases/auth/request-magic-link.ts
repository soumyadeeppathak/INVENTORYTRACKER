import type { EmailService } from '@/src/application/ports/email-service'
import type { MagicLinkRepository } from '@/src/application/ports/magic-link-repository'
import { MagicLink } from '@/src/domain/entities/magic-link'
import { Email } from '@/src/domain/value-objects/email'

export interface RequestMagicLinkInput {
  email: string
  callbackUrl: string
}

export interface RequestMagicLinkOutput {
  success: boolean
}

export class RequestMagicLinkUseCase {
  constructor(
    private magicLinkRepository: MagicLinkRepository,
    private emailService: EmailService,
  ) {}

  async execute(input: RequestMagicLinkInput): Promise<RequestMagicLinkOutput> {
    // Validate and normalize email
    const email = Email.create(input.email)

    // Generate magic link with 15-minute expiry
    const magicLink = MagicLink.create({
      email,
      expiresInMinutes: 15,
    })

    // Save magic link
    await this.magicLinkRepository.save(magicLink)

    // Construct link URL
    const linkUrl = `${input.callbackUrl}?token=${magicLink.token}`

    // Send email (don't await to avoid revealing timing)
    this.emailService.sendMagicLink(email.toString(), linkUrl).catch((error) => {
      // Log error but don't throw - we don't want to reveal if email is valid
      console.error('Failed to send magic link email:', error)
    })

    // Always return success to avoid user enumeration
    return { success: true }
  }
}
