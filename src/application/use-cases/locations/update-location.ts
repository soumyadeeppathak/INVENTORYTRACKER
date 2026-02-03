import { Emoji } from '@/src/domain/value-objects/emoji'
import { LocationId } from '@/src/domain/value-objects/location-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface UpdateLocationInput {
  userId: string
  locationId: string
  name: string
  emoji: string
}

export interface UpdateLocationOutput {
  success: true
}

export class UpdateLocationUseCase {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: UpdateLocationInput): Promise<UpdateLocationOutput> {
    const userId = UserId.create(input.userId)
    const locationId = LocationId.create(input.locationId)

    // Find location
    const location = await this.locationRepository.findById(locationId)
    if (!location) {
      throw new DomainError('Location not found')
    }

    // Verify user is member of group
    const isMember = await this.groupRepository.isMember(location.groupId, userId)
    if (!isMember) {
      throw new DomainError('You are not a member of this group')
    }

    // Validate and create value objects
    const emoji = Emoji.create(input.emoji)

    // Update location (validates name internally)
    location.updateDetails({
      name: input.name,
      emoji,
    })

    // Save location
    await this.locationRepository.save(location)

    return { success: true }
  }
}
