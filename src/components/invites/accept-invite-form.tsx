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
            const response = await fetch(`/api/invites/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to accept invite')
                setIsLoading(false)
                return
            }

            // Redirect to the group page
            router.push(`/groups/${data.groupId}`)
        } catch (err) {
            console.error('Error accepting invite:', err)
            setError('Something went wrong. Please try again.')
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
