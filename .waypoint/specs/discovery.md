# Discovery: InventoryTracker

> Personal inventory tracking for small groups across multiple locations

**Date**: 2026-01-31
**Phase**: Discovery
**Status**: Complete

---

## Executive Summary

- **Problem**: Friends/couples struggle to remember what belongings are at which location (partner's place, car, vacation home)
- **Solution**: A shared inventory tracker organized by location with quick add/move and search capabilities
- **Users**: Small teams (2-6 people) sharing access to track personal belongings
- **Key Insight**: This is NOT business inventory - it's personal belongings management with social/collaborative features
- **MVP Focus**: Location-based item tracking with quantities, **authentication for sharing**, and fast search
- **Platform**: Progressive Web App (PWA) - mobile-first, installable on home screen

---

## Scope

### What We Explored
- Business domain: personal belongings tracking across locations
- Target users: couples, friend groups, roommates
- Primary use cases: "What's at their place?", "What should I pack?"
- Technical foundation: Next.js, PostgreSQL, Prisma, DDD architecture

### Why This Discovery
New greenfield project requiring domain understanding before specification and architecture.

---

## Landscape

### Domain Model

```
┌─────────────┐       ┌─────────────┐
│    User     │◄─────►│    Group    │
└─────────────┘       └──────┬──────┘
                             │
                             │ owns
                             ▼
                      ┌─────────────┐
                      │  Location   │
                      └──────┬──────┘
                             │
                             │ contains
                             ▼
┌─────────────┐       ┌─────────────┐
│  Category   │◄──────│    Item     │
└─────────────┘       └──────┬──────┘
                             │
                             │ recorded in
                             ▼
                      ┌─────────────┐
                      │  Movement   │
                      └─────────────┘
```

### Core Entities

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| **User** | Person using the system | email, name |
| **Group** | Shared space (couple, friends) | name, members[] |
| **Location** | Place where items live | name, group, icon |
| **Item** | A trackable belonging | name, quantity, location, category |
| **Category** | Item classification | name, icon (optional) |
| **Movement** | Historical transfer record | item, from, to, quantity, timestamp |

### Key User Flows

1. **Add Item**: User adds item → assigns location → sets quantity → optionally categorizes
2. **Move Item**: Select item → pick destination → confirm → system logs movement
3. **Search**: Type query → see matches with current locations → tap to view/edit
4. **Share**: Create/join group → all members see shared locations and items

### Similar Solutions

| App | Strength | Gap for Our Use Case |
|-----|----------|---------------------|
| Sortly | Visual inventory | Business-focused, not social |
| PackPoint | Trip packing lists | No persistent inventory |
| Home inventory apps | Insurance tracking | Single-user, no sharing |

---

## Findings

### What Users Need

1. **Speed**: Adding/moving items must be frictionless (< 3 taps)
2. **Visibility**: "Where is my X?" answered instantly
3. **Sharing**: Partner/roommates see the same data
4. **Simplicity**: Not enterprise software - personal, lightweight feel

### Domain Characteristics

- **Few locations** per group (typically 2-5)
- **Moderate item count** (50-200 items per group)
- **Fungible items** (3 t-shirts, not "my blue Nike t-shirt")
- **Infrequent updates** (items don't move daily)

### Technical Alignment

The DDD architecture fits well because:
- Clear domain entities (Item, Location, Movement)
- Business rules exist (can't move more than quantity, location must belong to group)
- Potential for domain events (item moved, low stock alert)

---

## Risks & Constraints

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Auth complexity | Medium | Medium | Use magic links for simplicity - no password management |
| Multi-user conflicts | Medium | Medium | Optimistic locking, last-write-wins initially |
| PWA installation friction | Low | Medium | Clear install prompts, good standalone experience |
| DDD over-engineering | Medium | Medium | Start simple, add complexity only when needed |

### Constraints

| Constraint | Source | Impact |
|------------|--------|--------|
| Next.js App Router | Constitution | Framework locked |
| PostgreSQL + Prisma | Constitution | Database stack locked |
| DDD Architecture | Constitution | Must follow layer separation |
| Auth required for MVP | Business requirement | Enables sharing from day one |
| Vercel deployment | Configuration | Serverless considerations |
| Solo developer | Project track | Must limit scope |

### Assumptions

1. Users have few locations (2-5) - affects UI design decisions
2. Items are fungible - no individual item tracking
3. Groups are small (2-6 people) - simple permission model
4. **Primary use is mobile** - PWA for home screen installation
5. Text-only items initially - no photo uploads

---

## Recommendations

### Immediate Next Steps

1. **Specify MVP Features** (`/waypoint.specify`)
   - Core: Items, Locations, basic CRUD
   - Sharing: Group creation, invite flow
   - Search: Full-text search across items

2. **Design Data Model** (`/waypoint.architect`)
   - Define Prisma schema
   - Plan DDD layer structure
   - Design API routes

3. **Implement Auth Strategy**
   - Auth is required for MVP to enable sharing
   - Recommended: Magic links (passwordless) for simplicity
   - Alternative: OAuth (Google/GitHub) for faster onboarding

### MVP Scope Suggestion

**In Scope**:
- [ ] **User authentication** (magic links or OAuth)
- [ ] **Group creation and invites** (share with partner/friends)
- [ ] Create/manage locations
- [ ] Add/edit/delete items with quantities
- [ ] Move items between locations
- [ ] Search items by name
- [ ] Basic category assignment

**Deferred**:
- Movement history/audit log
- Photo attachments
- Push notifications
- Offline support

---

## Open Questions

- [ ] **Auth method**: Magic links (simpler) or OAuth providers (Google/GitHub)?
- [ ] **Categories**: Pre-defined list or user-created? Or both?
- [ ] **Partial moves**: Can you move 2 of 5 shirts? Or always move entire item?
- [ ] **Default locations**: Should we seed common locations (Home, Work, Car)?
- [x] **Mobile priority**: PWA from start (decided - mobile-first, installable)

---

## Appendix

### Ubiquitous Language

| Term | Definition |
|------|------------|
| Item | A trackable personal belonging |
| Location | A physical place where items can be stored |
| Group | A shared space for users to collaborate |
| Movement | The act of transferring an item between locations |
| Quantity | The count of identical items at a location |

### File References

- Constitution: `.waypoint/constitution.md`
- Configuration: `.waypoint/config.yaml`
- Manifest: `waypoint.manifest.yaml`

---

_Discovery completed by WayPoint Analyst Agent_
_Project: inventorytracker | Stack: Next.js App Router | Architecture: DDD_
