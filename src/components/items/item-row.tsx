'use client'

import { Badge } from '@/src/components/ui/badge'
import { DropdownMenu, DropdownMenuItem } from '@/src/components/ui/dropdown-menu'
import { QuantityControl } from './quantity-control'

interface ItemRowProps {
    id: string
    name: string
    emoji: string
    quantity: number
    category?: {
        id: string
        name: string
        emoji: string
    } | null
    onEdit: (itemId: string) => void
    onMove: (itemId: string) => void
    onDelete: (itemId: string) => void
    onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>
}

export function ItemRow({
    id,
    name,
    emoji,
    quantity,
    category,
    onEdit,
    onMove,
    onDelete,
    onUpdateQuantity,
}: ItemRowProps) {
    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <button
                type="button"
                onClick={() => onEdit(id)}
                className="flex items-center gap-3 flex-1 text-left"
            >
                <span className="text-2xl" role="img" aria-label={name}>
                    {emoji}
                </span>
                <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 truncate">{name}</h4>
                    {category && (
                        <Badge variant="default" className="mt-1">
                            <span role="img" aria-label={category.name} className="mr-1">
                                {category.emoji}
                            </span>
                            {category.name}
                        </Badge>
                    )}
                </div>
            </button>

            <div className="flex items-center gap-2">
                <QuantityControl itemId={id} currentQuantity={quantity} onUpdate={onUpdateQuantity} />

                <DropdownMenu
                    trigger={
                        <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Item menu"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                    }
                >
                    <DropdownMenuItem onClick={() => onEdit(id)}>Edit Item</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMove(id)}>Move to Location</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(id)} variant="danger">
                        Delete Item
                    </DropdownMenuItem>
                </DropdownMenu>
            </div>
        </div>
    )
}
