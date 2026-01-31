import type { Group } from '@/src/domain/entities/group'
import type { GroupId } from '@/src/domain/value-objects/group-id'
import type { UserId } from '@/src/domain/value-objects/user-id'

export interface GroupRepository {
  save(group: Group): Promise<void>
  findById(id: GroupId): Promise<Group | null>
  findByUserId(userId: UserId): Promise<Group[]>
  delete(id: GroupId): Promise<void>
  addMember(groupId: GroupId, userId: UserId, role: 'OWNER' | 'MEMBER'): Promise<void>
  removeMember(groupId: GroupId, userId: UserId): Promise<void>
  getMemberCount(groupId: GroupId): Promise<number>
  isMember(groupId: GroupId, userId: UserId): Promise<boolean>
}
