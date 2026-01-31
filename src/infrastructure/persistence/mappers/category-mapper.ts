import type { Category as PrismaCategory } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { Category } from '@/src/domain/entities/category'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'

export function categoryToDomain(prismaCategory: PrismaCategory): Category {
  return Category.reconstitute({
    id: prismaCategory.id,
    name: prismaCategory.name,
    emoji: Emoji.create(prismaCategory.emoji),
    isSystem: prismaCategory.isSystem,
    groupId: prismaCategory.groupId ? GroupId.create(prismaCategory.groupId) : null,
  })
}

export function categoryToPrisma(category: Category): Prisma.CategoryCreateInput {
  return {
    id: category.id.toString(),
    name: category.name,
    emoji: category.emoji.toString(),
    isSystem: category.isSystem,
    group: category.groupId
      ? {
          connect: { id: category.groupId.toString() },
        }
      : undefined,
  }
}
