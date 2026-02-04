'use client'

import { useState } from 'react'
import { EmptyState } from '@/src/components/ui/empty-state'
import { CategoryFilter } from './category-filter'
import { ItemRow } from './item-row'
import { EditItemModal } from './edit-item-modal'
import { MoveItemModal } from './move-item-modal'

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

interface ItemListProps {
    items: Item[]
    categories: Category[]
    locations: Location[]
    currentLocationId: string
    onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>
    onUpdateItem: (itemId: string, formData: FormData) => Promise<{ success?: boolean; error?: string }>
    onMoveItem: (itemId: string, targetLocationId: string) => Promise<{ success?: boolean; error?: string }>
    onDeleteItem: (itemId: string) => Promise<{ success?: boolean; error?: string }>
}

export function ItemList({
    items,
    categories,
    locations,
    currentLocationId,
    onUpdateQuantity,
    onUpdateItem,
    onMoveItem,
    onDeleteItem,
}: ItemListProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [editingItem, setEditingItem] = useState<Item | null>(null)
    const [movingItemId, setMovingItemId] = useState<string | null>(null)

    const filteredItems = selectedCategoryId
        ? items.filter((item) => item.categoryId === selectedCategoryId)
        : items

    const movingItem = movingItemId ? items.find((item) => item.id === movingItemId) : null

    const handleDelete = async (itemId: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return
        return onDeleteItem(itemId)
    }

    if (items.length === 0) {
        return (
            <EmptyState
                icon="📦"
                title="No items yet"
                description="Add your first item to this location using the button below."
            />
        )
    }

    return (
        <>
            <div className="space-y-4 pb-32">
                {categories.length > 0 && (
                    <CategoryFilter
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                    />
                )}

                {filteredItems.length === 0 ? (
                    <EmptyState
                        icon="🔍"
                        title="No items in this category"
                        description="Try selecting a different category."
                    />
                ) : (
                    <div className="space-y-2">
                        {filteredItems.map((item) => (
                            <ItemRow
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                emoji={item.emoji}
                                quantity={item.quantity}
                                category={item.category}
                                onEdit={(itemId) => setEditingItem(items.find((i) => i.id === itemId) || null)}
                                onMove={(itemId) => setMovingItemId(itemId)}
                                onDelete={handleDelete}
                                onUpdateQuantity={onUpdateQuantity}
                            />
                        ))}
                    </div>
                )}
            </div>

            <EditItemModal
                open={editingItem !== null}
                onClose={() => setEditingItem(null)}
                item={editingItem}
                categories={categories}
                onUpdate={onUpdateItem}
                onDelete={onDeleteItem}
            />

            <MoveItemModal
                open={movingItemId !== null}
                onClose={() => setMovingItemId(null)}
                itemId={movingItemId}
                itemName={movingItem?.name || ''}
                currentLocationId={currentLocationId}
                locations={locations}
                onMove={onMoveItem}
            />
        </>
    )
}
