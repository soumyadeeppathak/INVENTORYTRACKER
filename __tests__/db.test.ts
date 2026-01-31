import { describe, it, expect } from 'vitest'
import { db } from '@/lib/db'

describe('Database Connection', () => {
  it('should have Prisma client available', () => {
    expect(db).toBeDefined()
    expect(db.user).toBeDefined()
    expect(db.group).toBeDefined()
    expect(db.location).toBeDefined()
    expect(db.item).toBeDefined()
    expect(db.category).toBeDefined()
  })

  it('should have all expected models', () => {
    const models = [
      'user',
      'session',
      'magicLink',
      'group',
      'groupMembership',
      'groupInvite',
      'location',
      'item',
      'category',
    ]

    for (const model of models) {
      expect(db).toHaveProperty(model)
    }
  })
})
