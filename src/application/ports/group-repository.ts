import type { Group } from '@/src/domain/entities/group'
import type { GroupId } from '@/src/domain/value-objects/group-id'
import type { UserId } from '@/src/domain/value-objects/user-id'

export interface GroupWithCounts {
  group: Group
  locationCount: number
  itemCount: number
  memberCount: number
  role: 'OWNER' | 'MEMBER'
}

export interface GroupMember {
  userId: string
  name: string
  email: string
  role: 'OWNER' | 'MEMBER'
  joinedAt: Date
}

export interface GroupRepository {
  save(group: Group): Promise<void>
  findById(id: GroupId): Promise<Group | null>
  findByUserId(userId: UserId): Promise<Group[]>
  findByUserIdWithCounts(userId: UserId): Promise<GroupWithCounts[]>
  delete(id: GroupId): Promise<void>
  addMember(groupId: GroupId, userId: UserId, role: 'OWNER' | 'MEMBER'): Promise<void>
  removeMember(groupId: GroupId, userId: UserId): Promise<void>
  getMemberCount(groupId: GroupId): Promise<number>
  getMembers(groupId: GroupId): Promise<GroupMember[]>
  getMemberRole(groupId: GroupId, userId: UserId): Promise<'OWNER' | 'MEMBER' | null>
  isMember(groupId: GroupId, userId: UserId): Promise<boolean>
}
