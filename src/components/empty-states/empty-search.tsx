import { EmptyState } from '@/src/components/ui/empty-state'

interface EmptySearchProps {
    query: string
}

export function EmptySearch({ query }: EmptySearchProps) {
    return (
        <EmptyState
            icon="🔍"
            title="No items found"
            description={`No items match "${query}". Try searching for something else.`}
        />
    )
}
