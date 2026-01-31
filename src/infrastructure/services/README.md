# Infrastructure Services

This directory contains implementations of application service ports using external services and APIs.

## Email Service (Resend)

The `ResendEmailService` implements the `EmailService` port using the [Resend](https://resend.com) API.

### Setup

1. **Sign up for Resend**
   - Go to [resend.com](https://resend.com)
   - Create an account and verify your email
   - Add and verify your sending domain (or use their development domain for testing)

2. **Get API Key**
   - Navigate to API Keys in the Resend dashboard
   - Create a new API key
   - Copy the key (it starts with `re_`)

3. **Configure Environment Variables**
   ```bash
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM="InventoryTracker <noreply@yourdomain.com>"
   ```

### Usage

```typescript
import { ResendEmailService } from '@/src/infrastructure/services/resend-email-service'

// Create service instance
const emailService = new ResendEmailService()

// Send magic link
await emailService.sendMagicLink(
  'user@example.com',
  'https://app.example.com/verify?token=abc123'
)

// Send group invite
await emailService.sendGroupInvite(
  'invitee@example.com',
  'John Doe',
  'Home Inventory',
  'https://app.example.com/invite?token=xyz789'
)
```

### Development

For local development, you can use Resend's development domain `onboarding@resend.dev`. This allows you to send test emails without verifying a custom domain.

If `EMAIL_FROM` is not set, the service defaults to `InventoryTracker <onboarding@resend.dev>`.

### Email Templates

#### Magic Link Email
- **Subject**: "Sign in to InventoryTracker"
- **Content**: Sign-in link with 15-minute expiration notice
- **Styling**: Clean, mobile-responsive HTML

#### Group Invite Email
- **Subject**: "{inviterName} invited you to '{groupName}'"
- **Content**: Invitation details with 7-day expiration notice
- **Styling**: Clean, mobile-responsive HTML

### Testing

Tests use mocked Resend API to verify:
- Correct email parameters (to, from, subject)
- Link inclusion in email body
- Error handling
- Environment variable validation

Run tests:
```bash
npm run test -- resend-email-service.test.ts
```

### Error Handling

The service will throw an error if:
- `RESEND_API_KEY` is not set or empty
- Resend API returns an error (network issues, invalid API key, etc.)

Calling code should handle these errors appropriately (typically by catching and logging, as done in `RequestMagicLinkUseCase`).

### Production Considerations

1. **Domain Verification**: Verify your sending domain in Resend to avoid spam filters
2. **Rate Limits**: Be aware of Resend's rate limits for your plan
3. **Monitoring**: Monitor email delivery rates and bounce rates in the Resend dashboard
4. **Fallback**: Consider implementing a fallback email service for redundancy
5. **SPF/DKIM**: Ensure proper DNS records are configured for email authentication
