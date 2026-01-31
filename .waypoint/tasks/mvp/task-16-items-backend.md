# Task 16: Items - Backend (Use Cases & API)

**Phase**: 4 - Core Features (Locations & Items)
**Priority**: Critical
**Blocked By**: Tasks 06, 14
**Blocks**: Tasks 17, 18

---

## Objective

Implement item management use cases and API routes.

## Acceptance Criteria

- [ ] CreateItem use case adds item to location
- [ ] GetLocationItems use case returns items for a location
- [ ] UpdateItem use case updates name, emoji, quantity, category
- [ ] DeleteItem use case removes item
- [ ] MoveItem use case moves item to different location
- [ ] Item names unique within location (validation)
- [ ] Authorization checks on all routes

## Technical Details

### Use Cases

```typescript
// CreateItemUseCase
Input: { userId: string, locationId: string, name: string, emoji: string, quantity: number, categoryId?: string }
Output: { itemId: string }

Steps:
1. Find location
2. Verify user is member of group
3. Validate name uniqueness within location
4. Validate emoji and quantity
5. Create Item entity
6. Save item
7. Return item ID

// GetLocationItemsUseCase
Input: { userId: string, locationId: string }
Output: { items: ItemDTO[] }

Steps:
1. Find location
2. Verify user is member of group
3. Fetch items for location
4. Include category info
5. Return as DTOs

// UpdateItemUseCase
Input: { userId: string, itemId: string, name?: string, emoji?: string, quantity?: number, categoryId?: string }
Output: { success: true }

Steps:
1. Find item with location
2. Verify user is member of group
3. Validate name uniqueness (if changed)
4. Validate other fields
5. Update item
6. Return success

// DeleteItemUseCase
Input: { userId: string, itemId: string }
Output: { success: true }

Steps:
1. Find item with location
2. Verify user is member of group
3. Delete item
4. Return success

// MoveItemUseCase
Input: { userId: string, itemId: string, targetLocationId: string }
Output: { success: true }

Steps:
1. Find item with location
2. Find target location
3. Verify both locations in same group
4. Verify user is member of group
5. Validate name uniqueness in target location
6. Move item to target location
7. Return success
```

### API Routes

```
GET    /api/groups/[groupId]/locations/[locationId]/items              - List items
POST   /api/groups/[groupId]/locations/[locationId]/items              - Create item
GET    /api/groups/[groupId]/locations/[locationId]/items/[itemId]     - Get item
PUT    /api/groups/[groupId]/locations/[locationId]/items/[itemId]     - Update item
DELETE /api/groups/[groupId]/locations/[locationId]/items/[itemId]     - Delete item
POST   /api/groups/[groupId]/locations/[locationId]/items/[itemId]/move - Move item
```

### DTOs

```typescript
interface ItemDTO {
  id: string
  name: string
  emoji: string
  quantity: number
  category: CategoryDTO | null
  locationId: string
  createdAt: string
  updatedAt: string
}

interface CategoryDTO {
  id: string
  name: string
  emoji: string
  isSystem: boolean
}
```

## Files to Create

```
src/application/use-cases/items/
├── create-item.ts
├── get-location-items.ts
├── update-item.ts
├── delete-item.ts
└── move-item.ts

src/application/dtos/
├── item-dto.ts
└── category-dto.ts

src/app/api/groups/[groupId]/locations/[locationId]/items/
├── route.ts
└── [itemId]/
    ├── route.ts
    └── move/
        └── route.ts
```

## Verification

```bash
npm run test -- items/   # Use case tests pass
# API tests with authenticated requests
```

---

_Task 16 of 20 | Phase 4: Locations & Items_
