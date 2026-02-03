import { DomainError } from '@/src/domain/errors/domain-error'
import { GroupInvite } from '@/src/domain/entities/group-invite'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { UserId } from '@/src/domain/value-objects/user-id'
import { Email } from '@/src/domain/value-objects/email'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import type { UserRepository } from '@/src/application/ports/user-repository'
import type { InviteRepository } from '@/src/application/ports/invite-repository'
import type { EmailService } from '@/src/application/ports/email-service'

export interface InviteMemberInput {
  inviterId: string
  groupId: string
  email: string
  baseUrl: string
}

export interface InviteMemberOutput {
  success: boolean
}

export class InviteMemberUseCase {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly inviteRepository: InviteRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: InviteMemberInput): Promise<InviteMemberOutput> {
    const inviterId = UserId.create(input.inviterId)
    const groupId = GroupId.create(input.groupId)
    const email = Email.create(input.email)

    // Verify inviter is a member of the group
    const isMember = await this.groupRepository.isMember(groupId, inviterId)
    if (!isMember) {
      throw new DomainError('You are not a member of this group')
    }

    // Get inviter and group for email
    const inviter = await this.userRepository.findById(inviterId)
    if (!inviter) {
      throw new DomainError('Inviter not found')
    }

    const group = await this.groupRepository.findById(groupId)
    if (!group) {
      throw new DomainError('Group not found')
    }

    // Check for existing invite
    const existingInvite = await this.inviteRepository.findByGroupAndEmail(
      groupId,
      email.toString(),
    )

    let invite: GroupInvite
    if (existingInvite && !existingInvite.isAccepted) {
      // Update existing invite with new token and expiry
      invite = GroupInvite.create({
        email: email.toString(),
        groupId,
        invitedBy: inviterId,
        expiresInDays: 7,
      })
    } else {
      // Create new invite
      invite = GroupInvite.create({
        email: email.toString(),
        groupId,
        invitedBy: inviterId,
        expiresInDays: 7,
      })
    }

    // Save invite
    await this.inviteRepository.save(invite)

    // Construct invite URL
    const inviteUrl = `${input.baseUrl}/invite/${invite.token}`

    // Send invite email (don't await to avoid timing attacks)
    this.emailService
      .sendGroupInvite(email.toString(), inviter.name, group.name, inviteUrl)
      .catch((error) => {
        console.error('Failed to send group invite email:', error)
      })

    return { success: true }
  }
}
