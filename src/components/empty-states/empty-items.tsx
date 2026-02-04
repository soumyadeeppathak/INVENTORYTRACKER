import { EmptyState } from '@/src/components/ui/empty-state'

export function EmptyItems() {
    return (
        <EmptyState
            icon="📦"
            title="No items here yet"
            description="Use the form below to add items you want to track in this section."
        />
    )
}
