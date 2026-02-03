import { UserId } from '@/src/domain/value-objects/user-id'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import type { GroupDTO } from '@/src/application/dtos/group-dto'

export interface GetUserGroupsInput {
  userId: string
}

export interface GetUserGroupsOutput {
  groups: GroupDTO[]
}

export class GetUserGroupsUseCase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async execute(input: GetUserGroupsInput): Promise<GetUserGroupsOutput> {
    const userId = UserId.create(input.userId)

    const groupsWithCounts = await this.groupRepository.findByUserIdWithCounts(userId)

    const groups: GroupDTO[] = groupsWithCounts.map((gwc) => ({
      id: gwc.group.id.toString(),
      name: gwc.group.name,
      emoji: gwc.group.emoji.toString(),
      locationCount: gwc.locationCount,
      itemCount: gwc.itemCount,
      memberCount: gwc.memberCount,
      role: gwc.role === 'OWNER' ? 'owner' : 'member',
    }))

    return { groups }
  }
}
