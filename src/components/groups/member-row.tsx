'use client'

import { useState } from 'react'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { ConfirmDialog } from '@/src/components/ui/dialog'
import { removeMember } from '@/src/server/actions/group-actions'

interface MemberRowProps {
  groupId: string
  member: {
    id: string
    name: string
    email: string
    role: 'owner' | 'member'
  }
  isCurrentUser: boolean
  currentUserIsOwner: boolean
  onRemoved?: () => void
}

export function MemberRow({
  groupId,
  member,
  isCurrentUser,
  currentUserIsOwner,
  onRemoved,
}: MemberRowProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const canRemove = currentUserIsOwner && !isCurrentUser && member.role !== 'owner'

  async function handleRemove() {
    setIsLoading(true)
    const result = await removeMember(groupId, member.id)
    if (!result.error) {
      onRemoved?.()
    }
    setIsLoading(false)
  }

  // Generate avatar initials
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {member.name}
            {isCurrentUser && <span className="text-gray-500 font-normal"> (you)</span>}
          </p>
          <p className="text-sm text-gray-500">{member.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={member.role === 'owner' ? 'primary' : 'default'}>
          {member.role === 'owner' ? 'Owner' : 'Member'}
        </Badge>

        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(true)}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Remove
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleRemove}
        title="Remove Member"
        description={`Are you sure you want to remove ${member.name} from this group? They will lose access to all items and locations.`}
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  )
}
