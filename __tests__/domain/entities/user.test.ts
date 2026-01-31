import { describe, it, expect } from 'vitest'
import { User } from '@/src/domain/entities/user'
import { Email } from '@/src/domain/value-objects/email'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('User Entity', () => {
  const createTestUser = (overrides?: { email?: Email; name?: string }) => {
    return User.create({
      email: overrides?.email ?? Email.create('test@example.com'),
      name: overrides?.name ?? 'Test User',
    })
  }

  describe('creation', () => {
    it('should create user with valid data', () => {
      const email = Email.create('user@example.com')
      const user = User.create({ email, name: 'John Doe' })

      expect(user.email).toBe(email)
      expect(user.name).toBe('John Doe')
      expect(user.createdAt).toBeInstanceOf(Date)
    })

    it('should generate unique ID', () => {
      const user1 = createTestUser()
      const user2 = createTestUser()

      expect(user1.id.equals(user2.id)).toBe(false)
    })
  })

  describe('validation', () => {
    it('should reject empty name', () => {
      expect(() => createTestUser({ name: '' })).toThrow(DomainError)
      expect(() => createTestUser({ name: '  ' })).toThrow(DomainError)
    })

    it('should reject name exceeding 255 characters', () => {
      const longName = 'a'.repeat(256)
      expect(() => createTestUser({ name: longName })).toThrow(DomainError)
    })
  })

  describe('changeName', () => {
    it('should update user name', () => {
      const user = createTestUser({ name: 'Old Name' })

      user.changeName('New Name')

      expect(user.name).toBe('New Name')
    })

    it('should validate new name', () => {
      const user = createTestUser()

      expect(() => user.changeName('')).toThrow(DomainError)
      expect(() => user.changeName('a'.repeat(256))).toThrow(DomainError)
    })
  })

  describe('reconstitute', () => {
    it('should recreate user from persistence data', () => {
      const email = Email.create('user@example.com')
      const createdAt = new Date('2024-01-01')

      const user = User.reconstitute({
        id: 'test-id-123',
        email,
        name: 'John Doe',
        createdAt,
      })

      expect(user.id.toString()).toBe('test-id-123')
      expect(user.email).toBe(email)
      expect(user.name).toBe('John Doe')
      expect(user.createdAt).toBe(createdAt)
    })
  })
})
