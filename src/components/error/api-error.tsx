'use client'

import { Button } from '@/src/components/ui/button'

interface APIErrorProps {
    message?: string
    onRetry?: () => void
}

export function APIError({ message = 'Failed to load data', onRetry }: APIErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <span className="text-4xl mb-3" role="img" aria-hidden="true">
                ⚠️
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Error Loading Data</h3>
            <p className="text-sm text-gray-500 mb-4">{message}</p>
            {onRetry && (
                <Button variant="secondary" onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </div>
    )
}
