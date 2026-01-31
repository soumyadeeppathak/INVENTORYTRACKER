# Task 07: Authentication - Magic Link Flow

**Phase**: 2 - Authentication
**Priority**: Critical
**Blocked By**: Task 06
**Blocks**: Tasks 08, 09, 10

---

## Objective

Implement magic link authentication use cases: request link, verify link, sign out.

## Acceptance Criteria

- [ ] RequestMagicLink use case creates token and sends email
- [ ] VerifyMagicLink use case validates token and creates session
- [ ] SignOut use case deletes session
- [ ] Tokens expire after 15 minutes
- [ ] Tokens can only be used once
- [ ] New user is created if email doesn't exist
- [ ] Existing user signs in directly

## Technical Details

### Use Cases

```typescript
// RequestMagicLinkUseCase
Input: { email: string }
Output: { success: true }

Steps:
1. Validate email format
2. Find or prepare to create user
3. Generate secure random token
4. Create MagicLink with 15min expiry
5. Send email with link via EmailService
6. Return success (don't reveal if user exists)

// VerifyMagicLinkUseCase
Input: { token: string }
Output: { userId: string, sessionId: string }

Steps:
1. Find magic link by token
2. Validate not expired
3. Validate not already used
4. Create user if new (from email on link)
5. Mark link as used
6. Create session (30 day expiry)
7. Return session info

// SignOutUseCase
Input: { sessionId: string }
Output: { success: true }

Steps:
1. Delete session from database
2. Return success
```

### Token Generation

```typescript
import { randomBytes } from 'crypto'

function generateToken(): string {
  return randomBytes(32).toString('hex')
}
```

## Files to Create

```
src/application/use-cases/auth/
├── request-magic-link.ts
├── verify-magic-link.ts
└── sign-out.ts
```

## Verification

```bash
npm run test -- auth/        # Use case tests pass
```

---

_Task 07 of 20 | Phase 2: Authentication_
