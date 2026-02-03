import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { UpdateItemUseCase } from '@/src/application/use-cases/items/update-item'
import { DeleteItemUseCase } from '@/src/application/use-cases/items/delete-item'
import { PrismaItemRepository } from '@/src/infrastructure/persistence/repositories/prisma-item-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

const ParamsSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
  locationId: z.string().min(1, 'Location ID is required'),
  itemId: z.string().min(1, 'Item ID is required'),
})

const UpdateItemSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  emoji: z.string().min(1).optional(),
  quantity: z.number().int().min(1).optional(),
  categoryId: z.string().nullable().optional(),
})

/**
 * PUT /api/groups/[groupId]/locations/[locationId]/items/[itemId] - Update item
 */
export async function PUT(
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
    const parsed = UpdateItemSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const itemRepository = new PrismaItemRepository(db)
    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new UpdateItemUseCase(itemRepository, locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      itemId: parsedParams.data.itemId,
      name: parsed.data.name,
      emoji: parsed.data.emoji,
      quantity: parsed.data.quantity,
      categoryId: parsed.data.categoryId,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      const status = error.message === 'Item not found' ? 404 : 400
      return NextResponse.json({ error: error.message }, { status })
    }

    console.error('Error updating item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

/**
 * DELETE /api/groups/[groupId]/locations/[locationId]/items/[itemId] - Delete item
 */
export async function DELETE(
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

    const itemRepository = new PrismaItemRepository(db)
    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new DeleteItemUseCase(itemRepository, locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      itemId: parsedParams.data.itemId,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      const status = error.message === 'Item not found' ? 404 : 403
      return NextResponse.json({ error: error.message }, { status })
    }

    console.error('Error deleting item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
