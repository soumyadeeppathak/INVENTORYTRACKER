# Task 18: Search - Backend & UI

**Phase**: 5 - Search & Polish
**Priority**: High
**Blocked By**: Tasks 16, 17
**Blocks**: Task 19

---

## Objective

Implement global search across all items in user's groups with real-time results.

## Acceptance Criteria

- [ ] Search endpoint searches items across all user's groups
- [ ] Search matches item name (partial, case-insensitive)
- [ ] Results grouped by location within group
- [ ] Results show item details with location context
- [ ] Search UI with instant results (debounced)
- [ ] Empty state for no results
- [ ] Recent searches stored locally
- [ ] Mobile keyboard optimization

## Technical Details

### Use Case

```typescript
// SearchItemsUseCase
Input: { userId: string, query: string, limit?: number }
Output: { results: SearchResultDTO[] }

Steps:
1. Validate query (min 2 characters)
2. Get all groups where user is member
3. Search items where name ILIKE %query%
4. Order by relevance (exact match first, then partial)
5. Limit results (default 20)
6. Return with location and group context
```

### API Route

```
GET /api/search?q=query&limit=20
```

### DTOs

```typescript
interface SearchResultDTO {
  item: {
    id: string
    name: string
    emoji: string
    quantity: number
  }
  location: {
    id: string
    name: string
    emoji: string
  }
  group: {
    id: string
    name: string
    emoji: string
  }
}
```

### Search UI Components

```typescript
// SearchBar
- Fixed at top of home page
- Search icon
- Input with placeholder "Search items..."
- Clear button when has value
- Focus expands to full screen (mobile)

// SearchResults
- Grouped by group, then location
- Group header with emoji and name
- Location subheader
- Item rows with quantity
- Tap navigates to item in location

// SearchEmptyState
- "No items found"
- Suggestion to try different terms

// RecentSearches
- Shows when search bar focused but empty
- List of recent queries
- Clear all button
- Tap to search again
```

### Implementation Notes

```typescript
// Debounced search (300ms)
const debouncedSearch = useDebouncedCallback((query: string) => {
  if (query.length >= 2) {
    searchItems(query)
  }
}, 300)

// Local storage for recent searches
const RECENT_SEARCHES_KEY = 'inventory-recent-searches'
const MAX_RECENT_SEARCHES = 5
```

## Files to Create

```
src/application/use-cases/search/
└── search-items.ts

src/application/dtos/
└── search-result-dto.ts

src/app/api/search/
└── route.ts

src/components/search/
├── search-bar.tsx
├── search-results.tsx
├── search-empty-state.tsx
└── recent-searches.tsx

src/hooks/
├── use-search.ts
└── use-debounce.ts
```

## Verification

```bash
npm run test -- search/   # Use case tests pass
npm run dev
# Type in search bar
# See results appear after typing
# Results grouped correctly
# Tap result navigates to location
# Recent searches saved and shown
```

---

_Task 18 of 20 | Phase 5: Search & Polish_
