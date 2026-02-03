import { DomainError } from '@/src/domain/errors/domain-error'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface LeaveGroupInput {
  userId: string
  groupId: string
}

export interface LeaveGroupOutput {
  deleted: boolean
}

export class LeaveGroupUseCase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async execute(input: LeaveGroupInput): Promise<LeaveGroupOutput> {
    const userId = UserId.create(input.userId)
    const groupId = GroupId.create(input.groupId)

    // Verify user is a member
    const isMember = await this.groupRepository.isMember(groupId, userId)
    if (!isMember) {
      throw new DomainError('You are not a member of this group')
    }

    // Remove membership
    await this.groupRepository.removeMember(groupId, userId)

    // Check if any members remain
    const memberCount = await this.groupRepository.getMemberCount(groupId)

    if (memberCount === 0) {
      // Delete the entire group (cascade will handle locations, items, etc.)
      await this.groupRepository.delete(groupId)
      return { deleted: true }
    }

    return { deleted: false }
  }
}
