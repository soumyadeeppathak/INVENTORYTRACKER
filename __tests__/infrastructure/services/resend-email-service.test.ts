import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ResendEmailService } from '@/src/infrastructure/services/resend-email-service'

// Mock the Resend module
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ id: 'test-email-id' }),
      },
    })),
  }
})

describe('ResendEmailService', () => {
  let service: ResendEmailService
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env }

    // Set required environment variables
    process.env.RESEND_API_KEY = 'test-api-key'
    process.env.EMAIL_FROM = 'test@example.com'

    // Create service instance
    service = new ResendEmailService()
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should throw error if RESEND_API_KEY is not set', () => {
      // Save and clear the API key
      const savedKey = process.env.RESEND_API_KEY
      process.env.RESEND_API_KEY = ''

      expect(() => new ResendEmailService()).toThrow(
        'RESEND_API_KEY environment variable is required',
      )

      // Restore the key
      process.env.RESEND_API_KEY = savedKey
    })

    it('should use default from email if EMAIL_FROM is not set', () => {
      const savedFrom = process.env.EMAIL_FROM
      process.env.EMAIL_FROM = ''

      const serviceWithDefault = new ResendEmailService()

      expect(serviceWithDefault).toBeDefined()

      // Restore the value
      process.env.EMAIL_FROM = savedFrom
    })
  })

  describe('sendMagicLink', () => {
    it('should send magic link email with correct parameters', async () => {
      const email = 'user@example.com'
      const link = 'https://example.com/verify?token=abc123'

      await service.sendMagicLink(email, link)

      // Get the mock instance
      const { Resend } = await import('resend')
      const mockResendInstance = vi.mocked(Resend).mock.results[0].value
      const mockSend = mockResendInstance.emails.send

      expect(mockSend).toHaveBeenCalledOnce()
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'test@example.com',
          to: email,
          subject: 'Sign in to InventoryTracker',
          html: expect.stringContaining(link),
        }),
      )
    })

    it('should include link in email body', async () => {
      const link = 'https://example.com/verify?token=xyz789'

      await service.sendMagicLink('user@example.com', link)

      const { Resend } = await import('resend')
      const mockResendInstance = vi.mocked(Resend).mock.results[0].value
      const mockSend = mockResendInstance.emails.send
      const callArgs = mockSend.mock.calls[0][0]

      expect(callArgs.html).toContain(link)
      expect(callArgs.html).toContain('15 minutes')
    })

    it('should include security message', async () => {
      await service.sendMagicLink('user@example.com', 'https://example.com/link')

      const { Resend } = await import('resend')
      const mockResendInstance = vi.mocked(Resend).mock.results[0].value
      const mockSend = mockResendInstance.emails.send
      const callArgs = mockSend.mock.calls[0][0]

      expect(callArgs.html).toContain("If you didn't request this email")
    })
  })

  describe('sendGroupInvite', () => {
    it('should send group invite email with correct parameters', async () => {
      const email = 'invitee@example.com'
      const inviterName = 'John Doe'
      const groupName = 'Home Inventory'
      const link = 'https://example.com/invite?token=invite123'

      await service.sendGroupInvite(email, inviterName, groupName, link)

      const { Resend } = await import('resend')
      const mockResendInstance = vi.mocked(Resend).mock.results[0].value
      const mockSend = mockResendInstance.emails.send

      expect(mockSend).toHaveBeenCalledOnce()
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'test@example.com',
          to: email,
          subject: `${inviterName} invited you to "${groupName}"`,
          html: expect.stringContaining(link),
        }),
      )
    })

    it('should include inviter name and group name in email body', async () => {
      const inviterName = 'Jane Smith'
      const groupName = 'Office Supplies'

      await service.sendGroupInvite(
        'user@example.com',
        inviterName,
        groupName,
        'https://example.com/link',
      )

      const { Resend } = await import('resend')
      const mockResendInstance = vi.mocked(Resend).mock.results[0].value
      const mockSend = mockResendInstance.emails.send
      const callArgs = mockSend.mock.calls[0][0]

      expect(callArgs.html).toContain(inviterName)
      expect(callArgs.html).toContain(groupName)
    })

    it('should include invite expiration message', async () => {
      await service.sendGroupInvite('user@example.com', 'John', 'Group', 'https://example.com/link')

      const { Resend } = await import('resend')
      const mockResendInstance = vi.mocked(Resend).mock.results[0].value
      const mockSend = mockResendInstance.emails.send
      const callArgs = mockSend.mock.calls[0][0]

      expect(callArgs.html).toContain('7 days')
    })

    it('should include link in email body', async () => {
      const link = 'https://example.com/invite?token=abc'

      await service.sendGroupInvite('user@example.com', 'John', 'Group', link)

      const { Resend } = await import('resend')
      const mockResendInstance = vi.mocked(Resend).mock.results[0].value
      const mockSend = mockResendInstance.emails.send
      const callArgs = mockSend.mock.calls[0][0]

      expect(callArgs.html).toContain(link)
    })
  })
})
