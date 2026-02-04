# Task 08: Email Service - Resend & Brevo Integration

**Phase**: 2 - Authentication
**Priority**: Critical
**Blocked By**: Task 05
**Blocks**: Task 07 (parallel OK)

---

## Objective

Implement email service using a factory pattern to support both Resend and Brevo (Sendinblue) for sending magic links and group invites. This allows flexibility if one provider has limitations (e.g., Resend free tier limits).

## Acceptance Criteria

- [x] Resend SDK integrated
- [x] Brevo SDK integrated
- [x] EmailService interface implemented
- [x] Factory pattern to switch providers
- [x] Magic link email template created
- [x] Group invite email template created
- [x] Emails send successfully in development
- [x] Environment variable for API key and provider selection

## Technical Details

### Email Service Factory

```typescript
// src/infrastructure/services/email-service-factory.ts
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
```

### Brevo Implementation

```typescript
// BrevoEmailService implements EmailService
import * as brevo from '@getbrevo/brevo'

export class BrevoEmailService implements EmailService {
    private apiInstance: brevo.TransactionalEmailsApi

    constructor() {
        // Setup API instance with key
    }
    
    // Implement sendMagicLink and sendGroupInvite using sendTransacEmail
}
```

### Environment Setup

```
# Email Provider (choose one: "resend" or "brevo")
EMAIL_PROVIDER="brevo"

# Brevo
BREVO_API_KEY=xkeysib-xxxxxxxx...

# Resend
RESEND_API_KEY=re_xxxxxxxx...

# Common
EMAIL_FROM="InventoryTracker <noreply@inventorytracker.app>"
```

## Files Created

```
src/infrastructure/services/
├── email-service-factory.ts
├── resend-email-service.ts
└── brevo-email-service.ts
```

## Verification

```bash
# Test specific provider via script (created as needed)
npx tsx scripts/test-email.ts
```

---

_Task 08 of 20 | Phase 2: Authentication_
