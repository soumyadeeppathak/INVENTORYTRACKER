# Technical Plan: InventoryTracker MVP

> Technical architecture for personal inventory tracking system

**Date**: 2026-01-31
**Phase**: Architecture
**Status**: Complete
**Spec Reference**: `.waypoint/specs/mvp.md`

---

## Architecture Alignment

This plan follows **Domain-Driven Design** principles per constitution:

1. **Domain logic is the heart** - Business rules in domain entities
2. **Entities have identity** - UUID-based identification
3. **Value objects are immutable** - Email, ItemName as value objects
4. **Aggregates enforce consistency** - Group as aggregate root
5. **Repositories abstract persistence** - Port/adapter pattern
6. **Ubiquitous language** - Item, Location, Group, Member

---

## File Structure

```
src/
├── domain/                      # Core business logic (NO DEPENDENCIES)
│   ├── entities/
│   │   ├── user.ts              # User entity
│   │   ├── group.ts             # Group aggregate root
│   │   ├── location.ts          # Location entity
│   │   ├── item.ts              # Item entity
│   │   └── category.ts          # Category entity
│   ├── value-objects/
│   │   ├── user-id.ts           # User identifier
│   │   ├── group-id.ts          # Group identifier
│   │   ├── location-id.ts       # Location identifier
│   │   ├── item-id.ts           # Item identifier
│   │   ├── category-id.ts       # Category identifier
│   │   ├── email.ts             # Email value object
│   │   ├── item-name.ts         # Item name (validates uniqueness context)
│   │   └── emoji.ts             # Emoji value object
│   ├── services/
│   │   └── item-uniqueness-service.ts  # Cross-entity uniqueness check
│   └── errors/
│       └── domain-error.ts      # Domain-specific errors
│
├── application/                 # Use cases (DEPENDS ON DOMAIN)
│   ├── use-cases/
│   │   ├── auth/
│   │   │   ├── request-magic-link.ts
│   │   │   ├── verify-magic-link.ts
│   │   │   └── sign-out.ts
│   │   ├── groups/
│   │   │   ├── create-group.ts
│   │   │   ├── get-user-groups.ts
│   │   │   ├── invite-member.ts
│   │   │   ├── accept-invite.ts
│   │   │   ├── leave-group.ts
│   │   │   └── remove-member.ts
│   │   ├── locations/
│   │   │   ├── create-location.ts
│   │   │   ├── get-group-locations.ts
│   │   │   ├── update-location.ts
│   │   │   └── delete-location.ts
│   │   ├── items/
│   │   │   ├── create-item.ts
│   │   │   ├── get-location-items.ts
│   │   │   ├── update-item.ts
│   │   │   ├── delete-item.ts
│   │   │   └── move-item.ts
│   │   ├── categories/
│   │   │   ├── get-categories.ts
│   │   │   └── create-custom-category.ts
│   │   └── search/
│   │       └── search-items.ts
│   ├── ports/
│   │   ├── user-repository.ts
│   │   ├── group-repository.ts
│   │   ├── location-repository.ts
│   │   ├── item-repository.ts
│   │   ├── category-repository.ts
│   │   ├── invite-repository.ts
│   │   ├── magic-link-repository.ts
│   │   └── email-service.ts
│   └── dtos/
│       ├── group-dto.ts
│       ├── location-dto.ts
│       ├── item-dto.ts
│       └── search-result-dto.ts
│
├── infrastructure/              # External concerns (IMPLEMENTS PORTS)
│   ├── persistence/
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Database schema
│   │   │   └── migrations/      # Prisma migrations
│   │   ├── repositories/
│   │   │   ├── prisma-user-repository.ts
│   │   │   ├── prisma-group-repository.ts
│   │   │   ├── prisma-location-repository.ts
│   │   │   ├── prisma-item-repository.ts
│   │   │   ├── prisma-category-repository.ts
│   │   │   ├── prisma-invite-repository.ts
│   │   │   └── prisma-magic-link-repository.ts
│   │   └── mappers/
│   │       ├── user-mapper.ts
│   │       ├── group-mapper.ts
│   │       ├── location-mapper.ts
│   │       ├── item-mapper.ts
│   │       └── category-mapper.ts
│   ├── services/
│   │   └── resend-email-service.ts  # Email via Resend
│   └── auth/
│       └── session.ts           # Session management
│
├── app/                         # Next.js App Router (PRESENTATION)
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── verify/
│   │   │   └── page.tsx         # Magic link verification
│   │   └── layout.tsx           # Auth layout
│   ├── (app)/
│   │   ├── page.tsx             # Home (groups list)
│   │   ├── groups/
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # Create group
│   │   │   └── [groupId]/
│   │   │       ├── page.tsx     # Group view (locations)
│   │   │       ├── settings/
│   │   │       │   └── page.tsx # Group settings
│   │   │       └── locations/
│   │   │           └── [locationId]/
│   │   │               └── page.tsx  # Location view (items)
│   │   ├── search/
│   │   │   └── page.tsx         # Search results
│   │   └── layout.tsx           # App layout with nav
│   ├── api/
│   │   ├── auth/
│   │   │   ├── request-link/
│   │   │   │   └── route.ts
│   │   │   ├── verify/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── groups/
│   │   │   ├── route.ts         # GET (list), POST (create)
│   │   │   └── [groupId]/
│   │   │       ├── route.ts     # GET, DELETE
│   │   │       ├── members/
│   │   │       │   └── route.ts # GET, POST (invite), DELETE
│   │   │       └── locations/
│   │   │           ├── route.ts # GET, POST
│   │   │           └── [locationId]/
│   │   │               ├── route.ts  # GET, PUT, DELETE
│   │   │               └── items/
│   │   │                   ├── route.ts      # GET, POST
│   │   │                   └── [itemId]/
│   │   │                       ├── route.ts  # GET, PUT, DELETE
│   │   │                       └── move/
│   │   │                           └── route.ts  # POST
│   │   ├── categories/
│   │   │   └── route.ts         # GET, POST
│   │   ├── search/
│   │   │   └── route.ts         # GET
│   │   └── invites/
│   │       └── [token]/
│   │           └── route.ts     # POST (accept)
│   └── layout.tsx               # Root layout
│
├── components/                  # React components
│   ├── ui/                      # Shared UI (buttons, inputs, cards)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── empty-state.tsx
│   │   └── emoji-picker.tsx
│   ├── groups/
│   │   ├── group-card.tsx
│   │   ├── group-list.tsx
│   │   ├── create-group-form.tsx
│   │   └── invite-member-form.tsx
│   ├── locations/
│   │   ├── location-card.tsx
│   │   ├── location-list.tsx
│   │   └── create-location-form.tsx
│   ├── items/
│   │   ├── item-row.tsx
│   │   ├── item-list.tsx
│   │   ├── create-item-form.tsx
│   │   ├── edit-item-form.tsx
│   │   └── move-item-dialog.tsx
│   └── search/
│       ├── search-bar.tsx
│       └── search-results.tsx
│
├── lib/                         # Shared utilities
│   ├── db.ts                    # Prisma client singleton
│   ├── auth.ts                  # Auth helpers
│   └── utils.ts                 # General utilities
│
├── public/                      # Static assets (PWA)
│   ├── manifest.json            # PWA manifest
│   ├── icons/                   # App icons (192, 512, maskable)
│   └── sw.js                    # Service worker (generated)
│
└── server/                      # Server Actions
    └── actions/
        ├── auth-actions.ts
        ├── group-actions.ts
        ├── location-actions.ts
        ├── item-actions.ts
        └── search-actions.ts
```

---

## Domain Model

### Aggregate Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                        GROUP AGGREGATE                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Group (Aggregate Root)                                   │   │
│  │  - id: GroupId                                          │   │
│  │  - name: string                                         │   │
│  │  - emoji: Emoji                                         │   │
│  │  - createdAt: Date                                      │   │
│  │  + addLocation(name, emoji): Location                   │   │
│  │  + removeLocation(locationId): void                     │   │
│  │  + getMemberCount(): number                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ 1:N                              │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Location (Entity)                                        │   │
│  │  - id: LocationId                                       │   │
│  │  - name: string                                         │   │
│  │  - emoji: Emoji                                         │   │
│  │  - groupId: GroupId                                     │   │
│  │  + addItem(name, quantity, categoryId?): Item           │   │
│  │  + hasItemWithName(name): boolean                       │   │
│  │  + getItemCount(): number                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ 1:N                              │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Item (Entity)                                            │   │
│  │  - id: ItemId                                           │   │
│  │  - name: string                                         │   │
│  │  - quantity: number                                     │   │
│  │  - categoryId: CategoryId | null                        │   │
│  │  - locationId: LocationId                               │   │
│  │  - createdAt: Date                                      │   │
│  │  - updatedAt: Date                                      │   │
│  │  + updateQuantity(qty): void                            │   │
│  │  + moveTo(locationId): void                             │   │
│  │  + assignCategory(categoryId): void                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        USER AGGREGATE                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ User (Aggregate Root)                                    │   │
│  │  - id: UserId                                           │   │
│  │  - email: Email                                         │   │
│  │  - name: string                                         │   │
│  │  - createdAt: Date                                      │   │
│  │  + changeName(name): void                               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     CATEGORY (ENTITY)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Category                                                 │   │
│  │  - id: CategoryId                                       │   │
│  │  - name: string                                         │   │
│  │  - emoji: Emoji                                         │   │
│  │  - isSystem: boolean                                    │   │
│  │  - groupId: GroupId | null (null for system categories) │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    MEMBERSHIP (JOIN TABLE)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GroupMembership                                          │   │
│  │  - userId: UserId                                       │   │
│  │  - groupId: GroupId                                     │   │
│  │  - role: 'owner' | 'member'                             │   │
│  │  - joinedAt: Date                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Domain Entities

#### User Entity

```typescript
// domain/entities/user.ts
import { UserId } from '../value-objects/user-id'
import { Email } from '../value-objects/email'
import { DomainError } from '../errors/domain-error'

export class User {
  private constructor(
    public readonly id: UserId,
    private _email: Email,
    private _name: string,
    public readonly createdAt: Date
  ) {}

  static create(props: { email: Email; name: string }): User {
    if (props.name.trim().length < 1) {
      throw new DomainError('Name cannot be empty')
    }
    if (props.name.length > 255) {
      throw new DomainError('Name cannot exceed 255 characters')
    }
    return new User(UserId.generate(), props.email, props.name.trim(), new Date())
  }

  static reconstitute(props: {
    id: UserId
    email: Email
    name: string
    createdAt: Date
  }): User {
    return new User(props.id, props.email, props.name, props.createdAt)
  }

  get email(): Email { return this._email }
  get name(): string { return this._name }

  changeName(newName: string): void {
    if (newName.trim().length < 1) {
      throw new DomainError('Name cannot be empty')
    }
    if (newName.length > 255) {
      throw new DomainError('Name cannot exceed 255 characters')
    }
    this._name = newName.trim()
  }
}
```

#### Group Entity (Aggregate Root)

```typescript
// domain/entities/group.ts
import { GroupId } from '../value-objects/group-id'
import { Emoji } from '../value-objects/emoji'
import { DomainError } from '../errors/domain-error'

export class Group {
  private constructor(
    public readonly id: GroupId,
    private _name: string,
    private _emoji: Emoji,
    public readonly createdAt: Date
  ) {}

  static create(props: { name: string; emoji: Emoji }): Group {
    if (props.name.trim().length < 1) {
      throw new DomainError('Group name cannot be empty')
    }
    if (props.name.length > 255) {
      throw new DomainError('Group name cannot exceed 255 characters')
    }
    return new Group(GroupId.generate(), props.name.trim(), props.emoji, new Date())
  }

  static reconstitute(props: {
    id: GroupId
    name: string
    emoji: Emoji
    createdAt: Date
  }): Group {
    return new Group(props.id, props.name, props.emoji, props.createdAt)
  }

  get name(): string { return this._name }
  get emoji(): Emoji { return this._emoji }

  updateDetails(name: string, emoji: Emoji): void {
    if (name.trim().length < 1) {
      throw new DomainError('Group name cannot be empty')
    }
    if (name.length > 255) {
      throw new DomainError('Group name cannot exceed 255 characters')
    }
    this._name = name.trim()
    this._emoji = emoji
  }
}
```

#### Item Entity

```typescript
// domain/entities/item.ts
import { ItemId } from '../value-objects/item-id'
import { LocationId } from '../value-objects/location-id'
import { CategoryId } from '../value-objects/category-id'
import { DomainError } from '../errors/domain-error'

export class Item {
  private constructor(
    public readonly id: ItemId,
    private _name: string,
    private _quantity: number,
    private _categoryId: CategoryId | null,
    private _locationId: LocationId,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: {
    name: string
    quantity?: number
    categoryId?: CategoryId | null
    locationId: LocationId
  }): Item {
    const quantity = props.quantity ?? 1
    if (props.name.trim().length < 1) {
      throw new DomainError('Item name cannot be empty')
    }
    if (props.name.length > 255) {
      throw new DomainError('Item name cannot exceed 255 characters')
    }
    if (quantity < 1) {
      throw new DomainError('Quantity must be at least 1')
    }
    const now = new Date()
    return new Item(
      ItemId.generate(),
      props.name.trim(),
      quantity,
      props.categoryId ?? null,
      props.locationId,
      now,
      now
    )
  }

  static reconstitute(props: {
    id: ItemId
    name: string
    quantity: number
    categoryId: CategoryId | null
    locationId: LocationId
    createdAt: Date
    updatedAt: Date
  }): Item {
    return new Item(
      props.id,
      props.name,
      props.quantity,
      props.categoryId,
      props.locationId,
      props.createdAt,
      props.updatedAt
    )
  }

  get name(): string { return this._name }
  get quantity(): number { return this._quantity }
  get categoryId(): CategoryId | null { return this._categoryId }
  get locationId(): LocationId { return this._locationId }
  get updatedAt(): Date { return this._updatedAt }

  updateDetails(name: string, quantity: number): void {
    if (name.trim().length < 1) {
      throw new DomainError('Item name cannot be empty')
    }
    if (name.length > 255) {
      throw new DomainError('Item name cannot exceed 255 characters')
    }
    if (quantity < 1) {
      throw new DomainError('Quantity must be at least 1')
    }
    this._name = name.trim()
    this._quantity = quantity
    this._updatedAt = new Date()
  }

  assignCategory(categoryId: CategoryId | null): void {
    this._categoryId = categoryId
    this._updatedAt = new Date()
  }

  moveTo(locationId: LocationId): void {
    if (this._locationId.equals(locationId)) {
      return // No-op for same location
    }
    this._locationId = locationId
    this._updatedAt = new Date()
  }
}
```

### Value Objects

#### Email Value Object

```typescript
// domain/value-objects/email.ts
import { DomainError } from '../errors/domain-error'

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase()
    if (!Email.isValid(trimmed)) {
      throw new DomainError(`Invalid email: ${value}`)
    }
    if (trimmed.length > 255) {
      throw new DomainError('Email cannot exceed 255 characters')
    }
    return new Email(trimmed)
  }

  private static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  toString(): string { return this.value }
  equals(other: Email): boolean { return this.value === other.value }
}
```

#### Emoji Value Object

```typescript
// domain/value-objects/emoji.ts
import { DomainError } from '../errors/domain-error'

export class Emoji {
  private constructor(private readonly value: string) {}

  static create(value: string): Emoji {
    const trimmed = value.trim()
    if (!Emoji.isValidEmoji(trimmed)) {
      throw new DomainError(`Invalid emoji: ${value}`)
    }
    return new Emoji(trimmed)
  }

  private static isValidEmoji(value: string): boolean {
    // Match single emoji (including compound emojis)
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(\u200D(\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*$/u
    return emojiRegex.test(value)
  }

  toString(): string { return this.value }
  equals(other: Emoji): boolean { return this.value === other.value }
}
```

---

## Data Model (Prisma Schema)

```prisma
// infrastructure/persistence/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(uuid())
  email       String   @unique
  name        String
  createdAt   DateTime @default(now())

  memberships GroupMembership[]
  magicLinks  MagicLink[]

  @@index([email])
}

model Group {
  id          String   @id @default(uuid())
  name        String
  emoji       String
  createdAt   DateTime @default(now())

  memberships GroupMembership[]
  locations   Location[]
  categories  Category[]
  invites     GroupInvite[]

  @@index([createdAt])
}

model GroupMembership {
  userId    String
  groupId   String
  role      String   @default("member") // "owner" | "member"
  joinedAt  DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@id([userId, groupId])
  @@index([userId])
  @@index([groupId])
}

model Location {
  id        String   @id @default(uuid())
  name      String
  emoji     String
  groupId   String
  createdAt DateTime @default(now())

  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)
  items     Item[]

  @@index([groupId])
}

model Item {
  id          String    @id @default(uuid())
  name        String
  quantity    Int       @default(1)
  categoryId  String?
  locationId  String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  category    Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  location    Location  @relation(fields: [locationId], references: [id], onDelete: Cascade)

  @@unique([locationId, name]) // Unique item names per location
  @@index([locationId])
  @@index([categoryId])
  @@index([name]) // For search
}

model Category {
  id        String   @id @default(uuid())
  name      String
  emoji     String
  isSystem  Boolean  @default(false)
  groupId   String?  // null for system categories

  group     Group?   @relation(fields: [groupId], references: [id], onDelete: Cascade)
  items     Item[]

  @@unique([groupId, name]) // Unique category names per group (or globally for system)
  @@index([isSystem])
  @@index([groupId])
}

model MagicLink {
  id        String   @id @default(uuid())
  token     String   @unique
  email     String
  userId    String?  // null for new signups
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([email])
  @@index([expiresAt])
}

model GroupInvite {
  id        String   @id @default(uuid())
  token     String   @unique
  email     String
  groupId   String
  invitedBy String
  expiresAt DateTime
  acceptedAt DateTime?
  createdAt DateTime @default(now())

  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@unique([groupId, email]) // One invite per email per group
  @@index([token])
  @@index([email])
  @@index([expiresAt])
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}
```

### Database Migrations Plan

| Migration | Purpose |
|-----------|---------|
| 001_init | Create all tables with relationships |
| 002_seed_categories | Insert system categories |

### System Categories Seed

```typescript
// System categories to seed
const SYSTEM_CATEGORIES = [
  { name: 'Electronics', emoji: '⚡' },
  { name: 'Clothes', emoji: '👕' },
  { name: 'Toiletries', emoji: '🧴' },
  { name: 'Kitchen', emoji: '🍳' },
  { name: 'Sports', emoji: '⚽' },
  { name: 'Tools', emoji: '🔧' },
  { name: 'Documents', emoji: '📄' },
  { name: 'Other', emoji: '📦' },
]
```

---

## API Contracts

### Authentication

#### Request Magic Link

- **Method**: POST
- **Path**: `/api/auth/request-link`
- **Request**:
```json
{
  "email": "user@example.com"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Magic link sent to your email"
}
```

#### Verify Magic Link

- **Method**: GET
- **Path**: `/api/auth/verify?token={token}`
- **Response** (200): Redirect to `/` with session cookie set
- **Response** (400):
```json
{
  "error": "Link expired or already used"
}
```

#### Logout

- **Method**: POST
- **Path**: `/api/auth/logout`
- **Response** (200): Clear session cookie, redirect to `/login`

---

### Groups

#### List User Groups

- **Method**: GET
- **Path**: `/api/groups`
- **Response** (200):
```json
{
  "groups": [
    {
      "id": "uuid",
      "name": "Us",
      "emoji": "💑",
      "locationCount": 3,
      "itemCount": 47,
      "memberCount": 2,
      "role": "owner"
    }
  ]
}
```

#### Create Group

- **Method**: POST
- **Path**: `/api/groups`
- **Request**:
```json
{
  "name": "Us",
  "emoji": "💑"
}
```
- **Response** (201):
```json
{
  "id": "uuid",
  "name": "Us",
  "emoji": "💑",
  "createdAt": "2026-01-31T..."
}
```

#### Get Group

- **Method**: GET
- **Path**: `/api/groups/{groupId}`
- **Response** (200):
```json
{
  "id": "uuid",
  "name": "Us",
  "emoji": "💑",
  "locations": [...],
  "members": [
    { "id": "uuid", "name": "Alex", "email": "alex@...", "role": "owner" }
  ],
  "locationCount": 3,
  "itemCount": 47
}
```

#### Delete Group (Leave)

- **Method**: DELETE
- **Path**: `/api/groups/{groupId}`
- **Response** (200):
```json
{
  "success": true,
  "deleted": false,
  "message": "You have left the group"
}
```
- **Response** (200) - Last member:
```json
{
  "success": true,
  "deleted": true,
  "message": "Group deleted (you were the last member)"
}
```

#### Invite Member

- **Method**: POST
- **Path**: `/api/groups/{groupId}/members`
- **Request**:
```json
{
  "email": "partner@example.com"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Invitation sent"
}
```

#### Remove Member

- **Method**: DELETE
- **Path**: `/api/groups/{groupId}/members/{userId}`
- **Response** (200):
```json
{
  "success": true
}
```

---

### Locations

#### List Group Locations

- **Method**: GET
- **Path**: `/api/groups/{groupId}/locations`
- **Response** (200):
```json
{
  "locations": [
    {
      "id": "uuid",
      "name": "My Place",
      "emoji": "🏠",
      "itemCount": 24
    }
  ]
}
```

#### Create Location

- **Method**: POST
- **Path**: `/api/groups/{groupId}/locations`
- **Request**:
```json
{
  "name": "My Place",
  "emoji": "🏠"
}
```
- **Response** (201):
```json
{
  "id": "uuid",
  "name": "My Place",
  "emoji": "🏠",
  "itemCount": 0
}
```

#### Update Location

- **Method**: PUT
- **Path**: `/api/groups/{groupId}/locations/{locationId}`
- **Request**:
```json
{
  "name": "Home",
  "emoji": "🏡"
}
```
- **Response** (200): Updated location object

#### Delete Location

- **Method**: DELETE
- **Path**: `/api/groups/{groupId}/locations/{locationId}`
- **Query**: `?confirm=true` (required if items exist)
- **Response** (200):
```json
{
  "success": true,
  "itemsDeleted": 5
}
```
- **Response** (400) - Has items, no confirm:
```json
{
  "error": "Location has items",
  "itemCount": 5,
  "requiresConfirmation": true
}
```

---

### Items

#### List Location Items

- **Method**: GET
- **Path**: `/api/groups/{groupId}/locations/{locationId}/items`
- **Response** (200):
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Phone charger",
      "quantity": 1,
      "category": { "id": "uuid", "name": "Electronics", "emoji": "⚡" },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Create Item

- **Method**: POST
- **Path**: `/api/groups/{groupId}/locations/{locationId}/items`
- **Request**:
```json
{
  "name": "Phone charger",
  "quantity": 1,
  "categoryId": "uuid"
}
```
- **Response** (201): Created item object
- **Response** (409) - Duplicate name:
```json
{
  "error": "Item with this name already exists in this location",
  "existingItemId": "uuid"
}
```

#### Update Item

- **Method**: PUT
- **Path**: `/api/groups/{groupId}/locations/{locationId}/items/{itemId}`
- **Request**:
```json
{
  "name": "USB-C Charger",
  "quantity": 2,
  "categoryId": "uuid"
}
```
- **Response** (200): Updated item object

#### Delete Item

- **Method**: DELETE
- **Path**: `/api/groups/{groupId}/locations/{locationId}/items/{itemId}`
- **Response** (200):
```json
{
  "success": true
}
```

#### Move Item

- **Method**: POST
- **Path**: `/api/groups/{groupId}/locations/{locationId}/items/{itemId}/move`
- **Request**:
```json
{
  "targetLocationId": "uuid"
}
```
- **Response** (200):
```json
{
  "success": true,
  "item": { ... }
}
```
- **Response** (409) - Name conflict at target:
```json
{
  "error": "An item with this name already exists at the target location",
  "existingItemId": "uuid"
}
```

---

### Categories

#### List Categories

- **Method**: GET
- **Path**: `/api/categories?groupId={groupId}`
- **Response** (200):
```json
{
  "categories": [
    { "id": "uuid", "name": "Electronics", "emoji": "⚡", "isSystem": true },
    { "id": "uuid", "name": "Camping Gear", "emoji": "🏕️", "isSystem": false }
  ]
}
```

#### Create Custom Category

- **Method**: POST
- **Path**: `/api/categories`
- **Request**:
```json
{
  "name": "Camping Gear",
  "emoji": "🏕️",
  "groupId": "uuid"
}
```
- **Response** (201): Created category object

---

### Search

#### Search Items

- **Method**: GET
- **Path**: `/api/search?q={query}`
- **Response** (200):
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "Phone charger",
      "quantity": 1,
      "category": { "name": "Electronics", "emoji": "⚡" },
      "location": { "id": "uuid", "name": "Sarah's Place", "emoji": "🏠" },
      "group": { "id": "uuid", "name": "Us", "emoji": "💑" }
    }
  ],
  "query": "charger",
  "totalCount": 2
}
```

---

### Invites

#### Accept Invite

- **Method**: POST
- **Path**: `/api/invites/{token}`
- **Response** (200): Redirect to group page with session
- **Response** (400):
```json
{
  "error": "Invite expired or invalid"
}
```

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ORM | Prisma | Project standard, type-safe |
| Email | Resend | Simple API, good deliverability |
| Session | HTTP-only cookies | Secure, no client-side token storage |
| State | Server Components + Server Actions | Next.js 15 best practice |
| Styling | Tailwind CSS | Rapid development, mobile-first |
| UI Components | shadcn/ui | Accessible, customizable |
| Forms | React Hook Form + Zod | Type-safe validation |
| Search | PostgreSQL ILIKE | Simple, sufficient for MVP scale |
| **PWA** | next-pwa / Serwist | Installable, standalone mobile experience |

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Project setup (Next.js, TypeScript, Tailwind)
- [ ] PWA configuration (manifest.json, service worker, icons)
- [ ] Prisma schema and migrations
- [ ] Database seed (system categories)
- [ ] Domain entities and value objects
- [ ] Repository interfaces (ports)

### Phase 2: Authentication
- [ ] Magic link flow (request, verify)
- [ ] Session management
- [ ] Email service integration (Resend)
- [ ] Auth middleware
- [ ] Login/verify pages

### Phase 3: Core Features - Groups
- [ ] Group CRUD operations
- [ ] Membership management
- [ ] Invite flow (send, accept)
- [ ] Group UI (list, create, settings)

### Phase 4: Core Features - Locations & Items
- [ ] Location CRUD operations
- [ ] Item CRUD operations
- [ ] Move item functionality
- [ ] Category assignment
- [ ] Location/Item UI

### Phase 5: Search & Polish
- [ ] Global search implementation
- [ ] Search results UI
- [ ] Empty states
- [ ] Recent items suggestions
- [ ] Error handling and edge cases

### Phase 6: Testing & Launch
- [ ] Unit tests for domain logic
- [ ] Integration tests for use cases
- [ ] E2E smoke tests
- [ ] Performance optimization
- [ ] Deployment to Vercel

---

## Testing Strategy

### Unit Tests (Domain Layer)

```typescript
// Example: Item entity tests
describe('Item', () => {
  it('should create item with default quantity of 1', () => {
    const item = Item.create({
      name: 'Charger',
      locationId: LocationId.generate()
    })
    expect(item.quantity).toBe(1)
  })

  it('should reject empty name', () => {
    expect(() => Item.create({
      name: '',
      locationId: LocationId.generate()
    })).toThrow(DomainError)
  })

  it('should not change location on moveTo same location', () => {
    const locationId = LocationId.generate()
    const item = Item.create({ name: 'Test', locationId })
    const originalUpdatedAt = item.updatedAt

    item.moveTo(locationId) // Same location

    expect(item.updatedAt).toBe(originalUpdatedAt)
  })
})
```

### Integration Tests (Use Cases)

```typescript
// Example: CreateItem use case
describe('CreateItemUseCase', () => {
  it('should create item and persist', async () => {
    const useCase = new CreateItemUseCase(mockItemRepo, mockLocationRepo)

    const result = await useCase.execute({
      name: 'Charger',
      quantity: 1,
      locationId: 'loc-123'
    })

    expect(result.id).toBeDefined()
    expect(mockItemRepo.save).toHaveBeenCalled()
  })

  it('should reject duplicate name in same location', async () => {
    mockItemRepo.findByLocationAndName.mockResolvedValue(existingItem)

    await expect(useCase.execute({
      name: 'Charger',
      locationId: 'loc-123'
    })).rejects.toThrow('already exists')
  })
})
```

---

## Security Considerations

| Concern | Implementation |
|---------|----------------|
| Authentication | Magic links with 15min expiry, HTTP-only session cookies |
| Authorization | All API routes check group membership before data access |
| Data isolation | Prisma queries always filter by user's group memberships |
| Input validation | Zod schemas at API boundary, domain validation in entities |
| Rate limiting | 5 magic link requests per hour per email |
| Invite abuse | 10 invites per day per user, invites expire in 7 days |
| XSS prevention | React's built-in escaping, CSP headers |
| CSRF protection | Same-site cookies, origin checking |

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Email deliverability | High | Medium | Use Resend (good reputation), add SPF/DKIM |
| Search performance at scale | Medium | Low | PostgreSQL ILIKE sufficient for MVP; add full-text search post-MVP |
| Concurrent edits | Low | Medium | Optimistic locking via updatedAt; last-write-wins for MVP |
| Mobile UX complexity | Medium | Medium | Mobile-first design, test on real devices |

---

## Architecture Decision Records

### ADR-001: Group as Aggregate Root

**Context**: Need to decide aggregate boundaries for the domain model.

**Decision**: Group is the primary aggregate root. Locations and Items are entities within the Group aggregate boundary.

**Rationale**:
- Group membership defines data access boundaries
- Cascade deletion (last member leaves → delete all) is natural
- Consistency rules (unique item names) are scoped to location within group

**Consequences**:
- Group repository handles loading related entities
- Cross-group operations require coordination through application layer

### ADR-002: Magic Links for Authentication

**Context**: Need simple, secure authentication for MVP.

**Decision**: Use magic links (passwordless email) as the sole authentication method.

**Rationale**:
- No password management complexity
- Secure by default (token-based, expiring)
- Good UX for low-friction onboarding
- Aligns with constitution's "magic-links (MVP)" auth strategy

**Consequences**:
- Depends on email delivery reliability
- Users must have email access to sign in
- May add OAuth later if adoption friction identified

### ADR-003: Soft Delete Not Used

**Context**: Deciding between soft delete and hard delete for data removal.

**Decision**: Use hard delete for all entities.

**Rationale**:
- Simplicity for MVP
- Users expect "delete" to mean gone
- No audit log requirement in MVP
- Privacy-friendly (data actually removed)

**Consequences**:
- No recovery option for deleted data
- May add soft delete + retention period post-MVP if needed

---

_Technical Plan created by WayPoint Architect_
_Project: inventorytracker | Stack: Next.js App Router | Architecture: DDD_
