'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'

export function ServiceWorkerUpdate() {
    const [updateAvailable, setUpdateAvailable] = useState(false)

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                // New service worker has taken control
                setUpdateAvailable(true)
            })

            // Check for updates periodically
            const checkForUpdates = async () => {
                const registration = await navigator.serviceWorker.getRegistration()
                if (registration) {
                    await registration.update()
                }
            }

            // Check every 5 minutes
            const interval = setInterval(checkForUpdates, 5 * 60 * 1000)
            return () => clearInterval(interval)
        }
    }, [])

    const handleRefresh = () => {
        window.location.reload()
    }

    if (!updateAvailable) return null

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
            <div className="bg-gray-900 text-white rounded-lg shadow-lg p-4 flex items-center gap-3">
                <div className="flex-1">
                    <p className="text-sm font-medium">Update available</p>
                    <p className="text-xs text-gray-400">Refresh to get the latest version</p>
                </div>
                <Button variant="primary" size="sm" onClick={handleRefresh}>
                    Refresh
                </Button>
            </div>
        </div>
    )
}
