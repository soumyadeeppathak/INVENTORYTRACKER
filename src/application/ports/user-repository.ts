import type { User } from '@/src/domain/entities/user'
import type { Email } from '@/src/domain/value-objects/email'
import type { UserId } from '@/src/domain/value-objects/user-id'

export interface UserRepository {
  save(user: User): Promise<void>
  findById(id: UserId): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
  delete(id: UserId): Promise<void>
}
