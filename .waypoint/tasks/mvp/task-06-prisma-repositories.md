# Task 06: Infrastructure Layer - Prisma Repositories

**Phase**: 1 - Foundation
**Priority**: High
**Blocked By**: Tasks 02, 05
**Blocks**: Tasks 07-14

---

## Objective

Implement repository interfaces using Prisma. Include mappers to convert between Prisma models and domain entities.

## Acceptance Criteria

- [ ] All repository implementations created
- [ ] Mappers convert Prisma models to domain entities
- [ ] Mappers convert domain entities to Prisma input
- [ ] All repository methods implemented
- [ ] Integration tests pass with test database

## Technical Details

### Mapper Pattern

```typescript
// Example: UserMapper
export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.reconstitute({
      id: UserId.fromString(prismaUser.id),
      email: Email.create(prismaUser.email),
      name: prismaUser.name,
      createdAt: prismaUser.createdAt,
    })
  }

  static toPrisma(user: User): Prisma.UserCreateInput {
    return {
      id: user.id.toString(),
      email: user.email.toString(),
      name: user.name,
      createdAt: user.createdAt,
    }
  }
}
```

### Repository Implementation

```typescript
// Example: PrismaUserRepository
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    const data = UserMapper.toPrisma(user)
    await this.prisma.user.upsert({
      where: { id: user.id.toString() },
      update: data,
      create: data,
    })
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id.toString() },
    })
    return user ? UserMapper.toDomain(user) : null
  }
  // ... other methods
}
```

## Files to Create

```
src/infrastructure/
├── persistence/
│   ├── mappers/
│   │   ├── user-mapper.ts
│   │   ├── group-mapper.ts
│   │   ├── location-mapper.ts
│   │   ├── item-mapper.ts
│   │   └── category-mapper.ts
│   └── repositories/
│       ├── prisma-user-repository.ts
│       ├── prisma-group-repository.ts
│       ├── prisma-location-repository.ts
│       ├── prisma-item-repository.ts
│       ├── prisma-category-repository.ts
│       ├── prisma-magic-link-repository.ts
│       └── prisma-invite-repository.ts
```

## Verification

```bash
npm run test -- infrastructure/  # Repository tests pass
npm run typecheck                # No type errors
```

---

_Task 06 of 20 | Phase 1: Foundation_
