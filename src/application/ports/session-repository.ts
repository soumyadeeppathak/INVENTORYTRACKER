import type { Session } from '@/src/domain/entities/session'
import type { UserId } from '@/src/domain/value-objects/user-id'

export interface SessionRepository {
  save(session: Session): Promise<void>
  findById(id: string): Promise<Session | null>
  findByUserId(userId: UserId): Promise<Session[]>
  delete(id: string): Promise<void>
  deleteExpired(): Promise<void>
}
