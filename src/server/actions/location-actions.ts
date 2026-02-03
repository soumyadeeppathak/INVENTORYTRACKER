'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CreateLocationUseCase } from '@/src/application/use-cases/locations/create-location'
import { UpdateLocationUseCase } from '@/src/application/use-cases/locations/update-location'
import { DeleteLocationUseCase } from '@/src/application/use-cases/locations/delete-location'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

interface ActionResult {
  success?: boolean
  error?: string
  locationId?: string
  requiresConfirmation?: boolean
  itemCount?: number
}

export async function createLocation(groupId: string, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requireAuth()

    const name = formData.get('name') as string
    const emoji = formData.get('emoji') as string

    if (!name || !emoji) {
      return { error: 'Name and emoji are required' }
    }

    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new CreateLocationUseCase(locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      groupId,
      name: name.trim(),
      emoji,
    })

    revalidatePath(`/groups/${groupId}`)
    return { success: true, locationId: result.locationId }
  } catch (error) {
    if (error instanceof DomainError) {
      return { error: error.message }
    }
    console.error('Error creating location:', error)
    return { error: 'Failed to create location. Please try again.' }
  }
}

export async function updateLocation(
  groupId: string,
  locationId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const user = await requireAuth()

    const name = formData.get('name') as string
    const emoji = formData.get('emoji') as string

    if (!name || !emoji) {
      return { error: 'Name and emoji are required' }
    }

    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new UpdateLocationUseCase(locationRepository, groupRepository)

    await useCase.execute({
      userId: user.id.toString(),
      locationId,
      name: name.trim(),
      emoji,
    })

    revalidatePath(`/groups/${groupId}`)
    revalidatePath(`/groups/${groupId}/locations/${locationId}`)
    return { success: true }
  } catch (error) {
    if (error instanceof DomainError) {
      return { error: error.message }
    }
    console.error('Error updating location:', error)
    return { error: 'Failed to update location. Please try again.' }
  }
}

export async function deleteLocation(
  groupId: string,
  locationId: string,
  confirmed = false,
): Promise<ActionResult> {
  try {
    const user = await requireAuth()

    const locationRepository = new PrismaLocationRepository(db)
    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new DeleteLocationUseCase(locationRepository, groupRepository)

    const result = await useCase.execute({
      userId: user.id.toString(),
      locationId,
      confirmed,
    })

    revalidatePath(`/groups/${groupId}`)
    return { success: true, itemCount: result.itemsDeleted }
  } catch (error) {
    if (error instanceof DomainError) {
      // Check if it's asking for confirmation
      if (error.message.includes('Please confirm deletion')) {
        // Extract item count from message
        const match = error.message.match(/contains (\d+) item/)
        const itemCount = match ? Number.parseInt(match[1], 10) : 0
        return { requiresConfirmation: true, itemCount, error: error.message }
      }
      return { error: error.message }
    }
    console.error('Error deleting location:', error)
    return { error: 'Failed to delete location. Please try again.' }
  }
}
