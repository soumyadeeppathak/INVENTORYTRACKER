'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'pwa-install-dismissed'
const DISMISS_DURATION_DAYS = 7

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)

    useEffect(() => {
        // Check if previously dismissed and still within cooldown period
        const dismissedAt = localStorage.getItem(DISMISSED_KEY)
        if (dismissedAt) {
            const dismissedDate = new Date(dismissedAt)
            const now = new Date()
            const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
            if (daysSinceDismissed < DISMISS_DURATION_DAYS) {
                setIsDismissed(true)
                return
            }
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setIsInstallable(true)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    }, [])

    const install = async () => {
        if (!deferredPrompt) return false

        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        setDeferredPrompt(null)
        setIsInstallable(false)

        return outcome === 'accepted'
    }

    const dismiss = () => {
        setIsDismissed(true)
        setIsInstallable(false)
        localStorage.setItem(DISMISSED_KEY, new Date().toISOString())
    }

    return {
        isInstallable: isInstallable && !isDismissed,
        install,
        dismiss,
    }
}
