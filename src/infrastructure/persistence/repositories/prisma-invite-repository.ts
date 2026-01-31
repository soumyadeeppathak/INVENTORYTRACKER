import type { PrismaClient } from '@prisma/client'
import type { InviteRepository } from '@/src/application/ports/invite-repository'
import type { GroupInvite } from '@/src/domain/entities/group-invite'
import type { GroupId } from '@/src/domain/value-objects/group-id'
import { groupInviteToDomain, groupInviteToPrisma } from '../mappers/group-invite-mapper'

export class PrismaInviteRepository implements InviteRepository {
  constructor(private prisma: PrismaClient) {}

  async save(invite: GroupInvite): Promise<void> {
    const data = groupInviteToPrisma(invite)
    await this.prisma.groupInvite.upsert({
      where: { id: invite.id },
      update: {
        acceptedAt: data.acceptedAt,
        expiresAt: data.expiresAt,
      },
      create: data,
    })
  }

  async findByToken(token: string): Promise<GroupInvite | null> {
    const invite = await this.prisma.groupInvite.findUnique({
      where: { token },
    })
    return invite ? groupInviteToDomain(invite) : null
  }

  async findByGroupAndEmail(groupId: GroupId, email: string): Promise<GroupInvite | null> {
    const invite = await this.prisma.groupInvite.findUnique({
      where: {
        groupId_email: {
          groupId: groupId.toString(),
          email,
        },
      },
    })
    return invite ? groupInviteToDomain(invite) : null
  }

  async markAccepted(token: string): Promise<void> {
    await this.prisma.groupInvite.update({
      where: { token },
      data: { acceptedAt: new Date() },
    })
  }
}
