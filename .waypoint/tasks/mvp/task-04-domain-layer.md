# Task 04: Domain Layer - Entities & Value Objects

**Phase**: 1 - Foundation
**Priority**: Critical
**Blocked By**: Task 01
**Blocks**: Tasks 05, 07-14

---

## Objective

Implement pure domain entities and value objects following DDD principles. No database or framework dependencies.

## Acceptance Criteria

- [ ] All value objects implemented with validation
- [ ] All entities implemented with business logic
- [ ] Domain error class created
- [ ] Entities have `create()` and `reconstitute()` factory methods
- [ ] Value objects are immutable with `equals()` method
- [ ] Unit tests pass for all domain logic

## Technical Details

### Value Objects

| Value Object | Validation |
|--------------|------------|
| `UserId` | UUID format |
| `GroupId` | UUID format |
| `LocationId` | UUID format |
| `ItemId` | UUID format |
| `CategoryId` | UUID format |
| `Email` | Valid email format, max 255 chars, lowercase |
| `Emoji` | Single emoji character (including compound) |

### Entities

| Entity | Business Rules |
|--------|----------------|
| `User` | Name 1-255 chars, changeName() |
| `Group` | Name 1-255 chars, updateDetails() |
| `Location` | Name 1-255 chars, belongs to group |
| `Item` | Name 1-255 chars, quantity >= 1, moveTo(), assignCategory() |
| `Category` | Name 1-255 chars, isSystem flag |

### Domain Error

```typescript
export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}
```

## Files to Create

```
src/domain/
├── errors/
│   └── domain-error.ts
├── value-objects/
│   ├── user-id.ts
│   ├── group-id.ts
│   ├── location-id.ts
│   ├── item-id.ts
│   ├── category-id.ts
│   ├── email.ts
│   └── emoji.ts
└── entities/
    ├── user.ts
    ├── group.ts
    ├── location.ts
    ├── item.ts
    └── category.ts
```

## Test Cases

```typescript
// Item tests
- Create item with default quantity 1
- Reject empty name
- Reject name > 255 chars
- Reject quantity < 1
- moveTo() updates location
- moveTo() same location is no-op
- assignCategory() updates category

// Email tests
- Valid email creates successfully
- Invalid email throws DomainError
- Email normalized to lowercase

// Emoji tests
- Single emoji creates successfully
- Compound emoji (family) creates successfully
- Non-emoji string throws DomainError
```

## Verification

```bash
npm run test -- domain/      # All domain tests pass
npm run typecheck            # No type errors
```

---

_Task 04 of 20 | Phase 1: Foundation_
