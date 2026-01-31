# Task 17: Items - UI (Pages & Components)

**Phase**: 4 - Core Features (Locations & Items)
**Priority**: Critical
**Blocked By**: Tasks 15, 16
**Blocks**: Task 18

---

## Objective

Create the items UI: location view with items list, quick add, edit, move, and delete items.

## Acceptance Criteria

- [ ] Location page displays items list
- [ ] Item rows show emoji, name, quantity, category badge
- [ ] Quick add form at bottom (always visible)
- [ ] Edit item inline or via modal
- [ ] Quantity increment/decrement buttons
- [ ] Move item to different location (location picker)
- [ ] Delete item with swipe or button
- [ ] Category filter chips
- [ ] Empty state for no items
- [ ] Mobile-first responsive design

## Technical Details

### Components

```typescript
// ItemRow
- Emoji (24px)
- Item name
- Category badge (if set)
- Quantity with +/- buttons
- Tap to edit
- Swipe to delete (mobile)
- Menu for move/delete (desktop)

// ItemList
- Vertical list layout
- Category filter chips at top
- Empty state if no items
- Pull to refresh (PWA)

// QuickAddForm
- Fixed at bottom of screen
- Emoji picker (compact)
- Name input
- Quantity input (default 1)
- Category dropdown
- Submit button
- Expands on focus

// EditItemModal
- Full item edit form
- Name, emoji, quantity, category
- Save and Cancel buttons
- Delete button at bottom

// MoveItemModal
- Location picker (list from same group)
- Current location highlighted
- Confirm move button

// QuantityControl
- Minus button
- Current quantity
- Plus button
- Debounced update

// CategoryFilter
- Horizontal scroll chips
- "All" chip first
- System categories + custom
- Active state styling
```

### Server Actions

```typescript
// src/server/actions/item-actions.ts
'use server'

export async function createItem(locationId: string, formData: FormData)
export async function updateItem(itemId: string, formData: FormData)
export async function updateItemQuantity(itemId: string, quantity: number)
export async function moveItem(itemId: string, targetLocationId: string)
export async function deleteItem(itemId: string)
```

### Optimistic Updates

Use React's `useOptimistic` for:
- Quantity changes (immediate feedback)
- Item deletion (remove from list instantly)
- Item creation (add to list with pending state)

## Files to Create

```
src/components/items/item-row.tsx
src/components/items/item-list.tsx
src/components/items/quick-add-form.tsx
src/components/items/edit-item-modal.tsx
src/components/items/move-item-modal.tsx
src/components/items/quantity-control.tsx
src/components/items/category-filter.tsx
src/server/actions/item-actions.ts
```

## UI Components to Create

- SwipeAction (mobile delete gesture)
- DropdownMenu
- Modal (full-screen mobile, centered desktop)

## Files to Create (UI)

```
src/components/ui/swipe-action.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/modal.tsx
```

## Verification

```bash
npm run dev
# Navigate to location
# See empty items state
# Quick add item with emoji and name
# See item in list
# Tap +/- to change quantity
# Edit item name/category
# Move item to different location
# Delete item
```

---

_Task 17 of 20 | Phase 4: Locations & Items_
