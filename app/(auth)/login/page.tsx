'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { requestMagicLink } from '@/src/server/actions/auth-actions'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await requestMagicLink(formData)

      if (result.success && result.redirectTo) {
        router.push(result.redirectTo)
      } else if (result.error) {
        setError(result.error)
        setIsLoading(false)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and we'll send you a magic link to sign in.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          error={error || undefined}
          disabled={isLoading}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Send magic link
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-xs text-gray-500 text-center">
          By signing in, you agree to keep track of your stuff responsibly.
        </p>
      </div>
    </div>
  )
}
