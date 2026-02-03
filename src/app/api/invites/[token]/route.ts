import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { AcceptInviteUseCase } from '@/src/application/use-cases/groups/accept-invite'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { PrismaUserRepository } from '@/src/infrastructure/persistence/repositories/prisma-user-repository'
import { PrismaInviteRepository } from '@/src/infrastructure/persistence/repositories/prisma-invite-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

/**
 * POST /api/invites/[token] - Accept a group invite
 *
 * If user is authenticated, they are added to the group.
 * If not authenticated, a new user is created from the invite email.
 */
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json({ error: 'Invite token is required' }, { status: 400 })
    }

    // Get current user if authenticated (optional for this route)
    const currentUser = await getCurrentUser()

    const inviteRepository = new PrismaInviteRepository(db)
    const userRepository = new PrismaUserRepository(db)
    const groupRepository = new PrismaGroupRepository(db)

    const useCase = new AcceptInviteUseCase(inviteRepository, userRepository, groupRepository)

    const result = await useCase.execute({
      token,
      userId: currentUser?.id.toString(),
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('Error accepting invite:', error)
    return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 })
  }
}
