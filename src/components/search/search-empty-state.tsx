'use client'

import { EmptyState } from '@/src/components/ui/empty-state'

interface SearchEmptyStateProps {
    query: string
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
    return (
        <EmptyState
            icon="🔍"
            title="No items found"
            description={`No items match "${query}". Try different search terms.`}
        />
    )
}
