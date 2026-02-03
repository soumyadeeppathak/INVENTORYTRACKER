import { GroupCard, NewGroupCard } from './group-card'
import { EmptyState } from '@/src/components/ui/empty-state'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

interface Group {
  id: string
  name: string
  emoji: string
  locationCount: number
  itemCount: number
}

interface GroupListProps {
  groups: Group[]
}

export function GroupList({ groups }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <EmptyState
        icon="👋"
        title="Welcome!"
        description="Create your first group to start tracking your belongings."
        action={
          <Link href="/groups/new">
            <Button>Create First Group</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          id={group.id}
          name={group.name}
          emoji={group.emoji}
          locationCount={group.locationCount}
          itemCount={group.itemCount}
        />
      ))}
      <NewGroupCard />
    </div>
  )
}
