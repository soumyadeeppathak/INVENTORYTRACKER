# Task 10: Authentication UI Pages

**Phase**: 2 - Authentication
**Priority**: Critical
**Blocked By**: Tasks 07, 09
**Blocks**: Task 11

---

## Objective

Create login, email verification, and check-email pages for the authentication flow.

## Acceptance Criteria

- [ ] Login page with email input
- [ ] "Check your email" page after magic link sent
- [ ] Verify page handles magic link tokens
- [ ] Error states for expired/invalid links
- [ ] Resend link option
- [ ] Mobile-first responsive design
- [ ] Loading states during submission

## Technical Details

### Pages

```
src/app/(auth)/
├── layout.tsx          # Centered layout for auth pages
├── login/
│   └── page.tsx        # Email input form
├── check-email/
│   └── page.tsx        # "Check your inbox" message
└── verify/
    └── page.tsx        # Token verification (auto-redirects)
```

### Login Page

```tsx
// Features:
// - Email input with validation
// - Submit button with loading state
// - Server action to request magic link
// - Redirect to /check-email on success
// - Error display for failures
```

### Check Email Page

```tsx
// Features:
// - Email icon/illustration
// - "Check your inbox" message
// - Display submitted email
// - "Link expires in 15 minutes" note
// - "Resend link" button
```

### Verify Page

```tsx
// Features:
// - Read token from URL params
// - Auto-verify on page load
// - Loading spinner during verification
// - Redirect to / on success
// - Error message for expired/used links
// - Link to request new magic link
```

### Server Actions

```typescript
// src/server/actions/auth-actions.ts
'use server'

export async function requestMagicLink(formData: FormData) {
  const email = formData.get('email') as string
  // ... use case execution
  redirect('/check-email?email=' + encodeURIComponent(email))
}

export async function verifyMagicLink(token: string) {
  // ... use case execution
  // Set session cookie
  redirect('/')
}

export async function signOut() {
  // ... use case execution
  // Clear session cookie
  redirect('/login')
}
```

## UI Components Needed

- Button (primary variant)
- Input (email type)
- Spinner (loading indicator)

## Files to Create

```
src/app/(auth)/layout.tsx
src/app/(auth)/login/page.tsx
src/app/(auth)/check-email/page.tsx
src/app/(auth)/verify/page.tsx
src/server/actions/auth-actions.ts
src/components/ui/button.tsx
src/components/ui/input.tsx
src/components/ui/spinner.tsx
```

## Verification

```bash
npm run dev
# Navigate to /login
# Enter email, submit
# Redirected to /check-email
# Click magic link from email
# Redirected to / (home)
```

---

_Task 10 of 20 | Phase 2: Authentication_
