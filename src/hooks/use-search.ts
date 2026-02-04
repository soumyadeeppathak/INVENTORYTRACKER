'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from './use-debounce'
import type { SearchResultItem } from '@/src/application/ports/item-repository'

const RECENT_SEARCHES_KEY = 'inventory-recent-searches'
const MAX_RECENT_SEARCHES = 5

interface UseSearchResult {
    query: string
    setQuery: (query: string) => void
    results: SearchResultItem[]
    isLoading: boolean
    error: string | null
    recentSearches: string[]
    addRecentSearch: (query: string) => void
    clearRecentSearches: () => void
}

export function useSearch(): UseSearchResult {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResultItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [recentSearches, setRecentSearches] = useState<string[]>([])

    const debouncedQuery = useDebounce(query, 300)

    // Load recent searches from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored))
            } catch {
                // Ignore parse errors
            }
        }
    }, [])

    // Perform search when debounced query changes
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.length < 2) {
                setResults([])
                setError(null)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Search failed')
                }

                setResults(data.results)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Search failed')
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        performSearch()
    }, [debouncedQuery])

    const addRecentSearch = useCallback((searchQuery: string) => {
        setRecentSearches((prev) => {
            const filtered = prev.filter((q) => q !== searchQuery)
            const updated = [searchQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES)
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
            return updated
        })
    }, [])

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([])
        localStorage.removeItem(RECENT_SEARCHES_KEY)
    }, [])

    return {
        query,
        setQuery,
        results,
        isLoading,
        error,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
    }
}
