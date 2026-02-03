import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetGroupUseCase } from '@/src/application/use-cases/groups/get-group'
import { LeaveGroupUseCase } from '@/src/application/use-cases/groups/leave-group'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

const ParamsSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
})

/**
 * GET /api/groups/[groupId] - Get group details
 */
export async function GET(request: Request, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    const user = await requireAuth()

    const resolvedParams = await params
    const parsed = ParamsSchema.safeParse(resolvedParams)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid group ID' }, { status: 400 })
    }

    const groupRepository = new PrismaGroupRepository(db)
    const locationRepository = new PrismaLocationRepository(db)
    const useCase = new GetGroupUseCase(groupRepository, locationRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      groupId: parsed.data.groupId,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    console.error('Error fetching group:', error)
    return NextResponse.json({ error: 'Failed to fetch group' }, { status: 500 })
  }
}

/**
 * DELETE /api/groups/[groupId] - Leave a group
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  try {
    const user = await requireAuth()

    const resolvedParams = await params
    const parsed = ParamsSchema.safeParse(resolvedParams)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid group ID' }, { status: 400 })
    }

    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new LeaveGroupUseCase(groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      groupId: parsed.data.groupId,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    console.error('Error leaving group:', error)
    return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 })
  }
}
