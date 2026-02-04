import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CreateItemUseCase } from '@/src/application/use-cases/items/create-item'
import { GetLocationItemsUseCase } from '@/src/application/use-cases/items/get-location-items'
import { PrismaItemRepository } from '@/src/infrastructure/persistence/repositories/prisma-item-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

const ParamsSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
  locationId: z.string().min(1, 'Location ID is required'),
})

const CreateItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must not exceed 255 characters'),
  emoji: z.string().min(1, 'Emoji is required'),
  quantity: z.number().int().min(1).optional().default(1),
  categoryId: z.string().optional(),
})

/**
 * GET /api/groups/[groupId]/locations/[locationId]/items - List all items in a location
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ groupId: string; locationId: string }> },
) {
  try {
    const user = await requireAuth()

    const resolvedParams = await params
    const parsed = ParamsSchema.safeParse(resolvedParams)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const itemRepository = new PrismaItemRepository(db)
    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new GetLocationItemsUseCase(itemRepository, locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      locationId: parsed.data.locationId,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      const status = error.message === 'Location not found' ? 404 : 403
      return NextResponse.json({ error: error.message }, { status })
    }

    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

/**
 * POST /api/groups/[groupId]/locations/[locationId]/items - Create a new item
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string; locationId: string }> },
) {
  try {
    const user = await requireAuth()

    const resolvedParams = await params
    const parsedParams = ParamsSchema.safeParse(resolvedParams)

    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = CreateItemSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const itemRepository = new PrismaItemRepository(db)
    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new CreateItemUseCase(itemRepository, locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      locationId: parsedParams.data.locationId,
      name: parsed.data.name,
      emoji: parsed.data.emoji,
      quantity: parsed.data.quantity,
      categoryId: parsed.data.categoryId,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('Error creating item:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
