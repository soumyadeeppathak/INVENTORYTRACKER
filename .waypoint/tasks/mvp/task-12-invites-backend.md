# Task 12: Group Invites - Backend

**Phase**: 3 - Core Features (Groups)
**Priority**: High
**Blocked By**: Tasks 08, 11
**Blocks**: Task 13

---

## Objective

Implement group invitation use cases: invite member, accept invite, remove member.

## Acceptance Criteria

- [ ] InviteMember use case sends invite email
- [ ] AcceptInvite use case adds user to group
- [ ] RemoveMember use case removes membership (owner only)
- [ ] Invite tokens expire after 7 days
- [ ] Existing user joins directly
- [ ] New user creates account then joins
- [ ] One active invite per email per group

## Technical Details

### Use Cases

```typescript
// InviteMemberUseCase
Input: { inviterId: string, groupId: string, email: string }
Output: { success: true }

Steps:
1. Verify inviter is member of group
2. Check for existing invite (update or create)
3. Generate invite token
4. Create/update GroupInvite with 7-day expiry
5. Send invite email via EmailService
6. Return success

// AcceptInviteUseCase
Input: { token: string, userId?: string }
Output: { groupId: string, userId: string }

Steps:
1. Find invite by token
2. Validate not expired
3. Validate not already accepted
4. If userId provided, use existing user
5. If no userId, check if user exists by email
6. If no user, create new user from invite email
7. Add user as member to group
8. Mark invite as accepted
9. Return group and user IDs

// RemoveMemberUseCase
Input: { requesterId: string, groupId: string, targetUserId: string }
Output: { success: true }

Steps:
1. Verify requester is owner of group
2. Verify target is not the only owner
3. Remove membership
4. Return success
```

### API Routes

```
POST   /api/groups/[groupId]/members          - Invite member
GET    /api/groups/[groupId]/members          - List members
DELETE /api/groups/[groupId]/members/[userId] - Remove member
POST   /api/invites/[token]                   - Accept invite
```

## Files to Create

```
src/application/use-cases/groups/
├── invite-member.ts
├── accept-invite.ts
└── remove-member.ts

src/app/api/groups/[groupId]/members/
├── route.ts
└── [userId]/
    └── route.ts

src/app/api/invites/[token]/
└── route.ts
```

## Verification

```bash
npm run test -- invites/     # Use case tests pass
# Manual test: send invite, receive email, accept
```

---

_Task 12 of 20 | Phase 3: Groups_
