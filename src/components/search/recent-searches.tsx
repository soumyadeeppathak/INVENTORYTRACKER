'use client'

interface RecentSearchesProps {
    searches: string[]
    onSelect: (query: string) => void
    onClear: () => void
}

export function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
    if (searches.length === 0) {
        return null
    }

    return (
        <div className="py-2">
            <div className="flex items-center justify-between px-4 py-2">
                <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
                <button
                    type="button"
                    onClick={onClear}
                    className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    Clear all
                </button>
            </div>
            <ul>
                {searches.map((query) => (
                    <li key={query}>
                        <button
                            type="button"
                            onClick={() => onSelect(query)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                        >
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="text-gray-700">{query}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
