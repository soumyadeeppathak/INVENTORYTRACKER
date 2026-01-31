# Task 08: Email Service - Resend Integration

**Phase**: 2 - Authentication
**Priority**: Critical
**Blocked By**: Task 05
**Blocks**: Task 07 (parallel OK)

---

## Objective

Implement email service using Resend for sending magic links and group invites.

## Acceptance Criteria

- [ ] Resend SDK integrated
- [ ] EmailService interface implemented
- [ ] Magic link email template created
- [ ] Group invite email template created
- [ ] Emails send successfully in development
- [ ] Environment variable for API key

## Technical Details

### Email Service Implementation

```typescript
// ResendEmailService implements EmailService
import { Resend } from 'resend'

export class ResendEmailService implements EmailService {
  private resend: Resend

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendMagicLink(email: string, link: string): Promise<void> {
    await this.resend.emails.send({
      from: 'InventoryTracker <noreply@yourdomain.com>',
      to: email,
      subject: 'Sign in to InventoryTracker',
      html: `
        <h1>Sign in to InventoryTracker</h1>
        <p>Click the link below to sign in. This link expires in 15 minutes.</p>
        <a href="${link}">Sign in</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    })
  }

  async sendGroupInvite(
    email: string,
    inviterName: string,
    groupName: string,
    link: string
  ): Promise<void> {
    await this.resend.emails.send({
      from: 'InventoryTracker <noreply@yourdomain.com>',
      to: email,
      subject: `${inviterName} invited you to "${groupName}"`,
      html: `
        <h1>You've been invited!</h1>
        <p>${inviterName} invited you to join "${groupName}" on InventoryTracker.</p>
        <a href="${link}">Accept Invite</a>
        <p>This invite expires in 7 days.</p>
      `,
    })
  }
}
```

### Environment Setup

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

## Files to Create

```
src/infrastructure/services/
└── resend-email-service.ts
```

## Verification

```bash
# Manual test: send test email
npm run test -- email/       # Email service tests pass (mocked)
```

---

_Task 08 of 20 | Phase 2: Authentication_
