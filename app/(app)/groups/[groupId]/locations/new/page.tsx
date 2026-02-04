import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetGroupUseCase } from '@/src/application/use-cases/groups/get-group'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { CreateLocationForm } from '@/src/components/locations/create-location-form'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card'

interface NewLocationPageProps {
  params: Promise<{ groupId: string }>
}

export default async function NewLocationPage({ params }: NewLocationPageProps) {
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

    return (
      <div>
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-700">
            Groups
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/groups/${groupId}`} className="hover:text-gray-700 flex items-center gap-1">
            <span role="img" aria-hidden="true">
              {group.emoji}
            </span>
            {group.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">New Section</span>
        </nav>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <h1 className="text-xl font-semibold text-gray-900">Create Section</h1>
            <p className="text-sm text-gray-500">
              Add a new section to organize your items in {group.name}.
            </p>
          </CardHeader>
          <CardContent>
            <CreateLocationForm groupId={groupId} />
          </CardContent>
        </Card>
      </div>
    )
  } catch {
    notFound()
  }
}
