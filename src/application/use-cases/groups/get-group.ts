import { DomainError } from '@/src/domain/errors/domain-error'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupDetailDTO, LocationDTO, MemberDTO } from '@/src/application/dtos/group-dto'

export interface GetGroupInput {
  userId: string
  groupId: string
}

export interface GetGroupOutput {
  group: GroupDetailDTO
}

export class GetGroupUseCase {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly locationRepository: LocationRepository,
  ) {}

  async execute(input: GetGroupInput): Promise<GetGroupOutput> {
    const userId = UserId.create(input.userId)
    const groupId = GroupId.create(input.groupId)

    // Verify user is a member and get their role
    const role = await this.groupRepository.getMemberRole(groupId, userId)
    if (role === null) {
      throw new DomainError('You are not a member of this group')
    }

    // Get group
    const group = await this.groupRepository.findById(groupId)
    if (!group) {
      throw new DomainError('Group not found')
    }

    // Get locations with item counts
    const locationsWithCounts = await this.locationRepository.findByGroupIdWithItemCounts(groupId)
    const locations: LocationDTO[] = locationsWithCounts.map((lwc) => ({
      id: lwc.location.id.toString(),
      name: lwc.location.name,
      emoji: lwc.location.emoji.toString(),
      itemCount: lwc.itemCount,
    }))

    // Get members
    const groupMembers = await this.groupRepository.getMembers(groupId)
    const members: MemberDTO[] = groupMembers.map((m) => ({
      id: m.userId,
      name: m.name,
      email: m.email,
      role: m.role === 'OWNER' ? 'owner' : 'member',
      joinedAt: m.joinedAt,
    }))

    // Calculate totals
    const itemCount = locations.reduce((sum, loc) => sum + loc.itemCount, 0)

    const groupDetail: GroupDetailDTO = {
      id: group.id.toString(),
      name: group.name,
      emoji: group.emoji.toString(),
      locationCount: locations.length,
      itemCount,
      memberCount: members.length,
      role: role === 'OWNER' ? 'owner' : 'member',
      locations,
      members,
    }

    return { group: groupDetail }
  }
}
