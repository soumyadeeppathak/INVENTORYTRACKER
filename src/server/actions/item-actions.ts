'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CreateItemUseCase } from '@/src/application/use-cases/items/create-item'
import { UpdateItemUseCase } from '@/src/application/use-cases/items/update-item'
import { DeleteItemUseCase } from '@/src/application/use-cases/items/delete-item'
import { MoveItemUseCase } from '@/src/application/use-cases/items/move-item'
import { PrismaItemRepository } from '@/src/infrastructure/persistence/repositories/prisma-item-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

interface ActionResult {
    success?: boolean
    error?: string
    itemId?: string
}

export async function createItem(
    groupId: string,
    locationId: string,
    formData: FormData,
): Promise<ActionResult> {
    try {
        const user = await requireAuth()

        const name = formData.get('name') as string
        const emoji = formData.get('emoji') as string
        const quantity = Number.parseInt(formData.get('quantity') as string, 10) || 1
        const categoryId = (formData.get('categoryId') as string) || undefined

        if (!name || !emoji) {
            return { error: 'Name and emoji are required' }
        }

        const itemRepository = new PrismaItemRepository(db)
        const locationRepository = new PrismaLocationRepository(db)
        const groupRepository = new PrismaGroupRepository(db)
        const useCase = new CreateItemUseCase(itemRepository, locationRepository, groupRepository)

        const result = await useCase.execute({
            userId: user.id.toString(),
            locationId,
            name: name.trim(),
            emoji,
            quantity,
            categoryId,
        })

        revalidatePath(`/groups/${groupId}/locations/${locationId}`)
        return { success: true, itemId: result.itemId }
    } catch (error) {
        if (error instanceof DomainError) {
            return { error: error.message }
        }
        console.error('Error creating item:', error)
        return { error: 'Failed to create item. Please try again.' }
    }
}

export async function updateItem(
    groupId: string,
    locationId: string,
    itemId: string,
    formData: FormData,
): Promise<ActionResult> {
    try {
        const user = await requireAuth()

        const name = formData.get('name') as string
        const emoji = formData.get('emoji') as string
        const quantity = formData.get('quantity') ? Number.parseInt(formData.get('quantity') as string, 10) : undefined
        const categoryId = formData.get('categoryId') as string | null

        const itemRepository = new PrismaItemRepository(db)
        const locationRepository = new PrismaLocationRepository(db)
        const groupRepository = new PrismaGroupRepository(db)
        const useCase = new UpdateItemUseCase(itemRepository, locationRepository, groupRepository)

        await useCase.execute({
            userId: user.id.toString(),
            itemId,
            name: name?.trim(),
            emoji,
            quantity,
            categoryId,
        })

        revalidatePath(`/groups/${groupId}/locations/${locationId}`)
        return { success: true }
    } catch (error) {
        if (error instanceof DomainError) {
            return { error: error.message }
        }
        console.error('Error updating item:', error)
        return { error: 'Failed to update item. Please try again.' }
    }
}

export async function updateItemQuantity(
    groupId: string,
    locationId: string,
    itemId: string,
    quantity: number,
): Promise<ActionResult> {
    try {
        const user = await requireAuth()

        const itemRepository = new PrismaItemRepository(db)
        const locationRepository = new PrismaLocationRepository(db)
        const groupRepository = new PrismaGroupRepository(db)
        const useCase = new UpdateItemUseCase(itemRepository, locationRepository, groupRepository)

        await useCase.execute({
            userId: user.id.toString(),
            itemId,
            quantity,
        })

        revalidatePath(`/groups/${groupId}/locations/${locationId}`)
        return { success: true }
    } catch (error) {
        if (error instanceof DomainError) {
            return { error: error.message }
        }
        console.error('Error updating item quantity:', error)
        return { error: 'Failed to update item quantity. Please try again.' }
    }
}

export async function moveItem(
    sourceGroupId: string,
    sourceLocationId: string,
    itemId: string,
    targetLocationId: string,
): Promise<ActionResult> {
    try {
        const user = await requireAuth()

        const itemRepository = new PrismaItemRepository(db)
        const locationRepository = new PrismaLocationRepository(db)
        const groupRepository = new PrismaGroupRepository(db)
        const useCase = new MoveItemUseCase(itemRepository, locationRepository, groupRepository)

        await useCase.execute({
            userId: user.id.toString(),
            itemId,
            targetLocationId,
        })

        revalidatePath(`/groups/${sourceGroupId}/locations/${sourceLocationId}`)
        revalidatePath(`/groups/${sourceGroupId}/locations/${targetLocationId}`)
        return { success: true }
    } catch (error) {
        if (error instanceof DomainError) {
            return { error: error.message }
        }
        console.error('Error moving item:', error)
        return { error: 'Failed to move item. Please try again.' }
    }
}

export async function deleteItem(
    groupId: string,
    locationId: string,
    itemId: string,
): Promise<ActionResult> {
    try {
        const user = await requireAuth()

        const itemRepository = new PrismaItemRepository(db)
        const locationRepository = new PrismaLocationRepository(db)
        const groupRepository = new PrismaGroupRepository(db)
        const useCase = new DeleteItemUseCase(itemRepository, locationRepository, groupRepository)

        await useCase.execute({
            userId: user.id.toString(),
            itemId,
        })

        revalidatePath(`/groups/${groupId}/locations/${locationId}`)
        return { success: true }
    } catch (error) {
        if (error instanceof DomainError) {
            return { error: error.message }
        }
        console.error('Error deleting item:', error)
        return { error: 'Failed to delete item. Please try again.' }
    }
}
