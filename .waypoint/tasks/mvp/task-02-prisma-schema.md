# Task 02: Prisma Schema & Database

**Phase**: 1 - Foundation
**Priority**: Critical
**Blocked By**: Task 01
**Blocks**: Tasks 03, 04, 05, 06

---

## Objective

Set up Prisma ORM with PostgreSQL schema for all entities.

## Acceptance Criteria

- [ ] Prisma installed and configured
- [ ] Database schema matches technical plan
- [ ] All models created: User, Group, GroupMembership, Location, Item, Category, MagicLink, GroupInvite, Session
- [ ] Relationships and indexes defined
- [ ] Unique constraints applied (item name per location, category name per group)
- [ ] Cascade deletes configured
- [ ] Migration created and applied
- [ ] Prisma client singleton created

## Technical Details

### Schema Models

```prisma
model User {
  id, email (unique), name, createdAt
  memberships, magicLinks
}

model Group {
  id, name, emoji, createdAt
  memberships, locations, categories, invites
}

model GroupMembership {
  userId, groupId, role, joinedAt
  @@id([userId, groupId])
}

model Location {
  id, name, emoji, groupId, createdAt
  onDelete: Cascade from Group
}

model Item {
  id, name, quantity, categoryId?, locationId, createdAt, updatedAt
  @@unique([locationId, name])
  onDelete: Cascade from Location
}

model Category {
  id, name, emoji, isSystem, groupId?
  @@unique([groupId, name])
}

model MagicLink {
  id, token (unique), email, userId?, expiresAt, usedAt, createdAt
}

model GroupInvite {
  id, token (unique), email, groupId, invitedBy, expiresAt, acceptedAt, createdAt
  @@unique([groupId, email])
}

model Session {
  id, userId, expiresAt, createdAt
}
```

## Files to Create

- `prisma/schema.prisma`
- `src/lib/db.ts` (Prisma client singleton)
- `prisma/migrations/001_init/migration.sql` (auto-generated)

## Verification

```bash
npx prisma generate          # Client generated
npx prisma migrate dev       # Migration applied
npx prisma studio            # Can browse empty tables
```

---

_Task 02 of 20 | Phase 1: Foundation_
