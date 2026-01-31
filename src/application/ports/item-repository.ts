import type { Item } from '@/src/domain/entities/item'
import type { ItemId } from '@/src/domain/value-objects/item-id'
import type { LocationId } from '@/src/domain/value-objects/location-id'
import type { UserId } from '@/src/domain/value-objects/user-id'

export interface ItemRepository {
  save(item: Item): Promise<void>
  findById(id: ItemId): Promise<Item | null>
  findByLocationId(locationId: LocationId): Promise<Item[]>
  findByLocationAndName(locationId: LocationId, name: string): Promise<Item | null>
  delete(id: ItemId): Promise<void>
  searchByName(userId: UserId, query: string): Promise<Item[]>
}
