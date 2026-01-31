'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Spinner } from '@/src/components/ui/spinner'
import { Button } from '@/src/components/ui/button'
import { verifyMagicLink } from '@/src/server/actions/auth-actions'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    async function verify() {
      if (!token) {
        setError('No verification token provided')
        setIsVerifying(false)
        return
      }

      try {
        const result = await verifyMagicLink(token)

        if (!result.success && result.error) {
          setError(result.error)
          setIsVerifying(false)
        }
        // On success, the action will redirect to home
      } catch (err) {
        setError('Failed to verify magic link. Please try again.')
        setIsVerifying(false)
      }
    }

    verify()
  }, [token])

  if (isVerifying) {
    return (
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="flex flex-col items-center">
          <Spinner size="lg" className="text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying...</h2>
          <p className="text-sm text-gray-600 text-center">
            Please wait while we verify your magic link.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="flex flex-col items-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Error"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verification failed</h2>
          <p className="text-center text-gray-600 mb-6">{error}</p>

          <div className="w-full space-y-3">
            <Link href="/login" className="block">
              <Button className="w-full">Request new magic link</Button>
            </Link>

            <p className="text-xs text-center text-gray-500">
              Magic links expire after 15 minutes and can only be used once.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center">
            <Spinner size="lg" className="text-blue-600" />
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
