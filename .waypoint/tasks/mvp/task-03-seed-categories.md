# Task 03: Seed System Categories

**Phase**: 1 - Foundation
**Priority**: High
**Blocked By**: Task 02
**Blocks**: Task 14

---

## Objective

Create database seed script for pre-defined system categories.

## Acceptance Criteria

- [ ] Seed script creates 8 system categories
- [ ] Categories have correct names and emoji
- [ ] isSystem flag set to true
- [ ] groupId is null (system-wide)
- [ ] Seed is idempotent (can run multiple times)
- [ ] Seed runs as part of migration or separately

## Technical Details

### System Categories

| Name | Emoji |
|------|-------|
| Electronics | ⚡ |
| Clothes | 👕 |
| Toiletries | 🧴 |
| Kitchen | 🍳 |
| Sports | ⚽ |
| Tools | 🔧 |
| Documents | 📄 |
| Other | 📦 |

### Seed Script

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

async function main() {
  for (const category of SYSTEM_CATEGORIES) {
    await prisma.category.upsert({
      where: { groupId_name: { groupId: null, name: category.name } },
      update: {},
      create: {
        name: category.name,
        emoji: category.emoji,
        isSystem: true,
        groupId: null,
      },
    })
  }
}
```

## Files to Create

- `prisma/seed.ts`
- Update `package.json` with seed script

## Verification

```bash
npx prisma db seed           # Seed runs without error
npx prisma studio            # 8 categories visible with isSystem=true
# Run seed again - still 8 categories (idempotent)
```

---

_Task 03 of 20 | Phase 1: Foundation_
