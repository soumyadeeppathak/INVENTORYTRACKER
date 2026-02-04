import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CreateGroupUseCase } from '@/src/application/use-cases/groups/create-group'
import { GetUserGroupsUseCase } from '@/src/application/use-cases/groups/get-user-groups'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

const CreateGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must not exceed 255 characters'),
  emoji: z.string().min(1, 'Emoji is required'),
})

/**
 * GET /api/groups - List all groups for the authenticated user
 */
export async function GET() {
  try {
    const user = await requireAuth()

    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new GetUserGroupsUseCase(groupRepository)

    const result = await useCase.execute({ userId: user.id.toString() })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
  }
}

/**
 * POST /api/groups - Create a new group
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const parsed = CreateGroupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new CreateGroupUseCase(groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      name: parsed.data.name,
      emoji: parsed.data.emoji,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }
}
