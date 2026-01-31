import type { GroupInvite } from '@/src/domain/entities/group-invite'
import type { GroupId } from '@/src/domain/value-objects/group-id'

export interface InviteRepository {
  save(invite: GroupInvite): Promise<void>
  findByToken(token: string): Promise<GroupInvite | null>
  findByGroupAndEmail(groupId: GroupId, email: string): Promise<GroupInvite | null>
  markAccepted(token: string): Promise<void>
}
