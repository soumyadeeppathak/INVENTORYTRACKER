import { DomainError } from '@/src/domain/errors/domain-error'
import { User } from '@/src/domain/entities/user'
import { Email } from '@/src/domain/value-objects/email'
import { UserId } from '@/src/domain/value-objects/user-id'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import type { UserRepository } from '@/src/application/ports/user-repository'
import type { InviteRepository } from '@/src/application/ports/invite-repository'

export interface AcceptInviteInput {
  token: string
  userId?: string
}

export interface AcceptInviteOutput {
  groupId: string
  userId: string
}

export class AcceptInviteUseCase {
  constructor(
    private readonly inviteRepository: InviteRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(input: AcceptInviteInput): Promise<AcceptInviteOutput> {
    // Find invite by token
    const invite = await this.inviteRepository.findByToken(input.token)
    if (!invite) {
      throw new DomainError('Invalid invite token')
    }

    // Validate invite is valid (not expired, not accepted)
    if (invite.isExpired) {
      throw new DomainError('This invite has expired')
    }

    if (invite.isAccepted) {
      throw new DomainError('This invite has already been used')
    }

    let user: User | null = null

    // If userId provided, use that user
    if (input.userId) {
      const userId = UserId.create(input.userId)
      user = await this.userRepository.findById(userId)
      if (!user) {
        throw new DomainError('User not found')
      }
    } else {
      // Check if user exists by invite email
      const email = Email.create(invite.email)
      user = await this.userRepository.findByEmail(email)

      // If no user exists, create one
      if (!user) {
        // Extract name from email (part before @) as default name
        const defaultName = invite.email.split('@')[0]
        user = User.create({
          email,
          name: defaultName,
        })
        await this.userRepository.save(user)
      }
    }

    // Check if user is already a member
    const isMember = await this.groupRepository.isMember(invite.groupId, user.id)
    if (isMember) {
      throw new DomainError('You are already a member of this group')
    }

    // Add user to group as member
    await this.groupRepository.addMember(invite.groupId, user.id, 'MEMBER')

    // Mark invite as accepted
    await this.inviteRepository.markAccepted(invite.token)

    return {
      groupId: invite.groupId.toString(),
      userId: user.id.toString(),
    }
  }
}
