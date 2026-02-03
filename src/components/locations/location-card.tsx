import Link from 'next/link'
import { Card } from '@/src/components/ui/card'

interface LocationCardProps {
  id: string
  groupId: string
  name: string
  emoji: string
  itemCount: number
}

export function LocationCard({ id, groupId, name, emoji, itemCount }: LocationCardProps) {
  return (
    <Link href={`/groups/${groupId}/locations/${id}`}>
      <Card interactive className="p-4 h-full">
        <div className="flex flex-col items-center text-center">
          <span className="text-5xl mb-3" role="img" aria-label={name}>
            {emoji}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-500">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export function NewLocationCard({ groupId }: { groupId: string }) {
  return (
    <Link href={`/groups/${groupId}/locations/new`}>
      <Card interactive className="p-4 h-full">
        <div className="flex flex-col items-center justify-center text-center min-h-[140px]">
          <span className="text-4xl mb-3 text-gray-400">➕</span>
          <h3 className="text-lg font-semibold text-gray-600">New Location</h3>
        </div>
      </Card>
    </Link>
  )
}
