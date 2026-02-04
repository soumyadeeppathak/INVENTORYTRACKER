'use client'

import { useState, useTransition } from 'react'

interface QuantityControlProps {
    itemId: string
    currentQuantity: number
    onUpdate: (itemId: string, quantity: number) => Promise<void>
}

export function QuantityControl({ itemId, currentQuantity, onUpdate }: QuantityControlProps) {
    const [quantity, setQuantity] = useState(currentQuantity)
    const [isPending, startTransition] = useTransition()

    const handleIncrement = () => {
        const newQuantity = quantity + 1
        setQuantity(newQuantity)
        startTransition(async () => {
            await onUpdate(itemId, newQuantity)
        })
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1
            setQuantity(newQuantity)
            startTransition(async () => {
                await onUpdate(itemId, newQuantity)
            })
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isPending}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
            <span className="text-base font-medium text-gray-900 min-w-[2ch] text-center">
                {quantity}
            </span>
            <button
                type="button"
                onClick={handleIncrement}
                disabled={isPending}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    )
}
