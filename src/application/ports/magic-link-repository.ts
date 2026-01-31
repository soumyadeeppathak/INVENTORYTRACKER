import type { MagicLink } from '@/src/domain/entities/magic-link'

export interface MagicLinkRepository {
  save(link: MagicLink): Promise<void>
  findByToken(token: string): Promise<MagicLink | null>
  markUsed(token: string): Promise<void>
  deleteExpired(): Promise<void>
}
