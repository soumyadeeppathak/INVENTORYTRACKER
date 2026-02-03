import { GroupId } from '@/src/domain/value-objects/group-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import type { LocationDTO } from '@/src/application/dtos/group-dto'

export interface GetGroupLocationsInput {
  userId: string
  groupId: string
}

export interface GetGroupLocationsOutput {
  locations: LocationDTO[]
}

export class GetGroupLocationsUseCase {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: GetGroupLocationsInput): Promise<GetGroupLocationsOutput> {
    const userId = UserId.create(input.userId)
    const groupId = GroupId.create(input.groupId)

    // Verify user is member of group
    const isMember = await this.groupRepository.isMember(groupId, userId)
    if (!isMember) {
      throw new DomainError('You are not a member of this group')
    }

    // Fetch locations with item counts
    const locationsWithCounts = await this.locationRepository.findByGroupIdWithItemCounts(groupId)

    // Map to DTOs
    const locations: LocationDTO[] = locationsWithCounts.map((lwc) => ({
      id: lwc.location.id.toString(),
      name: lwc.location.name,
      emoji: lwc.location.emoji.toString(),
      itemCount: lwc.itemCount,
    }))

    return { locations }
  }
}
