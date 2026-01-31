import { describe, it, expect } from 'vitest'
import { Category } from '@/src/domain/entities/category'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { GroupId } from '@/src/domain/value-objects/group-id'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('Category Entity', () => {
  describe('creation', () => {
    it('should create system category', () => {
      const category = Category.create({
        name: 'Electronics',
        emoji: Emoji.create('⚡'),
        isSystem: true,
        groupId: null,
      })

      expect(category.name).toBe('Electronics')
      expect(category.isSystem).toBe(true)
      expect(category.groupId).toBeNull()
    })

    it('should create custom category', () => {
      const groupId = GroupId.generate()
      const category = Category.create({
        name: 'Custom',
        emoji: Emoji.create('📦'),
        isSystem: false,
        groupId,
      })

      expect(category.name).toBe('Custom')
      expect(category.isSystem).toBe(false)
      expect(category.groupId).toBe(groupId)
    })
  })

  describe('validation', () => {
    it('should reject empty name', () => {
      expect(() =>
        Category.create({
          name: '',
          emoji: Emoji.create('📦'),
          isSystem: false,
        }),
      ).toThrow(DomainError)
    })

    it('should reject name exceeding 255 characters', () => {
      const longName = 'a'.repeat(256)
      expect(() =>
        Category.create({
          name: longName,
          emoji: Emoji.create('📦'),
          isSystem: false,
        }),
      ).toThrow(DomainError)
    })
  })

  describe('updateDetails', () => {
    it('should update custom category details', () => {
      const groupId = GroupId.generate()
      const category = Category.create({
        name: 'Old Name',
        emoji: Emoji.create('📦'),
        isSystem: false,
        groupId,
      })

      const newEmoji = Emoji.create('🎁')
      category.updateDetails({ name: 'New Name', emoji: newEmoji })

      expect(category.name).toBe('New Name')
      expect(category.emoji).toBe(newEmoji)
    })

    it('should prevent updating system categories', () => {
      const category = Category.create({
        name: 'Electronics',
        emoji: Emoji.create('⚡'),
        isSystem: true,
        groupId: null,
      })

      expect(() => category.updateDetails({ name: 'New Name' })).toThrow(DomainError)
      expect(() => category.updateDetails({ name: 'New Name' })).toThrow(
        'System categories cannot be modified',
      )
    })
  })
})
