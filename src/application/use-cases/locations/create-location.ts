import { Location } from '@/src/domain/entities/location'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface CreateLocationInput {
  userId: string
  groupId: string
  name: string
  emoji: string
}

export interface CreateLocationOutput {
  locationId: string
}

export class CreateLocationUseCase {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: CreateLocationInput): Promise<CreateLocationOutput> {
    const userId = UserId.create(input.userId)
    const groupId = GroupId.create(input.groupId)

    // Verify user is member of group
    const isMember = await this.groupRepository.isMember(groupId, userId)
    if (!isMember) {
      throw new DomainError('You are not a member of this group')
    }

    // Validate and create value objects
    const emoji = Emoji.create(input.emoji)

    // Create location entity (validates name)
    const location = Location.create({
      name: input.name,
      emoji,
      groupId,
    })

    // Save location
    await this.locationRepository.save(location)

    return { locationId: location.id.toString() }
  }
}
