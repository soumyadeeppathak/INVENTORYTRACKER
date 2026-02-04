import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetGroupUseCase } from '@/src/application/use-cases/groups/get-group'
import { GetLocationUseCase } from '@/src/application/use-cases/locations/get-location'
import { GetLocationItemsUseCase } from '@/src/application/use-cases/items/get-location-items'
import { GetGroupLocationsUseCase } from '@/src/application/use-cases/locations/get-group-locations'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { PrismaLocationRepository } from '@/src/infrastructure/persistence/repositories/prisma-location-repository'
import { PrismaItemRepository } from '@/src/infrastructure/persistence/repositories/prisma-item-repository'
import { LocationHeader } from '@/src/components/locations/location-header'
import { ItemsPageClient } from './items-page-client'

interface LocationPageProps {
  params: Promise<{ groupId: string; locationId: string }>
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { groupId, locationId } = await params
  const user = await requireAuth()

  const groupRepository = new PrismaGroupRepository(db)
  const locationRepository = new PrismaLocationRepository(db)
  const itemRepository = new PrismaItemRepository(db)

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

    // Fetch items in this location
    const itemsUseCase = new GetLocationItemsUseCase(itemRepository, locationRepository, groupRepository)
    const { items } = await itemsUseCase.execute({
      userId: user.id.toString(),
      locationId,
    })

    // Fetch all locations in the group (for move modal)
    const locationsUseCase = new GetGroupLocationsUseCase(locationRepository, groupRepository)
    const { locations } = await locationsUseCase.execute({
      userId: user.id.toString(),
      groupId,
    })

    // Fetch all categories
    const categories = await db.category.findMany({
      where: {
        OR: [{ isSystem: true, groupId: null }, { groupId }],
      },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
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

        <ItemsPageClient
          groupId={groupId}
          locationId={locationId}
          items={items}
          categories={categories}
          locations={locations}
        />
      </div>
    )
  } catch {
    notFound()
  }
}
