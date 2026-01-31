import { describe, it, expect, beforeAll } from 'vitest'
import { db } from '@/lib/db'

describe('System Categories Seed', () => {
  let categories: Awaited<ReturnType<typeof db.category.findMany>>

  beforeAll(async () => {
    categories = await db.category.findMany({
      where: { isSystem: true },
      orderBy: { name: 'asc' },
    })
  })

  it('should have exactly 8 system categories', () => {
    expect(categories).toHaveLength(8)
  })

  it('should have all required categories', () => {
    const categoryNames = categories.map((c) => c.name).sort()
    expect(categoryNames).toEqual([
      'Clothes',
      'Documents',
      'Electronics',
      'Kitchen',
      'Other',
      'Sports',
      'Toiletries',
      'Tools',
    ])
  })

  it('should have correct emojis', () => {
    const categoryMap = new Map(categories.map((c) => [c.name, c.emoji]))

    expect(categoryMap.get('Electronics')).toBe('⚡')
    expect(categoryMap.get('Clothes')).toBe('👕')
    expect(categoryMap.get('Toiletries')).toBe('🧴')
    expect(categoryMap.get('Kitchen')).toBe('🍳')
    expect(categoryMap.get('Sports')).toBe('⚽')
    expect(categoryMap.get('Tools')).toBe('🔧')
    expect(categoryMap.get('Documents')).toBe('📄')
    expect(categoryMap.get('Other')).toBe('📦')
  })

  it('should have isSystem flag set to true', () => {
    for (const category of categories) {
      expect(category.isSystem).toBe(true)
    }
  })

  it('should have null groupId', () => {
    for (const category of categories) {
      expect(category.groupId).toBeNull()
    }
  })
})
