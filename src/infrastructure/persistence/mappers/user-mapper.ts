import type { User as PrismaUser } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { User } from '@/src/domain/entities/user'
import { Email } from '@/src/domain/value-objects/email'

export function userToDomain(prismaUser: PrismaUser): User {
  return User.reconstitute({
    id: prismaUser.id,
    email: Email.create(prismaUser.email),
    name: prismaUser.name,
    createdAt: prismaUser.createdAt,
  })
}

export function userToPrisma(user: User): Prisma.UserCreateInput {
  return {
    id: user.id.toString(),
    email: user.email.toString(),
    name: user.name,
    createdAt: user.createdAt,
  }
}
