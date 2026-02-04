'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/src/components/ui/modal'
import { EmojiPicker } from '@/src/components/ui/emoji-picker'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'

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
}

interface EditItemModalProps {
    open: boolean
    onClose: () => void
    item: Item | null
    categories: Category[]
    onUpdate: (itemId: string, formData: FormData) => Promise<{ success?: boolean; error?: string }>
    onDelete: (itemId: string) => Promise<{ success?: boolean; error?: string }>
}

export function EditItemModal({ open, onClose, item, categories, onUpdate, onDelete }: EditItemModalProps) {
    const [emoji, setEmoji] = useState(item?.emoji || '📦')
    const [name, setName] = useState(item?.name || '')
    const [quantity, setQuantity] = useState(item?.quantity.toString() || '1')
    const [categoryId, setCategoryId] = useState(item?.categoryId || '')
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    // Update form when item changes
    useState(() => {
        if (item) {
            setEmoji(item.emoji)
            setName(item.name)
            setQuantity(item.quantity.toString())
            setCategoryId(item.categoryId || '')
            setError(null)
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!item) return

        setError(null)

        const formData = new FormData()
        formData.append('emoji', emoji)
        formData.append('name', name)
        formData.append('quantity', quantity)
        if (categoryId) {
            formData.append('categoryId', categoryId)
        } else {
            formData.append('categoryId', '')
        }

        startTransition(async () => {
            const result = await onUpdate(item.id, formData)

            if (result.error) {
                setError(result.error)
            } else if (result.success) {
                onClose()
            }
        })
    }

    const handleDelete = async () => {
        if (!item || !confirm('Are you sure you want to delete this item?')) return

        startTransition(async () => {
            const result = await onDelete(item.id)

            if (result.error) {
                setError(result.error)
            } else if (result.success) {
                onClose()
            }
        })
    }

    if (!item) return null

    return (
        <Modal open={open} onClose={onClose} title="Edit Item">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                    <EmojiPicker value={emoji} onChange={setEmoji} />
                    <Input
                        type="text"
                        placeholder="Item name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="flex-1"
                    />
                </div>

                <div>
                    <label htmlFor="edit-quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                    </label>
                    <Input
                        id="edit-quantity"
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        id="edit-category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">No category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.emoji} {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex flex-col gap-2 pt-2">
                    <Button type="submit" variant="primary" className="w-full" isLoading={isPending}>
                        Save Changes
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        className="w-full"
                        onClick={handleDelete}
                        isLoading={isPending}
                    >
                        Delete Item
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
