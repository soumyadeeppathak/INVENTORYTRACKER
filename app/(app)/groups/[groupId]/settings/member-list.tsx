'use client'

import { useRouter } from 'next/navigation'
import { MemberRow } from '@/src/components/groups/member-row'

interface Member {
  id: string
  name: string
  email: string
  role: 'owner' | 'member'
}

interface MemberListProps {
  groupId: string
  members: Member[]
  currentUserId: string
  currentUserIsOwner: boolean
}

export function MemberList({ groupId, members, currentUserId, currentUserIsOwner }: MemberListProps) {
  const router = useRouter()

  const handleMemberRemoved = () => {
    router.refresh()
  }

  return (
    <div>
      {members.map((member) => (
        <MemberRow
          key={member.id}
          groupId={groupId}
          member={member}
          isCurrentUser={member.id === currentUserId}
          currentUserIsOwner={currentUserIsOwner}
          onRemoved={handleMemberRemoved}
        />
      ))}
    </div>
  )
}
