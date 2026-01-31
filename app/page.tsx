import { requireAuth } from '@/lib/auth'
import { signOut } from '@/src/server/actions/auth-actions'
import { Button } from '@/src/components/ui/button'

export default async function HomePage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">InventoryTracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.name} ({user.email.toString()})
              </span>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to InventoryTracker!
            </h2>
            <p className="text-gray-600">
              You're successfully signed in. The group and inventory management features will be
              available in upcoming tasks.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
