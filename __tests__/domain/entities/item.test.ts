import { describe, it, expect } from 'vitest'
import { Item } from '@/src/domain/entities/item'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { LocationId } from '@/src/domain/value-objects/location-id'
import { CategoryId } from '@/src/domain/value-objects/category-id'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('Item Entity', () => {
  const createTestItem = (overrides?: {
    name?: string
    emoji?: Emoji
    quantity?: number
    locationId?: LocationId
    categoryId?: CategoryId | null
  }) => {
    return Item.create({
      name: overrides?.name ?? 'Test Item',
      emoji: overrides?.emoji ?? Emoji.create('📦'),
      quantity: overrides?.quantity,
      locationId: overrides?.locationId ?? LocationId.generate(),
      categoryId: overrides?.categoryId,
    })
  }

  describe('creation', () => {
    it('should create item with default quantity 1', () => {
      const item = createTestItem()
      expect(item.quantity).toBe(1)
    })

    it('should create item with specified quantity', () => {
      const item = createTestItem({ quantity: 5 })
      expect(item.quantity).toBe(5)
    })

    it('should create item without category', () => {
      const item = createTestItem()
      expect(item.categoryId).toBeNull()
    })

    it('should create item with category', () => {
      const categoryId = CategoryId.generate()
      const item = createTestItem({ categoryId })
      expect(item.categoryId).toBe(categoryId)
    })
  })

  describe('validation', () => {
    it('should reject empty name', () => {
      expect(() => createTestItem({ name: '' })).toThrow(DomainError)
      expect(() => createTestItem({ name: '  ' })).toThrow(DomainError)
    })

    it('should reject name exceeding 255 characters', () => {
      const longName = 'a'.repeat(256)
      expect(() => createTestItem({ name: longName })).toThrow(DomainError)
      expect(() => createTestItem({ name: longName })).toThrow('must not exceed 255 characters')
    })

    it('should reject quantity less than 1', () => {
      expect(() => createTestItem({ quantity: 0 })).toThrow(DomainError)
      expect(() => createTestItem({ quantity: -1 })).toThrow(DomainError)
      expect(() => createTestItem({ quantity: -5 })).toThrow(DomainError)
    })

    it('should reject non-integer quantity', () => {
      expect(() => createTestItem({ quantity: 1.5 })).toThrow(DomainError)
      expect(() => createTestItem({ quantity: 2.7 })).toThrow(DomainError)
    })
  })

  describe('moveTo', () => {
    it('should update location when moving to different location', () => {
      const location1 = LocationId.generate()
      const location2 = LocationId.generate()
      const item = createTestItem({ locationId: location1 })

      const originalUpdatedAt = item.updatedAt

      // Wait a tiny bit to ensure timestamp difference
      setTimeout(() => {
        item.moveTo(location2)

        expect(item.locationId).toBe(location2)
        expect(item.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      }, 1)
    })

    it('should be no-op when moving to same location', () => {
      const location = LocationId.generate()
      const item = createTestItem({ locationId: location })
      const originalUpdatedAt = item.updatedAt

      item.moveTo(location)

      expect(item.locationId).toBe(location)
      expect(item.updatedAt).toBe(originalUpdatedAt)
    })
  })

  describe('assignCategory', () => {
    it('should assign category to item', () => {
      const item = createTestItem()
      const categoryId = CategoryId.generate()

      item.assignCategory(categoryId)

      expect(item.categoryId).toBe(categoryId)
    })

    it('should remove category when assigning null', () => {
      const categoryId = CategoryId.generate()
      const item = createTestItem({ categoryId })

      item.assignCategory(null)

      expect(item.categoryId).toBeNull()
    })

    it('should update updatedAt when assigning category', () => {
      const item = createTestItem()
      const originalUpdatedAt = item.updatedAt
      const categoryId = CategoryId.generate()

      setTimeout(() => {
        item.assignCategory(categoryId)
        expect(item.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      }, 1)
    })
  })

  describe('updateDetails', () => {
    it('should update item name', () => {
      const item = createTestItem({ name: 'Old Name' })

      item.updateDetails({ name: 'New Name' })

      expect(item.name).toBe('New Name')
    })

    it('should update item quantity', () => {
      const item = createTestItem({ quantity: 1 })

      item.updateDetails({ quantity: 5 })

      expect(item.quantity).toBe(5)
    })

    it('should update item emoji', () => {
      const item = createTestItem({ emoji: Emoji.create('📦') })
      const newEmoji = Emoji.create('🎁')

      item.updateDetails({ emoji: newEmoji })

      expect(item.emoji).toBe(newEmoji)
    })

    it('should validate name when updating', () => {
      const item = createTestItem()

      expect(() => item.updateDetails({ name: '' })).toThrow(DomainError)
      expect(() => item.updateDetails({ name: 'a'.repeat(256) })).toThrow(DomainError)
    })

    it('should validate quantity when updating', () => {
      const item = createTestItem()

      expect(() => item.updateDetails({ quantity: 0 })).toThrow(DomainError)
      expect(() => item.updateDetails({ quantity: -1 })).toThrow(DomainError)
    })
  })

  describe('reconstitute', () => {
    it('should recreate item from persistence data', () => {
      const locationId = LocationId.generate()
      const categoryId = CategoryId.generate()
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-01-02')

      const item = Item.reconstitute({
        id: 'test-id-123',
        name: 'Reconstituted Item',
        emoji: Emoji.create('📦'),
        quantity: 3,
        locationId,
        categoryId,
        createdAt,
        updatedAt,
      })

      expect(item.id.toString()).toBe('test-id-123')
      expect(item.name).toBe('Reconstituted Item')
      expect(item.quantity).toBe(3)
      expect(item.locationId).toBe(locationId)
      expect(item.categoryId).toBe(categoryId)
      expect(item.createdAt).toBe(createdAt)
      expect(item.updatedAt).toBe(updatedAt)
    })
  })
})
