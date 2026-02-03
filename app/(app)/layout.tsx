import type { ReactNode } from 'react'
import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { signOut } from '@/src/server/actions/auth-actions'
import { Button } from '@/src/components/ui/button'
import { ToastProvider } from '@/src/components/ui/toast'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireAuth()

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <Link href="/" className="text-lg font-semibold text-gray-900">
                  InventoryTracker
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">{user.name}</span>
                <form action={signOut}>
                  <Button type="submit" variant="ghost" size="sm">
                    Sign out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </div>
    </ToastProvider>
  )
}
