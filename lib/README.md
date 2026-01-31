# Library Utilities

This directory contains shared utilities and helpers for the application.

## Authentication (`auth.ts`)

Session management and authentication helpers for Next.js App Router.

### Features

- **HTTP-only Cookies**: Session IDs stored in secure, HTTP-only cookies
- **30-Day Expiry**: Sessions automatically expire after 30 days
- **Secure by Default**: Secure flag enabled in production
- **SameSite Protection**: CSRF protection via SameSite=lax

### Usage

#### Creating a Session

Use this after successful authentication (e.g., magic link verification):

```typescript
import { createSessionCookie } from '@/lib/auth'

// After verifying magic link and creating session
await createSessionCookie(session.id)
```

#### Getting Current User

Use in Server Components or Server Actions:

```typescript
import { getCurrentUser } from '@/lib/auth'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    // Handle unauthenticated state
    return <LoginPrompt />
  }

  return <Dashboard user={user} />
}
```

#### Requiring Authentication

Use when you need to enforce authentication and redirect if not logged in:

```typescript
import { requireAuth } from '@/lib/auth'

export default async function ProtectedPage() {
  // Will redirect to /login if not authenticated
  const user = await requireAuth()

  return <ProtectedContent user={user} />
}
```

#### Signing Out

```typescript
'use server'

import { clearSessionCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function signOut() {
  await clearSessionCookie()
  redirect('/login')
}
```

### Session Cookie Configuration

| Property | Value | Description |
|----------|-------|-------------|
| Name | `session` | Cookie name |
| Max Age | 30 days | Automatically expires after 30 days |
| HTTP Only | `true` | Not accessible via JavaScript (XSS protection) |
| Secure | Production only | HTTPS only in production |
| SameSite | `lax` | CSRF protection |
| Path | `/` | Available across entire app |

### Security Considerations

1. **XSS Protection**: HTTP-only cookies cannot be accessed by JavaScript
2. **CSRF Protection**: SameSite=lax prevents cross-site request forgery
3. **HTTPS**: Secure flag ensures cookies only sent over HTTPS in production
4. **Expiry**: Sessions automatically expire after 30 days
5. **Server-Side Validation**: Session validity checked on every request

### Database Integration

The auth helpers integrate with the database to:
- Fetch user information based on session ID
- Validate session expiry
- Join session and user tables for efficient queries

Sessions are stored in the database with the following structure:
```typescript
{
  id: string          // Session ID (stored in cookie)
  userId: string      // User ID
  expiresAt: Date     // Expiration timestamp
  createdAt: Date     // Creation timestamp
}
```

### Testing

Tests use mocked Next.js cookies and database to verify:
- Cookie creation with correct parameters
- Session retrieval and validation
- Expired session handling
- Missing session handling
- User mapping from database

Run tests:
```bash
npm run test -- auth.test.ts
```

## Database Client (`db.ts`)

Prisma client singleton for database access.

### Usage

```typescript
import { db } from '@/lib/db'

const users = await db.user.findMany()
```

### Development Mode

In development, the client logs queries, errors, and warnings for debugging.

### Production Mode

In production, only errors are logged to reduce noise.
