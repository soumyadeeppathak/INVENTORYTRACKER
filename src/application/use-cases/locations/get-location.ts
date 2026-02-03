import { LocationId } from '@/src/domain/value-objects/location-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import type { LocationDTO } from '@/src/application/dtos/group-dto'

export interface GetLocationInput {
  userId: string
  locationId: string
}

export interface GetLocationOutput {
  location: LocationDTO
}

export class GetLocationUseCase {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: GetLocationInput): Promise<GetLocationOutput> {
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

    // Get item count
    const itemCount = await this.locationRepository.getItemCount(locationId)

    return {
      location: {
        id: location.id.toString(),
        name: location.name,
        emoji: location.emoji.toString(),
        itemCount,
      },
    }
  }
}
