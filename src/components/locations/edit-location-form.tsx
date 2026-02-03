'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmojiPicker } from '@/src/components/ui/emoji-picker'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { updateLocation, deleteLocation } from '@/src/server/actions/location-actions'

interface EditLocationFormProps {
  groupId: string
  locationId: string
  initialName: string
  initialEmoji: string
  itemCount: number
}

export function EditLocationForm({
  groupId,
  locationId,
  initialName,
  initialEmoji,
  itemCount,
}: EditLocationFormProps) {
  const router = useRouter()
  const [emoji, setEmoji] = useState(initialEmoji)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    formData.set('emoji', emoji)

    const result = await updateLocation(groupId, locationId, formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/groups/${groupId}/locations/${locationId}`)
    }
  }

  async function handleDelete(confirmed = false) {
    setIsDeleting(true)
    setError(null)

    const result = await deleteLocation(groupId, locationId, confirmed)

    if (result.requiresConfirmation) {
      setShowDeleteConfirm(true)
      setIsDeleting(false)
    } else if (result.error) {
      setError(result.error)
      setIsDeleting(false)
    } else {
      router.push(`/groups/${groupId}`)
    }
  }

  return (
    <div className="space-y-6">
      <form action={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <EmojiPicker value={emoji} onChange={setEmoji} label="Pick an emoji" />
        </div>

        <Input
          name="name"
          label="Location name"
          placeholder="e.g., Kitchen, Bedroom, Garage"
          defaultValue={initialName}
          required
          maxLength={255}
          autoFocus
        />

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button type="submit" isLoading={isLoading} className="w-full">
          Save Changes
        </Button>
      </form>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Danger Zone</h3>

        {showDeleteConfirm ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 mb-4">
              This location contains <strong>{itemCount}</strong>{' '}
              {itemCount === 1 ? 'item' : 'items'}. Deleting it will also delete all items inside.
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isDeleting}
                onClick={() => handleDelete(true)}
              >
                Delete Location & Items
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            onClick={() => handleDelete(false)}
          >
            Delete Location
          </Button>
        )}
      </div>
    </div>
  )
}
