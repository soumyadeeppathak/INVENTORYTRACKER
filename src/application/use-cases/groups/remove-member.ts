import { DomainError } from '@/src/domain/errors/domain-error'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface RemoveMemberInput {
  requesterId: string
  groupId: string
  targetUserId: string
}

export interface RemoveMemberOutput {
  success: boolean
}

export class RemoveMemberUseCase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async execute(input: RemoveMemberInput): Promise<RemoveMemberOutput> {
    const requesterId = UserId.create(input.requesterId)
    const targetUserId = UserId.create(input.targetUserId)
    const groupId = GroupId.create(input.groupId)

    // Verify requester is owner of group
    const requesterRole = await this.groupRepository.getMemberRole(groupId, requesterId)
    if (requesterRole !== 'OWNER') {
      throw new DomainError('Only group owners can remove members')
    }

    // Verify target is a member
    const targetRole = await this.groupRepository.getMemberRole(groupId, targetUserId)
    if (targetRole === null) {
      throw new DomainError('User is not a member of this group')
    }

    // If target is an owner, verify they are not the only owner
    if (targetRole === 'OWNER') {
      const members = await this.groupRepository.getMembers(groupId)
      const ownerCount = members.filter((m) => m.role === 'OWNER').length
      if (ownerCount <= 1) {
        throw new DomainError('Cannot remove the only owner of the group')
      }
    }

    // Remove membership
    await this.groupRepository.removeMember(groupId, targetUserId)

    return { success: true }
  }
}
