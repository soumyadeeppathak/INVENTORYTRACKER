'use client'

import { useState } from 'react'
import { useSearch } from '@/src/hooks/use-search'
import { SearchBar } from './search-bar'
import { SearchResults } from './search-results'
import { SearchEmptyState } from './search-empty-state'
import { RecentSearches } from './recent-searches'

export function SearchOverlay() {
    const [isOpen, setIsOpen] = useState(false)
    const {
        query,
        setQuery,
        results,
        isLoading,
        error,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
    } = useSearch()

    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
        setQuery('')
    }

    const handleResultClick = () => {
        if (query.trim()) {
            addRecentSearch(query.trim())
        }
        handleClose()
    }

    const handleRecentSelect = (recentQuery: string) => {
        setQuery(recentQuery)
    }

    const showRecentSearches = isOpen && query.length === 0 && recentSearches.length > 0
    const showResults = query.length >= 2 && results.length > 0
    const showEmptyState = query.length >= 2 && !isLoading && results.length === 0 && !error
    const showPrompt = isOpen && query.length === 0 && recentSearches.length === 0

    return (
        <>
            {/* Search trigger button */}
            <button
                type="button"
                onClick={handleOpen}
                className="flex items-center gap-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
                aria-label="Search items"
            >
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <span>Search items...</span>
            </button>

            {/* Full-screen search overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-white">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
                            aria-label="Close search"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                        </button>
                        <div className="flex-1">
                            <SearchBar
                                value={query}
                                onChange={setQuery}
                                isLoading={isLoading}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto h-[calc(100vh-73px)]">
                        {showPrompt && (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <svg
                                    className="w-12 h-12 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <p className="text-sm">Type at least 2 characters to search</p>
                            </div>
                        )}

                        {showRecentSearches && (
                            <RecentSearches
                                searches={recentSearches}
                                onSelect={handleRecentSelect}
                                onClear={clearRecentSearches}
                            />
                        )}

                        {error && (
                            <div className="p-4 text-center text-red-600">
                                <p>{error}</p>
                            </div>
                        )}

                        {showEmptyState && <SearchEmptyState query={query} />}

                        {showResults && (
                            <SearchResults results={results} onResultClick={handleResultClick} />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
