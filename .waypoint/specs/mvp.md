# Specification: InventoryTracker MVP

> Personal inventory tracking for small groups across multiple locations

**Date**: 2026-01-31
**Phase**: Specification
**Status**: Complete

---

## Overview

### Problem Statement

Friends, couples, and roommates struggle to remember what personal belongings are at which location. Common frustrations include:
- "Did I leave my charger at their place?"
- "What do I need to bring for the weekend?"
- "Do we already have a phone charger in the car?"

Current solutions are either business-focused (Sortly), single-user (home inventory apps), or temporary (packing list apps). None address the social, multi-location nature of personal belongings shared between small groups.

### Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Time to add item | < 10 seconds | Speed is critical for adoption |
| Time to find item | < 5 seconds | "Where is my X?" must be instant |
| Group invite acceptance | > 70% | Sharing is core value prop |
| Weekly active users | 2+ sessions/week | Habit formation |

### Target Users

Small groups (2-6 people) who share belongings across locations:
- **Couples** - tracking items between two homes
- **Roommates** - shared apartment inventory
- **Friend groups** - trip/event planning
- **Families** - items at vacation homes, relatives' places

---

## User Personas

### Persona 1: Alex (Primary User)

**Demographics**: 28, lives with partner, visits partner's place 3-4 times/week
**Tech comfort**: High - uses apps daily
**Goal**: Know what's at partner's place vs. home without texting to ask

**Pain points**:
- Constantly forgets chargers, toiletries at partner's place
- Packs unnecessary items because unsure what's already there
- Texts partner "Do we have X there?" multiple times per week

**Needs**:
- Quick way to check inventory by location
- Fast item adding when unpacking
- Share access with partner

### Persona 2: Jordan (Group Member)

**Demographics**: 25, part of friend group that does monthly camping trips
**Tech comfort**: Medium - uses apps but prefers simplicity
**Goal**: Coordinate shared gear without endless group chats

**Pain points**:
- Group chat chaos: "Who's bringing the cooler?"
- Duplicate items brought on trips
- Gear gets lost track of between trips

**Needs**:
- See what the group collectively has
- Know what's packed vs. at someone's home
- Simple interface, not overwhelming

---

## User Scenarios

### Scenario 1: First-Time Setup (Alex)

**Goal**: Create account and set up first group

1. Alex opens app, sees welcome screen
2. Taps "Get Started"
3. Enters email address
4. Receives magic link, taps to authenticate
5. Prompted to create first group ("Us" with 💑 emoji)
6. Adds first location ("My Place" with 🏠)
7. Adds second location ("Sarah's Place" with 🏠)
8. Sees empty group with 2 locations, ready to add items

**Success**: Alex has a group with locations in under 2 minutes

### Scenario 2: Adding Items After Unpacking (Alex)

**Goal**: Quickly log items left at partner's place

1. Alex just unpacked at Sarah's place
2. Opens app, taps "Us" group
3. Taps "Sarah's Place" location
4. Taps "+" to add item
5. Types "Phone charger", quantity defaults to 1
6. Taps save (< 3 taps total)
7. Repeats for "Toothbrush", "Hoodie" (quantity: 2)
8. Sees items listed with counts

**Success**: 3 items added in under 30 seconds

### Scenario 3: "Where Is My X?" (Alex)

**Goal**: Find a specific item quickly

1. Alex needs laptop charger, unsure where it is
2. Opens app, taps search bar on home screen
3. Types "charger"
4. Sees results: "Phone charger - Sarah's Place (1)", "Laptop charger - My Place (1)"
5. Knows exactly where to look

**Success**: Answer found in under 5 seconds

### Scenario 4: Moving Items (Alex)

**Goal**: Update inventory when bringing items home

1. Alex is heading home with the hoodie
2. Opens app, goes to "Sarah's Place"
3. Finds "Hoodie" item
4. Taps item, selects "Move"
5. Picks destination: "My Place"
6. Confirms move
7. Item now shows at "My Place"

**Success**: Item moved in under 5 taps

### Scenario 5: Inviting Partner (Alex)

**Goal**: Share group with partner

1. Alex wants Sarah to have access
2. Goes to "Us" group settings
3. Taps "Invite Member"
4. Enters Sarah's email
5. Sarah receives invite email with magic link
6. Sarah taps link, creates account
7. Sarah now sees "Us" group with all locations/items

**Success**: Partner has full access within 1 minute of invite

### Scenario 6: Checking Group Inventory (Jordan)

**Goal**: See what the camping group has before a trip

1. Jordan opens app
2. Taps "Camping Crew" group
3. Sees all locations: "Jordan's Garage", "Mike's Shed", "Packed for Trip"
4. Taps each to review gear
5. Knows group has tent, cooler, but needs to buy camp stove

**Success**: Full inventory visibility for planning

---

## Functional Requirements

### Authentication

| ID | Requirement | Priority | Personas |
|----|-------------|----------|----------|
| FR-AUTH-01 | User can sign up with email via magic link | Must | All |
| FR-AUTH-02 | User can sign in with existing email via magic link | Must | All |
| FR-AUTH-03 | Magic link expires after 15 minutes | Must | All |
| FR-AUTH-04 | User session persists for 30 days | Should | All |
| FR-AUTH-05 | User can sign out from any device | Should | All |

### Groups

| ID | Requirement | Priority | Personas |
|----|-------------|----------|----------|
| FR-GRP-01 | User can create a group with name and emoji | Must | Alex |
| FR-GRP-02 | User can view all groups they belong to on home screen | Must | All |
| FR-GRP-03 | User can invite others to a group via email | Must | Alex |
| FR-GRP-04 | Invited user receives email with magic link to join | Must | Jordan |
| FR-GRP-05 | User can leave a group | Should | All |
| FR-GRP-06 | Group creator can remove members | Should | Alex |
| FR-GRP-07 | Group displays location count and total item count | Must | All |
| FR-GRP-08 | When last member leaves, group and all data is permanently deleted | Must | All |
| FR-GRP-09 | If invited user already has account, they join directly without new signup | Should | Jordan |

### Locations

| ID | Requirement | Priority | Personas |
|----|-------------|----------|----------|
| FR-LOC-01 | User can create location with name and emoji within a group | Must | Alex |
| FR-LOC-02 | User can view all locations in a group | Must | All |
| FR-LOC-03 | User can edit location name and emoji | Should | Alex |
| FR-LOC-04 | User can delete location (with confirmation if items exist, cascades delete) | Should | Alex |
| FR-LOC-05 | Location displays item count badge | Must | All |

### Items

| ID | Requirement | Priority | Personas |
|----|-------------|----------|----------|
| FR-ITM-01 | User can add item with name and quantity to a location | Must | Alex |
| FR-ITM-02 | Item quantity defaults to 1, no maximum limit | Must | Alex |
| FR-ITM-03 | User can view all items at a location | Must | All |
| FR-ITM-04 | User can edit item name, quantity, and category | Should | Alex |
| FR-ITM-05 | User can delete an item | Should | Alex |
| FR-ITM-06 | User can assign category to item (optional) | Should | Alex |
| FR-ITM-07 | User can move entire item to different location (same group) | Must | Alex |
| FR-ITM-08 | Item displays category icon/badge if assigned | Should | All |
| FR-ITM-09 | Item names must be unique within a location (case-insensitive) | Must | All |

### Categories

| ID | Requirement | Priority | Personas |
|----|-------------|----------|----------|
| FR-CAT-01 | System provides pre-defined categories (Electronics, Clothes, Toiletries, Kitchen, Sports, Tools, Other) | Must | All |
| FR-CAT-02 | User can create custom categories within a group | Should | Alex |
| FR-CAT-03 | Categories have associated emoji/icon | Should | All |

### Search

| ID | Requirement | Priority | Personas |
|----|-------------|----------|----------|
| FR-SRC-01 | User can search items across all groups from home screen | Must | All |
| FR-SRC-02 | Search results show item name, location, and group | Must | All |
| FR-SRC-03 | Search is case-insensitive and matches partial names | Must | All |
| FR-SRC-04 | Tapping search result navigates to item detail | Should | All |

### Quick Wins (Delight Features)

| ID | Requirement | Priority | Personas |
|----|-------------|----------|----------|
| FR-DLT-01 | Empty location shows friendly message ("Nothing here yet!") | Should | All |
| FR-DLT-02 | When adding item, show recent items as quick-tap suggestions | Should | Alex |
| FR-DLT-03 | Group cards show emoji prominently for visual scanning | Must | All |

---

## Non-Functional Requirements

| ID | Requirement | Target | Rationale |
|----|-------------|--------|-----------|
| NFR-01 | Page load time | < 2 seconds | Mobile users expect speed |
| NFR-02 | Search response time | < 500ms | Instant feel |
| NFR-03 | API response time | < 200ms | Snappy interactions |
| NFR-04 | Progressive Web App | Installable, standalone mobile experience | Primary use is mobile - PWA required |
| NFR-05 | Accessibility | WCAG 2.1 AA | Inclusive design |
| NFR-06 | Data privacy | User data isolated by group | Security requirement |
| NFR-07 | Uptime | 99.5% | Acceptable for MVP |

---

## Out of Scope (MVP)

The following are explicitly **NOT** included in MVP:

| Feature | Reason | Future Consideration |
|---------|--------|----------------------|
| Movement history/audit log | Adds complexity | Post-MVP based on demand |
| Photo attachments for items | Storage complexity | V2 feature |
| Push notifications | Requires additional infra | Post-MVP |
| Full offline support | Complex sync logic | Post-MVP (basic PWA shell in MVP) |
| OAuth (Google/GitHub) | Magic links sufficient | Add if adoption friction |
| Partial item moves | Simplicity - move whole item | Evaluate post-launch |
| Item sharing between groups | Complex permissions | V2 feature |
| Barcode scanning | Overkill for personal items | Unlikely |
| Smart auto-icons | Nice-to-have polish | Post-MVP |

---

## Data Model (Conceptual)

```
User
├── id, email, name, createdAt

Group
├── id, name, emoji, createdAt
├── members: User[] (many-to-many)
├── locations: Location[]

Location
├── id, name, emoji, groupId
├── items: Item[]

Item
├── id, name, quantity, categoryId?, locationId
├── createdAt, updatedAt

Category
├── id, name, emoji, isSystem (true for pre-defined)
├── groupId? (null for system categories)
```

---

## UI Structure

### Navigation Flow

```
Home (Groups List)
├── [Group Card] → Group View (Locations List)
│   ├── [Location Card] → Location View (Items List)
│   │   ├── [Item Row] → Item Detail / Edit
│   │   └── [+ Add Item]
│   ├── [+ Add Location]
│   └── [Settings] → Group Settings (Members, Invite)
├── [+ New Group]
└── [Search Bar] → Search Results
```

### Key Screens

1. **Home**: Grid of group cards with emoji, name, counts
2. **Group View**: List of location cards with item counts
3. **Location View**: List of items with quantities
4. **Item Detail**: Edit name, quantity, category, move
5. **Search Results**: Items matching query with location context
6. **Group Settings**: Member list, invite, leave/delete

---

## Edge Case Behaviors

| Scenario | Expected Behavior |
|----------|-------------------|
| Magic link used twice | Second use shows "Link already used, request new one" |
| Magic link expired | Shows "Link expired, request new one" |
| Invite sent to existing user | User joins group directly, no new account created |
| Invite sent twice to same email | Second invite replaces first (resets expiry) |
| Delete location with items | Confirmation dialog: "This will delete X items. Continue?" |
| Last member leaves group | All group data (locations, items) permanently deleted |
| Add item with duplicate name | Error: "Item already exists. Update quantity instead?" |
| Search with no results | Empty state: "No items found matching 'X'" |
| Move item to same location | No-op, no error (item stays where it is) |
| Delete custom category | Items keep category name but marked as "uncategorized" |

---

## Validation Rules

| Field | Constraints |
|-------|-------------|
| User name | 1-255 characters, emoji allowed |
| User email | Valid email format, max 255 characters |
| Group name | 1-255 characters, emoji allowed |
| Group emoji | Single emoji character |
| Location name | 1-255 characters, emoji allowed |
| Location emoji | Single emoji character |
| Item name | 1-255 characters, emoji allowed, unique per location |
| Item quantity | Integer >= 1, no maximum |
| Category name | 1-255 characters, emoji allowed |
| Category emoji | Single emoji character |

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Unauthorized access | Magic link auth, session tokens |
| Data isolation | All queries scoped by group membership |
| Invite abuse | Rate limit invites, expire links |
| Input validation | Sanitize all user input server-side |
| SQL injection | Prisma ORM with parameterized queries |

---

## Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| Auth method? | Magic links (passwordless email) |
| Partial moves? | No - move entire item only |
| Categories? | Pre-defined + user-created custom |

## Clarifications (Resolved)

The following ambiguities were identified and resolved during clarification:

| Question | Decision | Rationale |
|----------|----------|-----------|
| Last member leaves group? | Delete everything | No orphaned data, clean slate |
| Delete location with items? | Yes, with confirmation | Flexible but safe with warning |
| Duplicate item names in location? | No, must be unique | Prevents confusion, encourages merging |
| Text field limits? | Relaxed (1-255 chars, emoji in names OK) | User flexibility |
| Max item quantity? | Unlimited | Trust user judgment |
| Default locations on group create? | No | Keep onboarding minimal |

## Remaining Open Questions

| Question | Impact | Needs Answer By |
|----------|--------|-----------------|
| Rate limit for invites? | Low - abuse prevention | Architecture |

---

## Appendix: Pre-defined Categories

| Category | Emoji | Examples |
|----------|-------|----------|
| Electronics | ⚡ | Chargers, cables, devices |
| Clothes | 👕 | Shirts, pants, jackets |
| Toiletries | 🧴 | Toothbrush, shampoo, razor |
| Kitchen | 🍳 | Utensils, containers, appliances |
| Sports | ⚽ | Gear, equipment, accessories |
| Tools | 🔧 | Hardware, equipment |
| Documents | 📄 | Papers, IDs, keys |
| Other | 📦 | Miscellaneous items |

---

_Specification created by WayPoint Product Manager_
_Project: inventorytracker | Stack: Next.js App Router | Architecture: DDD_
