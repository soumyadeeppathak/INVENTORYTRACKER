import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetGroupUseCase } from '@/src/application/use-cases/groups/get-group'
import { GetLocationUseCase } from '@/src/application/use-cases/locations/get-location'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { EditLocationForm } from '@/src/components/locations/edit-location-form'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card'

interface EditLocationPageProps {
  params: Promise<{ groupId: string; locationId: string }>
}

export default async function EditLocationPage({ params }: EditLocationPageProps) {
  const { groupId, locationId } = await params
  const user = await requireAuth()

  const groupRepository = new PrismaGroupRepository(db)
  const locationRepository = new PrismaLocationRepository(db)

  try {
    // Fetch group details for breadcrumb
    const groupUseCase = new GetGroupUseCase(groupRepository, locationRepository)
    const { group } = await groupUseCase.execute({
      userId: user.id.toString(),
      groupId,
    })

    // Fetch location details
    const locationUseCase = new GetLocationUseCase(locationRepository, groupRepository)
    const { location } = await locationUseCase.execute({
      userId: user.id.toString(),
      locationId,
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
          <Link
            href={`/groups/${groupId}/locations/${locationId}`}
            className="hover:text-gray-700 flex items-center gap-1"
          >
            <span role="img" aria-hidden="true">
              {location.emoji}
            </span>
            {location.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Edit</span>
        </nav>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <h1 className="text-xl font-semibold text-gray-900">Edit Section</h1>
            <p className="text-sm text-gray-500">Update the section details or delete it.</p>
          </CardHeader>
          <CardContent>
            <EditLocationForm
              groupId={groupId}
              locationId={locationId}
              initialName={location.name}
              initialEmoji={location.emoji}
              itemCount={location.itemCount}
            />
          </CardContent>
        </Card>
      </div>
    )
  } catch {
    notFound()
  }
}
