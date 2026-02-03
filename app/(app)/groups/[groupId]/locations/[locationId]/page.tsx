import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetGroupUseCase } from '@/src/application/use-cases/groups/get-group'
import { GetLocationUseCase } from '@/src/application/use-cases/locations/get-location'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { LocationHeader } from '@/src/components/locations/location-header'
import { EmptyState } from '@/src/components/ui/empty-state'
import { Button } from '@/src/components/ui/button'

interface LocationPageProps {
  params: Promise<{ groupId: string; locationId: string }>
}

export default async function LocationPage({ params }: LocationPageProps) {
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
        <LocationHeader
          groupId={groupId}
          groupName={group.name}
          groupEmoji={group.emoji}
          locationId={locationId}
          locationName={location.name}
          locationEmoji={location.emoji}
          itemCount={location.itemCount}
        />

        {/* Items will be implemented in Task 17 */}
        <EmptyState
          icon="📦"
          title="No items yet"
          description="Add your first item to this location."
          action={<Button disabled>Add Item (Coming Soon)</Button>}
        />
      </div>
    )
  } catch {
    notFound()
  }
}
