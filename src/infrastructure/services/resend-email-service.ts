import { Resend } from 'resend'
import type { EmailService } from '@/src/application/ports/email-service'

export class ResendEmailService implements EmailService {
  private resend: Resend
  private fromEmail: string

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required')
    }

    this.resend = new Resend(apiKey)
    this.fromEmail = process.env.EMAIL_FROM || 'InventoryTracker <onboarding@resend.dev>'
  }

  async sendMagicLink(email: string, link: string): Promise<void> {
    await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject: 'Sign in to InventoryTracker',
      html: `
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
      `,
    })
  }

  async sendGroupInvite(
    email: string,
    inviterName: string,
    groupName: string,
    link: string,
  ): Promise<void> {
    await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject: `${inviterName} invited you to "${groupName}"`,
      html: `
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
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">InventoryTracker helps you keep track of your belongings across multiple locations and share inventory with your group.</p>
              <a href="${link}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">Accept Invite</a>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">This invite expires in 7 days.</p>
            <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0 0;">Link not working? Copy and paste this URL into your browser:</p>
            <p style="font-size: 12px; color: #9ca3af; word-break: break-all; margin: 4px 0 0 0;">${link}</p>
          </body>
        </html>
      `,
    })
  }
}
