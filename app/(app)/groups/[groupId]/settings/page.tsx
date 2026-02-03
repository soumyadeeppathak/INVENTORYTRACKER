import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetGroupUseCase } from '@/src/application/use-cases/groups/get-group'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import { InviteMemberForm } from '@/src/components/groups/invite-member-form'
import { MemberList } from './member-list'
import { LeaveGroupButton } from './leave-group-button'

interface GroupSettingsPageProps {
  params: Promise<{ groupId: string }>
}

export default async function GroupSettingsPage({ params }: GroupSettingsPageProps) {
  const { groupId } = await params
  const user = await requireAuth()

  const groupRepository = new PrismaGroupRepository(db)
  const locationRepository = new PrismaLocationRepository(db)
  const useCase = new GetGroupUseCase(groupRepository, locationRepository)

  try {
    const { group } = await useCase.execute({
      userId: user.id.toString(),
      groupId,
    })

    const currentUserId = user.id.toString()
    const isOwner = group.role === 'owner'

    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/groups/${groupId}`} className="text-gray-400 hover:text-gray-600" aria-label="Back to group">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-2xl" role="img" aria-label={group.name}>
            {group.emoji}
          </span>
          <h1 className="text-xl font-bold text-gray-900">{group.name} Settings</h1>
        </div>

        <div className="space-y-6 max-w-2xl">
          {/* Members Section */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Members ({group.memberCount})
              </h2>
            </CardHeader>
            <MemberList
              groupId={groupId}
              members={group.members}
              currentUserId={currentUserId}
              currentUserIsOwner={isOwner}
            />
          </Card>

          {/* Invite Section */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Invite Someone</h2>
            </CardHeader>
            <CardContent>
              <InviteMemberForm groupId={groupId} />
            </CardContent>
          </Card>

          {/* Leave Group Section */}
          <Card>
            <CardContent className="py-4">
              <LeaveGroupButton groupId={groupId} groupName={group.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch {
    notFound()
  }
}
