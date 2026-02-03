import { LocationId } from '@/src/domain/value-objects/location-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'

export interface DeleteLocationInput {
  userId: string
  locationId: string
  confirmed: boolean
}

export interface DeleteLocationOutput {
  success: true
  itemsDeleted: number
}

export class DeleteLocationUseCase {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: DeleteLocationInput): Promise<DeleteLocationOutput> {
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

    // Check item count
    const itemCount = await this.locationRepository.getItemCount(locationId)

    // If items exist and not confirmed, return error with count
    if (itemCount > 0 && !input.confirmed) {
      throw new DomainError(
        `This location contains ${itemCount} item${itemCount === 1 ? '' : 's'}. Please confirm deletion.`,
      )
    }

    // Delete location (Prisma cascade will delete items)
    await this.locationRepository.delete(locationId)

    return { success: true, itemsDeleted: itemCount }
  }
}
