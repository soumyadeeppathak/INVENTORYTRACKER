'use client'

import { useState, useTransition } from 'react'
import { EmojiPicker } from '@/src/components/ui/emoji-picker'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'

interface Category {
    id: string
    name: string
    emoji: string
}

interface QuickAddFormProps {
    onSubmit: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
    categories: Category[]
}

export function QuickAddForm({ onSubmit, categories }: QuickAddFormProps) {
    const [emoji, setEmoji] = useState('📦')
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('1')
    const [categoryId, setCategoryId] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const formData = new FormData()
        formData.append('emoji', emoji)
        formData.append('name', name)
        formData.append('quantity', quantity)
        if (categoryId) {
            formData.append('categoryId', categoryId)
        }

        startTransition(async () => {
            const result = await onSubmit(formData)

            if (result.error) {
                setError(result.error)
            } else if (result.success) {
                // Reset form
                setName('')
                setQuantity('1')
                setCategoryId('')
                setIsExpanded(false)
            }
        })
    }

    return (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <form onSubmit={handleSubmit} className="p-4">
                <div className={`space-y-3 ${isExpanded ? '' : 'flex items-center gap-2'}`}>
                    {isExpanded ? (
                        <>
                            <div className="flex items-center gap-2">
                                <EmojiPicker value={emoji} onChange={setEmoji} />
                                <Input
                                    type="text"
                                    placeholder="Item name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="flex-1"
                                    autoFocus
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    placeholder="Qty"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="1"
                                    required
                                    className="w-20"
                                />
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

                            <div className="flex gap-2">
                                <Button type="submit" variant="primary" className="flex-1" isLoading={isPending}>
                                    Add Item
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsExpanded(false)
                                        setError(null)
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(true)}
                            className="w-full flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="font-medium">Add Item</span>
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
