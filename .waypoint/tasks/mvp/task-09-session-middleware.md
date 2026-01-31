# Task 09: Session Management & Auth Middleware

**Phase**: 2 - Authentication
**Priority**: Critical
**Blocked By**: Task 07
**Blocks**: Tasks 10, 11-14

---

## Objective

Implement session management with HTTP-only cookies and auth middleware for protecting routes.

## Acceptance Criteria

- [ ] Session cookie set on successful auth
- [ ] Cookie is HTTP-only, secure, same-site
- [ ] Session expires after 30 days
- [ ] Auth helper to get current user from request
- [ ] Middleware redirects unauthenticated users to /login
- [ ] Protected routes under (app) group
- [ ] Public routes under (auth) group

## Technical Details

### Session Cookie

```typescript
// src/lib/auth.ts
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'session'
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export async function createSessionCookie(sessionId: string) {
  cookies().set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export async function getSessionId(): Promise<string | null> {
  return cookies().get(SESSION_COOKIE)?.value ?? null
}

export async function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE)
}
```

### Auth Helper

```typescript
export async function getCurrentUser(): Promise<User | null> {
  const sessionId = await getSessionId()
  if (!sessionId) return null

  // Fetch session from database
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return UserMapper.toDomain(session.user)
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}
```

### Route Protection (Middleware)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/verify')

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons).*)'],
}
```

## Files to Create

```
src/lib/auth.ts
src/middleware.ts
```

## Verification

```bash
# Unauthenticated user redirected to /login
# Authenticated user can access /
# Session cookie is HTTP-only in browser dev tools
npm run test -- auth/        # Session tests pass
```

---

_Task 09 of 20 | Phase 2: Authentication_
