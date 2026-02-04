'use client'

import Link from 'next/link'
import type { SearchResultItem } from '@/src/application/ports/item-repository'

interface SearchResultsProps {
    results: SearchResultItem[]
    onResultClick?: (result: SearchResultItem) => void
}

// Group results by group, then by section
function groupResults(results: SearchResultItem[]) {
    const grouped = new Map<
        string,
        {
            group: { id: string; name: string; emoji: string }
            locations: Map<
                string,
                {
                    location: { id: string; name: string; emoji: string }
                    items: SearchResultItem[]
                }
            >
        }
    >()

    for (const result of results) {
        const groupId = result.group.id
        const locationId = result.location.id

        if (!grouped.has(groupId)) {
            grouped.set(groupId, {
                group: result.group,
                locations: new Map(),
            })
        }

        const groupData = grouped.get(groupId)
        if (groupData && !groupData.locations.has(locationId)) {
            groupData.locations.set(locationId, {
                location: result.location,
                items: [],
            })
        }

        groupData?.locations.get(locationId)?.items.push(result)
    }

    return grouped
}

export function SearchResults({ results, onResultClick }: SearchResultsProps) {
    const groupedResults = groupResults(results)

    return (
        <div className="divide-y divide-gray-100">
            {Array.from(groupedResults.values()).map(({ group, locations }) => (
                <div key={group.id} className="py-3">
                    {/* Group Header */}
                    <div className="flex items-center gap-2 px-4 py-1">
                        <span className="text-lg" role="img" aria-label={group.name}>
                            {group.emoji}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900">{group.name}</h3>
                    </div>

                    {/* Sections within group */}
                    {Array.from(locations.values()).map(({ location, items }) => (
                        <div key={location.id} className="ml-6">
                            {/* Section Subheader */}
                            <div className="flex items-center gap-2 px-4 py-1">
                                <span className="text-sm" role="img" aria-label={location.name}>
                                    {location.emoji}
                                </span>
                                <h4 className="text-xs font-medium text-gray-500">{location.name}</h4>
                            </div>

                            {/* Items in section */}
                            <ul className="ml-4">
                                {items.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            href={`/groups/${group.id}/locations/${location.id}`}
                                            onClick={() => onResultClick?.(item)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <span className="text-xl" role="img" aria-label={item.name}>
                                                {item.emoji}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">×{item.quantity}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
