# Task 14: Locations - Backend (Use Cases & API)

**Phase**: 4 - Core Features (Locations & Items)
**Priority**: Critical
**Blocked By**: Task 06
**Blocks**: Tasks 15, 16

---

## Objective

Implement location management use cases and API routes.

## Acceptance Criteria

- [x] CreateLocation use case adds location to group
- [x] GetGroupLocations use case returns locations with item counts
- [x] UpdateLocation use case updates name and emoji
- [x] DeleteLocation use case removes location (cascade items)
- [x] Delete requires confirmation if items exist
- [x] Authorization checks on all routes

## Technical Details

### Use Cases

```typescript
// CreateLocationUseCase
Input: { userId: string, groupId: string, name: string, emoji: string }
Output: { locationId: string }

Steps:
1. Verify user is member of group
2. Validate name and emoji
3. Create Location entity
4. Save location
5. Return location ID

// GetGroupLocationsUseCase
Input: { userId: string, groupId: string }
Output: { locations: LocationDTO[] }

Steps:
1. Verify user is member of group
2. Fetch locations for group
3. Include item count for each
4. Return as DTOs

// UpdateLocationUseCase
Input: { userId: string, locationId: string, name: string, emoji: string }
Output: { success: true }

Steps:
1. Find location
2. Verify user is member of group
3. Validate name and emoji
4. Update location
5. Return success

// DeleteLocationUseCase
Input: { userId: string, locationId: string, confirmed: boolean }
Output: { success: true, itemsDeleted: number }

Steps:
1. Find location
2. Verify user is member of group
3. Check item count
4. If items exist and not confirmed, return error with count
5. Delete location (cascade deletes items)
6. Return success with items deleted count
```

### API Routes

```
GET    /api/groups/[groupId]/locations              - List locations
POST   /api/groups/[groupId]/locations              - Create location
GET    /api/groups/[groupId]/locations/[locationId] - Get location
PUT    /api/groups/[groupId]/locations/[locationId] - Update location
DELETE /api/groups/[groupId]/locations/[locationId] - Delete location
```

### DTOs

```typescript
interface LocationDTO {
  id: string
  name: string
  emoji: string
  itemCount: number
  createdAt: string
}
```

## Files to Create

```
src/application/use-cases/locations/
├── create-location.ts
├── get-group-locations.ts
├── update-location.ts
└── delete-location.ts

src/application/dtos/
└── location-dto.ts

src/app/api/groups/[groupId]/locations/
├── route.ts
└── [locationId]/
    └── route.ts
```

## Verification

```bash
npm run test -- locations/   # Use case tests pass
# API tests with authenticated requests
```

---

_Task 14 of 20 | Phase 4: Locations & Items_
