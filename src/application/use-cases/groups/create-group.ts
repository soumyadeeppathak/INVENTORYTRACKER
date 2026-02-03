import { Group } from '@/src/domain/entities/group'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { UserId } from '@/src/domain/value-objects/user-id'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface CreateGroupInput {
  userId: string
  name: string
  emoji: string
}

export interface CreateGroupOutput {
  groupId: string
}

export class CreateGroupUseCase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async execute(input: CreateGroupInput): Promise<CreateGroupOutput> {
    // Validate and create value objects
    const emoji = Emoji.create(input.emoji)
    const userId = UserId.create(input.userId)

    // Create group entity (validates name)
    const group = Group.create({
      name: input.name,
      emoji,
    })

    // Save group
    await this.groupRepository.save(group)

    // Add user as owner
    await this.groupRepository.addMember(group.id, userId, 'OWNER')

    return { groupId: group.id.toString() }
  }
}
