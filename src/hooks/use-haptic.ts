'use client'

import { useCallback } from 'react'

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error'

const patterns: Record<HapticPattern, number[]> = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 50, 20],
    error: [30, 100, 30, 100, 30],
}

export function useHaptic() {
    const trigger = useCallback((pattern: HapticPattern = 'light') => {
        if (!navigator.vibrate) return false

        const vibrationPattern = patterns[pattern]
        return navigator.vibrate(vibrationPattern)
    }, [])

    const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

    return { trigger, isSupported }
}
