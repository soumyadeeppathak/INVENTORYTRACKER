'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CreateGroupUseCase } from '@/src/application/use-cases/groups/create-group'
import { InviteMemberUseCase } from '@/src/application/use-cases/groups/invite-member'
import { LeaveGroupUseCase } from '@/src/application/use-cases/groups/leave-group'
import { RemoveMemberUseCase } from '@/src/application/use-cases/groups/remove-member'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { PrismaUserRepository } from '@/src/infrastructure/persistence/repositories/prisma-user-repository'
import { PrismaInviteRepository } from '@/src/infrastructure/persistence/repositories/prisma-invite-repository'
import { createEmailService } from '@/src/infrastructure/services/email-service-factory'
import { DomainError } from '@/src/domain/errors/domain-error'

interface ActionResult {
  success?: boolean
  error?: string
  groupId?: string
}

export async function createGroup(formData: FormData): Promise<ActionResult> {
  try {
    const user = await requireAuth()

    const name = formData.get('name') as string
    const emoji = formData.get('emoji') as string

    if (!name || !emoji) {
      return { error: 'Name and emoji are required' }
    }

    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new CreateGroupUseCase(groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      name: name.trim(),
      emoji,
    })

    revalidatePath('/')
    return { success: true, groupId: result.groupId }
  } catch (error) {
    if (error instanceof DomainError) {
      return { error: error.message }
    }
    console.error('Error creating group:', error)
    return { error: 'Failed to create group. Please try again.' }
  }
}

export async function inviteMember(groupId: string, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requireAuth()

    const email = formData.get('email') as string

    if (!email) {
      return { error: 'Email is required' }
    }

    const groupRepository = new PrismaGroupRepository(db)
    const userRepository = new PrismaUserRepository(db)
    const inviteRepository = new PrismaInviteRepository(db)
    const emailService = createEmailService()

    const useCase = new InviteMemberUseCase(
      groupRepository,
      userRepository,
      inviteRepository,
      emailService,
    )

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    await useCase.execute({
      inviterId: user.id.toString(),
      groupId,
      email: email.trim().toLowerCase(),
      baseUrl,
    })

    revalidatePath(`/groups/${groupId}/settings`)
    return { success: true }
  } catch (error) {
    if (error instanceof DomainError) {
      return { error: error.message }
    }
    console.error('Error inviting member:', error)
    return { error: 'Failed to send invite. Please try again.' }
  }
}

export async function leaveGroup(groupId: string): Promise<ActionResult> {
  try {
    const user = await requireAuth()

    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new LeaveGroupUseCase(groupRepository)

    await useCase.execute({
      userId: user.id.toString(),
      groupId,
    })

    revalidatePath('/')
  } catch (error) {
    if (error instanceof DomainError) {
      return { error: error.message }
    }
    console.error('Error leaving group:', error)
    return { error: 'Failed to leave group. Please try again.' }
  }

  redirect('/')
}

export async function removeMember(groupId: string, targetUserId: string): Promise<ActionResult> {
  try {
    const user = await requireAuth()

    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new RemoveMemberUseCase(groupRepository)

    await useCase.execute({
      requesterId: user.id.toString(),
      groupId,
      targetUserId,
    })

    revalidatePath(`/groups/${groupId}/settings`)
    return { success: true }
  } catch (error) {
    if (error instanceof DomainError) {
      return { error: error.message }
    }
    console.error('Error removing member:', error)
    return { error: 'Failed to remove member. Please try again.' }
  }
}
