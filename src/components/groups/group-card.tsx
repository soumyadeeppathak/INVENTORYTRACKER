import Link from 'next/link'
import { Card } from '@/src/components/ui/card'

interface GroupCardProps {
  id: string
  name: string
  emoji: string
  locationCount: number
  itemCount: number
}

export function GroupCard({ id, name, emoji, locationCount, itemCount }: GroupCardProps) {
  return (
    <Link href={`/groups/${id}`}>
      <Card interactive className="p-4 h-full">
        <div className="flex flex-col items-center text-center">
          <span className="text-5xl mb-3" role="img" aria-label={name}>
            {emoji}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-500">
            {locationCount} {locationCount === 1 ? 'location' : 'locations'} • {itemCount}{' '}
            {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export function NewGroupCard() {
  return (
    <Link href="/groups/new">
      <Card interactive className="p-4 h-full">
        <div className="flex flex-col items-center justify-center text-center min-h-[140px]">
          <span className="text-4xl mb-3 text-gray-400">➕</span>
          <h3 className="text-lg font-semibold text-gray-600">New Group</h3>
        </div>
      </Card>
    </Link>
  )
}
