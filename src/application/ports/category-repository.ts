import type { Category } from '@/src/domain/entities/category'
import type { CategoryId } from '@/src/domain/value-objects/category-id'
import type { GroupId } from '@/src/domain/value-objects/group-id'

export interface CategoryRepository {
  save(category: Category): Promise<void>
  findById(id: CategoryId): Promise<Category | null>
  findSystemCategories(): Promise<Category[]>
  findByGroupId(groupId: GroupId): Promise<Category[]>
  delete(id: CategoryId): Promise<void>
}
