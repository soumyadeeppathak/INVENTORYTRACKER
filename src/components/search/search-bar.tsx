'use client'

import { useRef, useEffect } from 'react'
import { Input } from '@/src/components/ui/input'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    onFocus?: () => void
    onBlur?: () => void
    isLoading?: boolean
    autoFocus?: boolean
}

export function SearchBar({
    value,
    onChange,
    onFocus,
    onBlur,
    isLoading = false,
    autoFocus = false,
}: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus()
        }
    }, [autoFocus])

    const handleClear = () => {
        onChange('')
        inputRef.current?.focus()
    }

    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {isLoading ? (
                    <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : (
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
                )}
            </div>

            <Input
                ref={inputRef}
                type="search"
                placeholder="Search items..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                className="pl-10 pr-10"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
            />

            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}
