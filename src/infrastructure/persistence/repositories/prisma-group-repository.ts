import type { PrismaClient } from '@prisma/client'
import type {
  GroupRepository,
  GroupWithCounts,
  GroupMember,
} from '@/src/application/ports/group-repository'
import type { Group } from '@/src/domain/entities/group'
import type { GroupId } from '@/src/domain/value-objects/group-id'
import type { UserId } from '@/src/domain/value-objects/user-id'
import { groupToDomain, groupToPrisma } from '../mappers/group-mapper'

export class PrismaGroupRepository implements GroupRepository {
  constructor(private prisma: PrismaClient) {}

  async save(group: Group): Promise<void> {
    const data = groupToPrisma(group)
    await this.prisma.group.upsert({
      where: { id: group.id.toString() },
      update: {
        name: data.name,
        emoji: data.emoji,
      },
      create: data,
    })
  }

  async findById(id: GroupId): Promise<Group | null> {
    const group = await this.prisma.group.findUnique({
      where: { id: id.toString() },
    })
    return group ? groupToDomain(group) : null
  }

  async findByUserId(userId: UserId): Promise<Group[]> {
    const groups = await this.prisma.group.findMany({
      where: {
        memberships: {
          some: {
            userId: userId.toString(),
          },
        },
      },
    })
    return groups.map((group) => groupToDomain(group))
  }

  async findByUserIdWithCounts(userId: UserId): Promise<GroupWithCounts[]> {
    const userIdStr = userId.toString()

    const groups = await this.prisma.group.findMany({
      where: {
        memberships: {
          some: {
            userId: userIdStr,
          },
        },
      },
      include: {
        memberships: {
          where: { userId: userIdStr },
          select: { role: true },
        },
        locations: {
          include: {
            _count: {
              select: { items: true },
            },
          },
        },
        _count: {
          select: { memberships: true },
        },
      },
    })

    return groups.map((group) => {
      const itemCount = group.locations.reduce((sum, loc) => sum + loc._count.items, 0)

      return {
        group: groupToDomain(group),
        locationCount: group.locations.length,
        itemCount,
        memberCount: group._count.memberships,
        role: group.memberships[0]?.role ?? 'MEMBER',
      }
    })
  }

  async delete(id: GroupId): Promise<void> {
    await this.prisma.group.delete({
      where: { id: id.toString() },
    })
  }

  async addMember(groupId: GroupId, userId: UserId, role: 'OWNER' | 'MEMBER'): Promise<void> {
    await this.prisma.groupMembership.create({
      data: {
        groupId: groupId.toString(),
        userId: userId.toString(),
        role,
      },
    })
  }

  async removeMember(groupId: GroupId, userId: UserId): Promise<void> {
    await this.prisma.groupMembership.delete({
      where: {
        userId_groupId: {
          userId: userId.toString(),
          groupId: groupId.toString(),
        },
      },
    })
  }

  async getMemberCount(groupId: GroupId): Promise<number> {
    return await this.prisma.groupMembership.count({
      where: { groupId: groupId.toString() },
    })
  }

  async isMember(groupId: GroupId, userId: UserId): Promise<boolean> {
    const membership = await this.prisma.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId: userId.toString(),
          groupId: groupId.toString(),
        },
      },
    })
    return membership !== null
  }

  async getMembers(groupId: GroupId): Promise<GroupMember[]> {
    const memberships = await this.prisma.groupMembership.findMany({
      where: { groupId: groupId.toString() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    })

    return memberships.map((m) => ({
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      joinedAt: m.joinedAt,
    }))
  }

  async getMemberRole(groupId: GroupId, userId: UserId): Promise<'OWNER' | 'MEMBER' | null> {
    const membership = await this.prisma.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId: userId.toString(),
          groupId: groupId.toString(),
        },
      },
      select: { role: true },
    })
    return membership?.role ?? null
  }
}
