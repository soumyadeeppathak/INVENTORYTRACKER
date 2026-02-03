'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmojiPicker } from '@/src/components/ui/emoji-picker'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { createLocation } from '@/src/server/actions/location-actions'

interface CreateLocationFormProps {
  groupId: string
}

export function CreateLocationForm({ groupId }: CreateLocationFormProps) {
  const router = useRouter()
  const [emoji, setEmoji] = useState('📍')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    formData.set('emoji', emoji)

    const result = await createLocation(groupId, formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result.locationId) {
      router.push(`/groups/${groupId}/locations/${result.locationId}`)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center">
        <EmojiPicker value={emoji} onChange={setEmoji} label="Pick an emoji" />
      </div>

      <Input
        name="name"
        label="Location name"
        placeholder="e.g., Kitchen, Bedroom, Garage"
        required
        maxLength={255}
        autoFocus
      />

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Location
      </Button>
    </form>
  )
}
