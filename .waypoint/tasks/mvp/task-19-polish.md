# Task 19: Polish & Empty States

**Phase**: 5 - Search & Polish
**Priority**: Medium
**Blocked By**: Tasks 17, 18
**Blocks**: Task 20

---

## Objective

Add polish, empty states, loading states, error handling, and PWA enhancements for a complete user experience.

## Acceptance Criteria

- [ ] All empty states have helpful illustrations and CTAs
- [ ] Loading skeletons for all data-fetching components
- [ ] Error boundaries with retry options
- [ ] Toast notifications for actions
- [ ] PWA install prompt
- [ ] Offline indicator
- [ ] Pull-to-refresh on mobile
- [ ] Haptic feedback on interactions (mobile)
- [ ] Smooth page transitions

## Technical Details

### Empty States

```typescript
// EmptyGroups
- Illustration: Simple house/folder icon
- "No groups yet"
- "Create your first group to start tracking items"
- [Create Group] button

// EmptyLocations
- Illustration: Map pin icon
- "No locations in this group"
- "Add locations like 'Kitchen' or 'Bedroom'"
- [Add Location] button

// EmptyItems
- Illustration: Box icon
- "No items here yet"
- "Add items you want to track"
- Quick add form focused

// EmptySearch
- Illustration: Magnifying glass
- "No items match '[query]'"
- "Try a different search term"
```

### Loading States

```typescript
// GroupCardSkeleton
- Pulsing placeholder for emoji
- Pulsing text lines
- Same dimensions as GroupCard

// LocationCardSkeleton
- Same pattern as GroupCard

// ItemRowSkeleton
- Inline pulsing elements
- Staggered animation

// FullPageLoader
- Centered spinner
- App logo above
- Used for auth transitions
```

### Error Handling

```typescript
// ErrorBoundary
- Catches React errors
- Shows friendly message
- [Try Again] button
- [Go Home] link

// APIError component
- For failed data fetches
- Retry button
- Contact support link (if persistent)

// FormError
- Inline validation errors
- Red border on inputs
- Error message below
```

### PWA Enhancements

```typescript
// InstallPrompt
- Detects PWA installability
- Shows banner: "Add to Home Screen for quick access"
- [Install] and [Not Now] buttons
- Remembers dismissal for 7 days

// OfflineIndicator
- Fixed banner at top when offline
- "You're offline - some features may not work"
- Auto-hides when back online

// ServiceWorkerUpdate
- Detects new version available
- "Update available" toast
- [Refresh] button to apply
```

### Micro-interactions

```typescript
// Toast notifications
- Success: green with checkmark
- Error: red with X
- Info: blue with info icon
- Auto-dismiss after 3 seconds
- Swipe to dismiss

// Haptic feedback (mobile)
- Light tap on button press
- Medium on successful action
- Error pattern on failure

// Transitions
- Page fade in/out
- List item slide in
- Modal scale up from center
```

## Files to Create

```
src/components/empty-states/
├── empty-groups.tsx
├── empty-locations.tsx
├── empty-items.tsx
└── empty-search.tsx

src/components/loading/
├── group-card-skeleton.tsx
├── location-card-skeleton.tsx
├── item-row-skeleton.tsx
└── full-page-loader.tsx

src/components/error/
├── error-boundary.tsx
├── api-error.tsx
└── form-error.tsx

src/components/pwa/
├── install-prompt.tsx
├── offline-indicator.tsx
└── service-worker-update.tsx

src/hooks/
├── use-online-status.ts
├── use-haptic.ts
└── use-pwa-install.ts

src/lib/
└── haptics.ts
```

## UI Components to Update

- Toast: add variants (success, error, info)
- Button: add loading state
- Input: add error state styling

## Verification

```bash
npm run dev
# Test all empty states display correctly
# Test loading skeletons appear
# Test error recovery works
# Test PWA install prompt
# Test offline indicator
# Test toast notifications
```

---

_Task 19 of 20 | Phase 5: Search & Polish_
