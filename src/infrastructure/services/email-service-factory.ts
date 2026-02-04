import type { EmailService } from '@/src/application/ports/email-service'
import { ResendEmailService } from './resend-email-service'
import { BrevoEmailService } from './brevo-email-service'

export function createEmailService(): EmailService {
    const provider = process.env.EMAIL_PROVIDER || 'resend'

    switch (provider.toLowerCase()) {
        case 'brevo':
            return new BrevoEmailService()
        case 'resend':
        default:
            return new ResendEmailService()
    }
}
