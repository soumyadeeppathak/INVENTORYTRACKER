'use client'

import { updateItemQuantity, createItem, updateItem, moveItem, deleteItem } from '@/src/server/actions/item-actions'
import { ItemList } from '@/src/components/items/item-list'
import { QuickAddForm } from '@/src/components/items/quick-add-form'
import type { ItemDTO } from '@/src/application/dtos/item-dto'

interface Category {
    id: string
    name: string
    emoji: string
}

interface Item {
    id: string
    name: string
    emoji: string
    quantity: number
    categoryId: string | null
    category?: {
        id: string
        name: string
        emoji: string
    } | null
}

interface Location {
    id: string
    name: string
    emoji: string
}

interface ItemsPageClientProps {
    groupId: string
    locationId: string
    items: ItemDTO[]
    categories: Category[]
    locations: Location[]
}

export function ItemsPageClient({ groupId, locationId, items, categories, locations }: ItemsPageClientProps) {
    // Map ItemDTO to Item with categoryId
    const mappedItems: Item[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        emoji: item.emoji,
        quantity: item.quantity,
        categoryId: item.category?.id || null,
        category: item.category,
    }))

    const handleUpdateQuantity = async (itemId: string, quantity: number) => {
        await updateItemQuantity(groupId, locationId, itemId, quantity)
    }

    const handleCreateItem = async (formData: FormData) => {
        return await createItem(groupId, locationId, formData)
    }

    const handleUpdateItem = async (itemId: string, formData: FormData) => {
        return await updateItem(groupId, locationId, itemId, formData)
    }

    const handleMoveItem = async (itemId: string, targetLocationId: string) => {
        return await moveItem(groupId, locationId, itemId, targetLocationId)
    }

    const handleDeleteItem = async (itemId: string) => {
        return await deleteItem(groupId, locationId, itemId)
    }

    return (
        <div className="p-4">
            <ItemList
                items={mappedItems}
                categories={categories}
                locations={locations}
                currentLocationId={locationId}
                onUpdateQuantity={handleUpdateQuantity}
                onUpdateItem={handleUpdateItem}
                onMoveItem={handleMoveItem}
                onDeleteItem={handleDeleteItem}
            />

            <QuickAddForm onSubmit={handleCreateItem} categories={categories} />
        </div>
    )
}
