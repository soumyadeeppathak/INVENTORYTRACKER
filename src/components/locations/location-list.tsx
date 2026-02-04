import Link from 'next/link'
import { LocationCard, NewLocationCard } from './location-card'
import { EmptyState } from '@/src/components/ui/empty-state'
import { Button } from '@/src/components/ui/button'
import type { LocationDTO } from '@/src/application/dtos/group-dto'

interface LocationListProps {
  groupId: string
  locations: LocationDTO[]
}

export function LocationList({ groupId, locations }: LocationListProps) {
  if (locations.length === 0) {
    return (
      <EmptyState
        icon="📍"
        title="No sections yet"
        description="Add your first section to start tracking items."
        action={
          <Link href={`/groups/${groupId}/locations/new`}>
            <Button>Add Section</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          id={location.id}
          groupId={groupId}
          name={location.name}
          emoji={location.emoji}
          itemCount={location.itemCount}
        />
      ))}
      <NewLocationCard groupId={groupId} />
    </div>
  )
}
