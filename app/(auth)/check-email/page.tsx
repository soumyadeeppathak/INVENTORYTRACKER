'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { requestMagicLink } from '@/src/server/actions/auth-actions'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)

  async function handleResend() {
    setIsResending(true)
    setResendMessage(null)

    try {
      const formData = new FormData()
      formData.append('email', email)

      const result = await requestMagicLink(formData)

      if (result.success) {
        setResendMessage('Magic link sent! Check your inbox.')
      } else {
        setResendMessage(result.error || 'Failed to resend. Please try again.')
      }
    } catch (err) {
      setResendMessage('Failed to resend. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="flex flex-col items-center">
        {/* Email Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Email"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check your inbox</h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-4">
          We've sent a magic link to{' '}
          {email && <span className="font-medium text-gray-900">{email}</span>}
        </p>

        <p className="text-sm text-center text-gray-500 mb-6">
          Click the link in the email to sign in. The link expires in 15 minutes.
        </p>

        {/* Resend Message */}
        {resendMessage && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm text-center ${
              resendMessage.includes('sent')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {resendMessage}
          </div>
        )}

        {/* Resend Button */}
        <div className="w-full">
          <Button
            variant="ghost"
            className="w-full"
            onClick={handleResend}
            isLoading={isResending}
            disabled={!email}
          >
            Resend link
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-center text-gray-500 mt-6">
          Can't find the email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        </div>
      }
    >
      <CheckEmailContent />
    </Suspense>
  )
}
