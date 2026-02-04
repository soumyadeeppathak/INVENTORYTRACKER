'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/src/components/ui/modal'
import { Button } from '@/src/components/ui/button'

interface Location {
    id: string
    name: string
    emoji: string
}

interface MoveItemModalProps {
    open: boolean
    onClose: () => void
    itemId: string | null
    itemName: string
    currentLocationId: string
    locations: Location[]
    onMove: (itemId: string, targetLocationId: string) => Promise<{ success?: boolean; error?: string }>
}

export function MoveItemModal({
    open,
    onClose,
    itemId,
    itemName,
    currentLocationId,
    locations,
    onMove,
}: MoveItemModalProps) {
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleMove = async () => {
        if (!itemId || !selectedLocationId) return

        setError(null)

        startTransition(async () => {
            const result = await onMove(itemId, selectedLocationId)

            if (result.error) {
                setError(result.error)
            } else if (result.success) {
                setSelectedLocationId(null)
                onClose()
            }
        })
    }

    if (!itemId) return null

    return (
        <Modal open={open} onClose={onClose} title={`Move ${itemName}`}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">Select a section to move this item to:</p>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {locations.map((location) => {
                        const isCurrent = location.id === currentLocationId
                        const isSelected = location.id === selectedLocationId

                        return (
                            <button
                                key={location.id}
                                type="button"
                                onClick={() => !isCurrent && setSelectedLocationId(location.id)}
                                disabled={isCurrent}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${isCurrent
                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                    : isSelected
                                        ? 'border-indigo-600 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-2xl" role="img" aria-label={location.name}>
                                    {location.emoji}
                                </span>
                                <div className="flex-1 text-left">
                                    <h4 className="text-base font-medium text-gray-900">{location.name}</h4>
                                    {isCurrent && <p className="text-xs text-gray-500">Current section</p>}
                                </div>
                                {isSelected && (
                                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        )
                    })}
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-2 pt-2">
                    <Button
                        type="button"
                        variant="primary"
                        className="flex-1"
                        onClick={handleMove}
                        disabled={!selectedLocationId}
                        isLoading={isPending}
                    >
                        Move Item
                    </Button>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
