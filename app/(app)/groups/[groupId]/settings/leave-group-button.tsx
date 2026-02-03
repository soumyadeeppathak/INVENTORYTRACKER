'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { ConfirmDialog } from '@/src/components/ui/dialog'
import { leaveGroup } from '@/src/server/actions/group-actions'

interface LeaveGroupButtonProps {
  groupId: string
  groupName: string
}

export function LeaveGroupButton({ groupId, groupName }: LeaveGroupButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLeave = async () => {
    setIsLeaving(true)
    setError(null)

    const result = await leaveGroup(groupId)

    if (result?.error) {
      setError(result.error)
      setIsLeaving(false)
    }
    // If successful, the action will redirect to home
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">Leave Group</p>
          <p className="text-sm text-gray-500">You will lose access to this group</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowConfirm(true)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Leave
        </Button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLeave}
        title="Leave Group?"
        description={`Are you sure you want to leave "${groupName}"? You will need a new invite to rejoin.`}
        confirmLabel={isLeaving ? 'Leaving...' : 'Leave Group'}
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  )
}
