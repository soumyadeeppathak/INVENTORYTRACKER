import type { Location } from '@/src/domain/entities/location'
import type { GroupId } from '@/src/domain/value-objects/group-id'
import type { LocationId } from '@/src/domain/value-objects/location-id'

export interface LocationRepository {
  save(location: Location): Promise<void>
  findById(id: LocationId): Promise<Location | null>
  findByGroupId(groupId: GroupId): Promise<Location[]>
  delete(id: LocationId): Promise<void>
  getItemCount(id: LocationId): Promise<number>
}
