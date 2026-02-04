'use client'

import { usePWAInstall } from '@/src/hooks/use-pwa-install'
import { Button } from '@/src/components/ui/button'

export function InstallPrompt() {
    const { isInstallable, install, dismiss } = usePWAInstall()

    if (!isInstallable) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
            <div className="flex items-center gap-4 max-w-lg mx-auto">
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-xl">
                    <span className="text-2xl">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">Add to Home Screen</h3>
                    <p className="text-xs text-gray-500 truncate">Quick access to your inventory</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={dismiss}>
                        Not Now
                    </Button>
                    <Button variant="primary" size="sm" onClick={install}>
                        Install
                    </Button>
                </div>
            </div>
        </div>
    )
}
