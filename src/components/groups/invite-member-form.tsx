'use client'

import { useState } from 'react'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { inviteMember } from '@/src/server/actions/group-actions'

interface InviteMemberFormProps {
  groupId: string
  onSuccess?: () => void
}

export function InviteMemberForm({ groupId, onSuccess }: InviteMemberFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await inviteMember(groupId, formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(`Invite sent to ${formData.get('email')}`)
      // Reset form
      const form = document.getElementById('invite-form') as HTMLFormElement
      form?.reset()
      onSuccess?.()
    }

    setIsLoading(false)
  }

  return (
    <form id="invite-form" action={handleSubmit} className="space-y-4">
      <Input
        name="email"
        type="email"
        label="Email address"
        placeholder="partner@example.com"
        required
      />

      <p className="text-sm text-gray-500">
        They'll receive an email with a link to join this group.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Send Invite
      </Button>
    </form>
  )
}
