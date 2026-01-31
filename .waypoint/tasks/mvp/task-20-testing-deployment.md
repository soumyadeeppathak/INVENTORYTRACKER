# Task 20: Testing & Deployment

**Phase**: 6 - Testing & Launch
**Priority**: Critical
**Blocked By**: Task 19
**Blocks**: None (Final Task)

---

## Objective

Comprehensive testing, performance optimization, and deployment configuration for production launch.

## Acceptance Criteria

- [ ] Unit tests for all use cases (>80% coverage)
- [ ] Integration tests for API routes
- [ ] E2E tests for critical user flows
- [ ] Lighthouse score >90 on all metrics
- [ ] Database migrations ready
- [ ] Environment variables documented
- [ ] Deployment to Vercel configured
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics setup (optional)

## Technical Details

### Unit Tests

```typescript
// Use case tests (Vitest)
// src/__tests__/use-cases/

// Auth
- RequestMagicLinkUseCase
- VerifyMagicLinkUseCase
- GetSessionUseCase

// Groups
- CreateGroupUseCase
- GetUserGroupsUseCase
- GetGroupUseCase
- LeaveGroupUseCase
- InviteMemberUseCase
- AcceptInviteUseCase
- RemoveMemberUseCase

// Locations
- CreateLocationUseCase
- GetGroupLocationsUseCase
- UpdateLocationUseCase
- DeleteLocationUseCase

// Items
- CreateItemUseCase
- GetLocationItemsUseCase
- UpdateItemUseCase
- DeleteItemUseCase
- MoveItemUseCase

// Search
- SearchItemsUseCase
```

### Integration Tests

```typescript
// API route tests
// src/__tests__/api/

- Auth endpoints
- Groups CRUD
- Members management
- Locations CRUD
- Items CRUD
- Search endpoint

// Test with mocked database
// Verify authorization
// Verify response shapes
```

### E2E Tests

```typescript
// Playwright tests
// e2e/

// Critical flows:
1. Sign up flow (magic link)
2. Create first group
3. Add location to group
4. Add items to location
5. Move item between locations
6. Search for item
7. Invite member to group
8. Leave group
```

### Performance Checklist

```
- [ ] Images optimized (WebP, lazy loading)
- [ ] Fonts subset and preloaded
- [ ] JavaScript bundle < 200KB
- [ ] CSS purged of unused styles
- [ ] API responses cached where appropriate
- [ ] Database queries optimized (indexes)
- [ ] Service worker caching strategy
```

### Deployment Configuration

```yaml
# vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "RESEND_API_KEY": "@resend-api-key",
    "SESSION_SECRET": "@session-secret",
    "NEXT_PUBLIC_APP_URL": "@app-url"
  }
}
```

### Environment Variables

```bash
# Required
DATABASE_URL=            # PostgreSQL connection string
RESEND_API_KEY=          # Resend API key for emails
SESSION_SECRET=          # 32+ character secret for sessions
NEXT_PUBLIC_APP_URL=     # Production URL

# Optional
SENTRY_DSN=              # Sentry error tracking
ANALYTICS_ID=            # Analytics tracking ID
```

### Database Migration

```bash
# Production migration steps
1. npx prisma migrate deploy
2. npx prisma db seed (categories)
3. Verify with npx prisma studio
```

### Monitoring Setup

```typescript
// Sentry configuration
// src/lib/sentry.ts

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

## Files to Create

```
src/__tests__/
├── use-cases/
│   ├── auth/
│   ├── groups/
│   ├── locations/
│   ├── items/
│   └── search/
└── api/
    ├── auth.test.ts
    ├── groups.test.ts
    ├── locations.test.ts
    ├── items.test.ts
    └── search.test.ts

e2e/
├── auth.spec.ts
├── groups.spec.ts
├── items.spec.ts
└── search.spec.ts

vercel.json
sentry.client.config.ts
sentry.server.config.ts
sentry.edge.config.ts
```

## Verification

```bash
# Run all tests
npm run test
npm run test:coverage
npm run test:e2e

# Check Lighthouse
npx lighthouse http://localhost:3000 --view

# Verify build
npm run build

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Launch Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Lighthouse >90
- [ ] Preview deployment tested
- [ ] Environment variables set in Vercel
- [ ] Database migrated
- [ ] Categories seeded
- [ ] Sentry connected
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

---

_Task 20 of 20 | Phase 6: Testing & Launch_

**🎉 MVP Complete!**
