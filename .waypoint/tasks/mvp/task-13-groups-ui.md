# Task 13: Groups - UI (Pages & Components)

**Phase**: 3 - Core Features (Groups)
**Priority**: Critical
**Blocked By**: Tasks 10, 11, 12
**Blocks**: Task 14

---

## Objective

Create the groups UI: home page with groups list, create group flow, group settings with member management.

## Acceptance Criteria

- [x] Home page displays groups grid
- [x] Group cards show emoji, name, counts
- [x] Create group form with emoji picker
- [x] Group settings page with member list
- [x] Invite member form
- [x] Leave group button with confirmation
- [x] Remove member button (owner only)
- [x] Empty state for no groups
- [x] Mobile-first responsive design

## Technical Details

### Pages

```
src/app/(app)/
├── layout.tsx              # App shell layout
├── page.tsx                # Home - groups grid
└── groups/
    ├── new/
    │   └── page.tsx        # Create group
    └── [groupId]/
        ├── page.tsx        # Group view (locations)
        └── settings/
            └── page.tsx    # Group settings
```

### Components

```typescript
// GroupCard
- Large emoji (48px)
- Group name
- "X locations • Y items"
- Click navigates to group

// GroupList
- Grid layout (2 columns mobile, 3-4 desktop)
- "New Group" card at end
- Empty state if no groups

// CreateGroupForm
- Emoji picker (grid of common emoji)
- Name input
- Submit button
- Server action to create

// GroupSettings
- Group name/emoji (editable)
- Member list
- Invite form
- Leave group button
- Delete confirmation dialog

// InviteMemberForm
- Email input
- Send invite button
- Success toast

// MemberRow
- Avatar/initial
- Name and email
- Role badge (owner/member)
- Remove button (if owner viewing non-owner)
```

### Server Actions

```typescript
// src/server/actions/group-actions.ts
'use server'

export async function createGroup(formData: FormData)
export async function inviteMember(groupId: string, formData: FormData)
export async function leaveGroup(groupId: string)
export async function removeMember(groupId: string, userId: string)
```

## UI Components to Create

- Card
- EmojiPicker
- Dialog (confirmation)
- Toast
- EmptyState
- Badge

## Files to Create

```
src/app/(app)/layout.tsx
src/app/(app)/page.tsx
src/app/(app)/groups/new/page.tsx
src/app/(app)/groups/[groupId]/settings/page.tsx
src/components/groups/group-card.tsx
src/components/groups/group-list.tsx
src/components/groups/create-group-form.tsx
src/components/groups/invite-member-form.tsx
src/components/groups/member-row.tsx
src/components/ui/card.tsx
src/components/ui/emoji-picker.tsx
src/components/ui/dialog.tsx
src/components/ui/toast.tsx
src/components/ui/empty-state.tsx
src/components/ui/badge.tsx
src/server/actions/group-actions.ts
```

## Verification

```bash
npm run dev
# Create account, see empty groups state
# Create first group with emoji and name
# See group card on home
# Access settings, invite partner
# Partner accepts, appears in member list
```

---

_Task 13 of 20 | Phase 3: Groups_
