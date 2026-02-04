import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { InviteMemberUseCase } from '@/src/application/use-cases/groups/invite-member'
import { GetGroupUseCase } from '@/src/application/use-cases/groups/get-group'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { PrismaUserRepository } from '@/src/infrastructure/persistence/repositories/prisma-user-repository'
import { PrismaInviteRepository } from '@/src/infrastructure/persistence/repositories/prisma-invite-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { createEmailService } from '@/src/infrastructure/services/email-service-factory'
import { DomainError } from '@/src/domain/errors/domain-error'

const InviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
})

/**
 * GET /api/groups/[groupId]/members - List group members
 */
export async function GET(request: Request, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    const user = await requireAuth()
    const { groupId } = await params

    if (!groupId) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })
    }

    const groupRepository = new PrismaGroupRepository(db)
    const locationRepository = new PrismaLocationRepository(db)
    const useCase = new GetGroupUseCase(groupRepository, locationRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      groupId,
    })

    return NextResponse.json({ members: result.group.members })
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

/**
 * POST /api/groups/[groupId]/members - Invite a member
 */
export async function POST(request: Request, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    const user = await requireAuth()
    const { groupId } = await params

    if (!groupId) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = InviteMemberSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
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

    const result = await useCase.execute({
      inviterId: user.id.toString(),
      groupId,
      email: parsed.data.email,
      baseUrl,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    console.error('Error inviting member:', error)
    return NextResponse.json({ error: 'Failed to invite member' }, { status: 500 })
  }
}
