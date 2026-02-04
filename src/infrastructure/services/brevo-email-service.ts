import * as brevo from '@getbrevo/brevo'
import type { EmailService } from '@/src/application/ports/email-service'

export class BrevoEmailService implements EmailService {
    private apiInstance: brevo.TransactionalEmailsApi
    private fromEmail: string
    private fromName: string

    constructor() {
        const apiKey = process.env.BREVO_API_KEY
        if (!apiKey) {
            throw new Error('BREVO_API_KEY environment variable is required')
        }

        this.apiInstance = new brevo.TransactionalEmailsApi()
        this.apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey)

        // Parse EMAIL_FROM or use defaults
        const emailFrom = process.env.EMAIL_FROM || 'InventoryTracker <noreply@inventorytracker.app>'
        const match = emailFrom.match(/^(.+?)\s*<(.+)>$/)
        if (match) {
            this.fromName = match[1].trim()
            this.fromEmail = match[2].trim()
        } else {
            this.fromName = 'InventoryTracker'
            this.fromEmail = emailFrom
        }
    }

    async sendMagicLink(email: string, link: string): Promise<void> {
        const sendSmtpEmail = new brevo.SendSmtpEmail()

        sendSmtpEmail.subject = 'Sign in to InventoryTracker'
        sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sign in to InventoryTracker</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #1a1a1a;">Sign in to InventoryTracker</h1>
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">Click the button below to sign in to your account. This link expires in 15 minutes.</p>
            <a href="${link}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">Sign In</a>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">If you didn't request this email, you can safely ignore it.</p>
          <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0 0;">Link not working? Copy and paste this URL into your browser:</p>
          <p style="font-size: 12px; color: #9ca3af; word-break: break-all; margin: 4px 0 0 0;">${link}</p>
        </body>
      </html>
    `
        sendSmtpEmail.sender = { name: this.fromName, email: this.fromEmail }
        sendSmtpEmail.to = [{ email }]

        await this.apiInstance.sendTransacEmail(sendSmtpEmail)
    }

    async sendGroupInvite(
        email: string,
        inviterName: string,
        groupName: string,
        link: string,
    ): Promise<void> {
        console.log(`[Brevo] Preparing to send invite to: ${email} from: ${this.fromEmail}`)

        const sendSmtpEmail = new brevo.SendSmtpEmail()

        sendSmtpEmail.subject = `${inviterName} invited you to "${groupName}"`
        sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You've been invited to ${groupName}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #1a1a1a;">You've been invited!</h1>
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;"><strong>${inviterName}</strong> invited you to join <strong>"${groupName}"</strong> on InventoryTracker.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">InventoryTracker helps you keep track of your belongings across multiple sections and share inventory with your group.</p>
            <a href="${link}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">Accept Invite</a>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">This invite expires in 7 days.</p>
          <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0 0;">Link not working? Copy and paste this URL into your browser:</p>
          <p style="font-size: 12px; color: #9ca3af; word-break: break-all; margin: 4px 0 0 0;">${link}</p>
        </body>
      </html>
    `
        sendSmtpEmail.sender = { name: this.fromName, email: this.fromEmail }
        sendSmtpEmail.to = [{ email }]

        try {
            console.log('[Brevo] Sending API request...')
            const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail)
            console.log('[Brevo] Email sent successfully. Message ID:', result.body?.messageId)
        } catch (error: any) {
            console.error('[Brevo] API Error:', error)
            if (error.response) {
                console.error('[Brevo] Error Status:', error.response.status)
                console.error('[Brevo] Error Body:', JSON.stringify(error.response.body))
            }
            throw error
        }
    }
}
