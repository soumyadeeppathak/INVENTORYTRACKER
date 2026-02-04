'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AcceptInviteFormProps {
    token: string
    groupName: string
}

export function AcceptInviteForm({ token, groupName }: AcceptInviteFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleAccept() {
        setIsLoading(true)
        setError(null)

        try {
            console.log('[AcceptInviteForm] Calling API with token:', token.substring(0, 10) + '...')

            const response = await fetch(`/api/invites/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            console.log('[AcceptInviteForm] Response status:', response.status)

            // Try to parse response body
            let data
            try {
                data = await response.json()
                console.log('[AcceptInviteForm] Response data:', data)
            } catch (parseError) {
                console.error('[AcceptInviteForm] Failed to parse response:', parseError)
                setError(`Server error (${response.status}): Could not parse response`)
                setIsLoading(false)
                return
            }

            if (!response.ok) {
                const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error
                setError(errorMsg || 'Failed to accept invite')
                setIsLoading(false)
                return
            }

            // Redirect to the group page
            router.push(`/groups/${data.groupId}`)
        } catch (err) {
            console.error('[AcceptInviteForm] Network error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError(`Network error: ${errorMessage}`)
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm" role="alert">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-3">
                <button
                    onClick={handleAccept}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Joining...' : `Join ${groupName}`}
                </button>

                <a
                    href="/"
                    className="w-full inline-block text-center text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                    Decline
                </a>
            </div>
        </div>
    )
}
