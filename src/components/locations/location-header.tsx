import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'

interface LocationHeaderProps {
  groupId: string
  groupName: string
  groupEmoji: string
  locationId: string
  locationName: string
  locationEmoji: string
  itemCount: number
}

export function LocationHeader({
  groupId,
  groupName,
  groupEmoji,
  locationId,
  locationName,
  locationEmoji,
  itemCount,
}: LocationHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-700">
          Groups
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/groups/${groupId}`} className="hover:text-gray-700 flex items-center gap-1">
          <span role="img" aria-hidden="true">
            {groupEmoji}
          </span>
          {groupName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 flex items-center gap-1">
          <span role="img" aria-hidden="true">
            {locationEmoji}
          </span>
          {locationName}
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/groups/${groupId}`}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Back to group"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-3xl" role="img" aria-label={locationName}>
            {locationEmoji}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{locationName}</h1>
            <Badge variant="secondary" className="mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>
        <Link href={`/groups/${groupId}/locations/${locationId}/edit`}>
          <Button variant="ghost" size="sm" aria-label="Edit section">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  )
}
