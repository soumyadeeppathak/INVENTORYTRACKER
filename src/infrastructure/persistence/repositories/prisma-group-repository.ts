import type { PrismaClient } from '@prisma/client'
import type { GroupRepository } from '@/src/application/ports/group-repository'
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
}
