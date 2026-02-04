import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CreateLocationUseCase } from '@/src/application/use-cases/locations/create-location'
import { GetGroupLocationsUseCase } from '@/src/application/use-cases/locations/get-group-locations'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

const ParamsSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
})

const CreateLocationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must not exceed 255 characters'),
  emoji: z.string().min(1, 'Emoji is required'),
})

/**
 * GET /api/groups/[groupId]/locations - List all locations in a group
 */
export async function GET(
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

    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new GetGroupLocationsUseCase(locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      groupId: parsed.data.groupId,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    console.error('Error fetching locations:', error)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

/**
 * POST /api/groups/[groupId]/locations - Create a new location
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  try {
    const user = await requireAuth()

    const resolvedParams = await params
    const parsedParams = ParamsSchema.safeParse(resolvedParams)

    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid group ID' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = CreateLocationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new CreateLocationUseCase(locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      groupId: parsedParams.data.groupId,
      name: parsed.data.name,
      emoji: parsed.data.emoji,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('Error creating location:', error)
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}
