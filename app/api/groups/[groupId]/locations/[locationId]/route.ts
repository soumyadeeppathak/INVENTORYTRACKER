import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetLocationUseCase } from '@/src/application/use-cases/locations/get-location'
import { UpdateLocationUseCase } from '@/src/application/use-cases/locations/update-location'
import { DeleteLocationUseCase } from '@/src/application/use-cases/locations/delete-location'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

const ParamsSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
  locationId: z.string().min(1, 'Location ID is required'),
})

const UpdateLocationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must not exceed 255 characters'),
  emoji: z.string().min(1, 'Emoji is required'),
})

/**
 * GET /api/groups/[groupId]/locations/[locationId] - Get location details
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

    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new GetLocationUseCase(locationRepository, groupRepository)

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

    console.error('Error fetching location:', error)
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 })
  }
}

/**
 * PUT /api/groups/[groupId]/locations/[locationId] - Update location
 */
export async function PUT(
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
    const parsed = UpdateLocationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new UpdateLocationUseCase(locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      locationId: parsedParams.data.locationId,
      name: parsed.data.name,
      emoji: parsed.data.emoji,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      const status = error.message === 'Location not found' ? 404 : 400
      return NextResponse.json({ error: error.message }, { status })
    }

    console.error('Error updating location:', error)
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}

/**
 * DELETE /api/groups/[groupId]/locations/[locationId] - Delete location
 */
export async function DELETE(
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

    // Check for confirmation query parameter
    const url = new URL(request.url)
    const confirmed = url.searchParams.get('confirmed') === 'true'

    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new DeleteLocationUseCase(locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      locationId: parsedParams.data.locationId,
      confirmed,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      // Check if it's the confirmation error
      if (error.message.includes('Please confirm deletion')) {
        return NextResponse.json(
          { error: error.message, requiresConfirmation: true },
          { status: 409 },
        )
      }
      const status = error.message === 'Location not found' ? 404 : 403
      return NextResponse.json({ error: error.message }, { status })
    }

    console.error('Error deleting location:', error)
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 })
  }
}
