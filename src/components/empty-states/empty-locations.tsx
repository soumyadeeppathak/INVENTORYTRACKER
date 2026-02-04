import { EmptyState } from '@/src/components/ui/empty-state'
import { Button } from '@/src/components/ui/button'

interface EmptyLocationsProps {
    onAddClick?: () => void
}

export function EmptyLocations({ onAddClick }: EmptyLocationsProps) {
    return (
        <EmptyState
            icon="📍"
            title="No sections yet"
            description="Add sections like 'Kitchen', 'Bedroom', or 'Garage' to organize your items."
            action={
                onAddClick ? (
                    <Button variant="primary" onClick={onAddClick}>
                        Add Section
                    </Button>
                ) : undefined
            }
        />
    )
}
