# Task 11: Groups - Backend (Use Cases & API)

**Phase**: 3 - Core Features (Groups)
**Priority**: Critical
**Blocked By**: Task 06, 09
**Blocks**: Tasks 12, 13

---

## Objective

Implement group management use cases and API routes.

## Acceptance Criteria

- [x] CreateGroup use case creates group with owner membership
- [x] GetUserGroups use case returns all groups for a user
- [x] GetGroup use case returns group details with locations and members
- [x] LeaveGroup use case removes membership (deletes group if last member)
- [x] API routes for all group operations
- [x] Authorization checks on all routes

## Technical Details

### Use Cases

```typescript
// CreateGroupUseCase
Input: { userId: string, name: string, emoji: string }
Output: { groupId: string }

Steps:
1. Validate name and emoji
2. Create Group entity
3. Save group
4. Add user as owner member
5. Return group ID

// GetUserGroupsUseCase
Input: { userId: string }
Output: { groups: GroupDTO[] }

Steps:
1. Fetch groups where user is member
2. Include location count, item count, member count
3. Return as DTOs

// GetGroupUseCase
Input: { userId: string, groupId: string }
Output: { group: GroupDetailDTO }

Steps:
1. Verify user is member
2. Fetch group with locations and members
3. Return detailed DTO

// LeaveGroupUseCase
Input: { userId: string, groupId: string }
Output: { deleted: boolean }

Steps:
1. Verify user is member
2. Remove membership
3. Check if any members remain
4. If no members, delete entire group (cascade)
5. Return whether group was deleted
```

### API Routes

```
GET    /api/groups           - List user's groups
POST   /api/groups           - Create group
GET    /api/groups/[groupId] - Get group details
DELETE /api/groups/[groupId] - Leave group
```

### DTOs

```typescript
interface GroupDTO {
  id: string
  name: string
  emoji: string
  locationCount: number
  itemCount: number
  memberCount: number
  role: 'owner' | 'member'
}

interface GroupDetailDTO extends GroupDTO {
  locations: LocationDTO[]
  members: MemberDTO[]
}
```

## Files to Create

```
src/application/use-cases/groups/
├── create-group.ts
├── get-user-groups.ts
├── get-group.ts
└── leave-group.ts

src/application/dtos/
├── group-dto.ts
└── member-dto.ts

src/app/api/groups/
├── route.ts
└── [groupId]/
    └── route.ts
```

## Verification

```bash
npm run test -- groups/      # Use case tests pass
# API tests with authenticated requests
```

---

_Task 11 of 20 | Phase 3: Groups_
