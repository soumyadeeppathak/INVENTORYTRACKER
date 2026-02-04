import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { MoveItemUseCase } from '@/src/application/use-cases/items/move-item'
import { PrismaItemRepository } from '@/src/infrastructure/persistence/repositories/prisma-item-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

const ParamsSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
  locationId: z.string().min(1, 'Location ID is required'),
  itemId: z.string().min(1, 'Item ID is required'),
})

const MoveItemSchema = z.object({
  targetLocationId: z.string().min(1, 'Target location ID is required'),
})

/**
 * POST /api/groups/[groupId]/locations/[locationId]/items/[itemId]/move - Move item to different location
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string; locationId: string; itemId: string }> },
) {
  try {
    const user = await requireAuth()

    const resolvedParams = await params
    const parsedParams = ParamsSchema.safeParse(resolvedParams)

    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = MoveItemSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const itemRepository = new PrismaItemRepository(db)
    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new MoveItemUseCase(itemRepository, locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      itemId: parsedParams.data.itemId,
      targetLocationId: parsed.data.targetLocationId,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      const status = error.message.includes('not found') ? 404 : 400
      return NextResponse.json({ error: error.message }, { status })
    }

    console.error('Error moving item:', error)
    return NextResponse.json({ error: 'Failed to move item' }, { status: 500 })
  }
}
