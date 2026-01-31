import { describe, it, expect } from 'vitest'
import { Email } from '@/src/domain/value-objects/email'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('Email Value Object', () => {
  it('should create valid email', () => {
    const email = Email.create('user@example.com')
    expect(email.toString()).toBe('user@example.com')
  })

  it('should normalize email to lowercase', () => {
    const email = Email.create('User@Example.COM')
    expect(email.toString()).toBe('user@example.com')
  })

  it('should trim whitespace', () => {
    const email = Email.create('  user@example.com  ')
    expect(email.toString()).toBe('user@example.com')
  })

  it('should reject invalid email format', () => {
    expect(() => Email.create('invalid')).toThrow(DomainError)
    expect(() => Email.create('invalid@')).toThrow(DomainError)
    expect(() => Email.create('@example.com')).toThrow(DomainError)
    expect(() => Email.create('invalid@example')).toThrow(DomainError)
  })

  it('should reject email exceeding 255 characters', () => {
    const longEmail = `${'a'.repeat(250)}@example.com`
    expect(() => Email.create(longEmail)).toThrow(DomainError)
    expect(() => Email.create(longEmail)).toThrow('must not exceed 255 characters')
  })

  it('should compare emails for equality', () => {
    const email1 = Email.create('user@example.com')
    const email2 = Email.create('user@example.com')
    const email3 = Email.create('other@example.com')

    expect(email1.equals(email2)).toBe(true)
    expect(email1.equals(email3)).toBe(false)
  })
})
