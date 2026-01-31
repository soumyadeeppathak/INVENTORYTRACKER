# Task 15: Locations - UI (Pages & Components)

**Phase**: 4 - Core Features (Locations & Items)
**Priority**: Critical
**Blocked By**: Tasks 13, 14
**Blocks**: Tasks 16, 17

---

## Objective

Create the locations UI: group view with locations list, create/edit location flow, location detail with items.

## Acceptance Criteria

- [ ] Group page displays locations grid
- [ ] Location cards show emoji, name, item count
- [ ] Create location form with emoji picker
- [ ] Edit location inline or via modal
- [ ] Delete location with confirmation (shows item count warning)
- [ ] Empty state for no locations
- [ ] Breadcrumb navigation
- [ ] Mobile-first responsive design

## Technical Details

### Pages

```
src/app/(app)/groups/[groupId]/
├── page.tsx                    # Group view - locations grid
└── locations/
    ├── new/
    │   └── page.tsx            # Create location
    └── [locationId]/
        ├── page.tsx            # Location view (items)
        └── edit/
            └── page.tsx        # Edit location
```

### Components

```typescript
// LocationCard
- Large emoji (40px)
- Location name
- "X items"
- Click navigates to location
- Edit/delete menu

// LocationList
- Grid layout (2 columns mobile, 3-4 desktop)
- "New Location" card at end
- Empty state if no locations

// CreateLocationForm
- Emoji picker (grid of common emoji)
- Name input
- Submit button
- Server action to create

// EditLocationForm
- Same as create, pre-filled
- Delete button with confirmation

// LocationHeader
- Back to group link
- Location emoji and name
- Edit button
- Item count badge
```

### Server Actions

```typescript
// src/server/actions/location-actions.ts
'use server'

export async function createLocation(groupId: string, formData: FormData)
export async function updateLocation(locationId: string, formData: FormData)
export async function deleteLocation(locationId: string)
```

## Files to Create

```
src/app/(app)/groups/[groupId]/page.tsx
src/app/(app)/groups/[groupId]/locations/new/page.tsx
src/app/(app)/groups/[groupId]/locations/[locationId]/page.tsx
src/app/(app)/groups/[groupId]/locations/[locationId]/edit/page.tsx
src/components/locations/location-card.tsx
src/components/locations/location-list.tsx
src/components/locations/create-location-form.tsx
src/components/locations/edit-location-form.tsx
src/components/locations/location-header.tsx
src/server/actions/location-actions.ts
```

## Verification

```bash
npm run dev
# Navigate to group
# See empty locations state
# Create first location with emoji and name
# See location card in grid
# Edit location name/emoji
# Delete location (with confirmation)
```

---

_Task 15 of 20 | Phase 4: Locations & Items_
