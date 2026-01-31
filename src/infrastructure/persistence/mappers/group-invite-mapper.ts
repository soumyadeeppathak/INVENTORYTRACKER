import type { GroupInvite as PrismaGroupInvite } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { GroupInvite } from '@/src/domain/entities/group-invite'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { UserId } from '@/src/domain/value-objects/user-id'

export function groupInviteToDomain(prismaInvite: PrismaGroupInvite): GroupInvite {
  return GroupInvite.reconstitute({
    id: prismaInvite.id,
    token: prismaInvite.token,
    email: prismaInvite.email,
    groupId: GroupId.create(prismaInvite.groupId),
    invitedBy: UserId.create(prismaInvite.invitedBy),
    expiresAt: prismaInvite.expiresAt,
    acceptedAt: prismaInvite.acceptedAt,
    createdAt: prismaInvite.createdAt,
  })
}

export function groupInviteToPrisma(invite: GroupInvite): Prisma.GroupInviteCreateInput {
  return {
    id: invite.id,
    token: invite.token,
    email: invite.email,
    group: {
      connect: { id: invite.groupId.toString() },
    },
    inviter: {
      connect: { id: invite.invitedBy.toString() },
    },
    expiresAt: invite.expiresAt,
    acceptedAt: invite.acceptedAt,
    createdAt: invite.createdAt,
  }
}
