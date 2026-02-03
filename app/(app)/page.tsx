import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetUserGroupsUseCase } from '@/src/application/use-cases/groups/get-user-groups'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { GroupList } from '@/src/components/groups/group-list'

export default async function HomePage() {
  const user = await requireAuth()

  const groupRepository = new PrismaGroupRepository(db)
  const useCase = new GetUserGroupsUseCase(groupRepository)
  const { groups } = await useCase.execute({ userId: user.id.toString() })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Groups</h1>
      <GroupList groups={groups} />
    </div>
  )
}
