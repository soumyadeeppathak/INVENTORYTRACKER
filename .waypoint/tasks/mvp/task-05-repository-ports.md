# Task 05: Application Layer - Repository Ports

**Phase**: 1 - Foundation
**Priority**: High
**Blocked By**: Task 04
**Blocks**: Tasks 06, 07-14

---

## Objective

Define repository interfaces (ports) in the application layer. These abstract persistence and will be implemented by Prisma repositories.

## Acceptance Criteria

- [ ] All repository interfaces defined
- [ ] Interfaces use domain entities, not Prisma types
- [ ] Methods cover all CRUD operations needed
- [ ] Email service port defined
- [ ] No implementation yet (just interfaces)

## Technical Details

### Repository Interfaces

```typescript
// UserRepository
- save(user: User): Promise<void>
- findById(id: UserId): Promise<User | null>
- findByEmail(email: Email): Promise<User | null>
- delete(id: UserId): Promise<void>

// GroupRepository
- save(group: Group): Promise<void>
- findById(id: GroupId): Promise<Group | null>
- findByUserId(userId: UserId): Promise<Group[]>
- delete(id: GroupId): Promise<void>
- addMember(groupId: GroupId, userId: UserId, role: string): Promise<void>
- removeMember(groupId: GroupId, userId: UserId): Promise<void>
- getMemberCount(groupId: GroupId): Promise<number>
- isMember(groupId: GroupId, userId: UserId): Promise<boolean>

// LocationRepository
- save(location: Location): Promise<void>
- findById(id: LocationId): Promise<Location | null>
- findByGroupId(groupId: GroupId): Promise<Location[]>
- delete(id: LocationId): Promise<void>
- getItemCount(id: LocationId): Promise<number>

// ItemRepository
- save(item: Item): Promise<void>
- findById(id: ItemId): Promise<Item | null>
- findByLocationId(locationId: LocationId): Promise<Item[]>
- findByLocationAndName(locationId: LocationId, name: string): Promise<Item | null>
- delete(id: ItemId): Promise<void>
- searchByName(userId: UserId, query: string): Promise<Item[]>

// CategoryRepository
- save(category: Category): Promise<void>
- findById(id: CategoryId): Promise<Category | null>
- findSystemCategories(): Promise<Category[]>
- findByGroupId(groupId: GroupId): Promise<Category[]>
- delete(id: CategoryId): Promise<void>

// MagicLinkRepository
- save(link: MagicLink): Promise<void>
- findByToken(token: string): Promise<MagicLink | null>
- markUsed(token: string): Promise<void>
- deleteExpired(): Promise<void>

// InviteRepository
- save(invite: GroupInvite): Promise<void>
- findByToken(token: string): Promise<GroupInvite | null>
- findByGroupAndEmail(groupId: GroupId, email: string): Promise<GroupInvite | null>
- markAccepted(token: string): Promise<void>

// EmailService (port)
- sendMagicLink(email: string, link: string): Promise<void>
- sendGroupInvite(email: string, inviterName: string, groupName: string, link: string): Promise<void>
```

## Files to Create

```
src/application/ports/
├── user-repository.ts
├── group-repository.ts
├── location-repository.ts
├── item-repository.ts
├── category-repository.ts
├── magic-link-repository.ts
├── invite-repository.ts
└── email-service.ts
```

## Verification

```bash
npm run typecheck            # All interfaces compile
```

---

_Task 05 of 20 | Phase 1: Foundation_
