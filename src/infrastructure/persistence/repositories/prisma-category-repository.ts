import type { PrismaClient } from '@prisma/client'
import type { CategoryRepository } from '@/src/application/ports/category-repository'
import type { Category } from '@/src/domain/entities/category'
import type { CategoryId } from '@/src/domain/value-objects/category-id'
import type { GroupId } from '@/src/domain/value-objects/group-id'
import { categoryToDomain, categoryToPrisma } from '../mappers/category-mapper'

export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async save(category: Category): Promise<void> {
    const data = categoryToPrisma(category)
    await this.prisma.category.upsert({
      where: { id: category.id.toString() },
      update: {
        name: data.name,
        emoji: data.emoji,
      },
      create: data,
    })
  }

  async findById(id: CategoryId): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id: id.toString() },
    })
    return category ? categoryToDomain(category) : null
  }

  async findSystemCategories(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { isSystem: true },
    })
    return categories.map((category) => categoryToDomain(category))
  }

  async findByGroupId(groupId: GroupId): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { groupId: groupId.toString() },
    })
    return categories.map((category) => categoryToDomain(category))
  }

  async delete(id: CategoryId): Promise<void> {
    await this.prisma.category.delete({
      where: { id: id.toString() },
    })
  }
}
