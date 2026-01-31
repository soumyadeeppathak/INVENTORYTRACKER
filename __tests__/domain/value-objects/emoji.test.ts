import { describe, it, expect } from 'vitest'
import { Emoji } from '@/src/domain/value-objects/emoji'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('Emoji Value Object', () => {
  it('should create valid single emoji', () => {
    const emoji = Emoji.create('📦')
    expect(emoji.toString()).toBe('📦')
  })

  it('should create compound emoji', () => {
    const emoji = Emoji.create('👨‍👩‍👧‍👦')
    expect(emoji.toString()).toBe('👨‍👩‍👧‍👦')
  })

  it('should create flag emoji', () => {
    const emoji = Emoji.create('🇺🇸')
    expect(emoji.toString()).toBe('🇺🇸')
  })

  it('should reject non-emoji string', () => {
    expect(() => Emoji.create('abc')).toThrow(DomainError)
    expect(() => Emoji.create('123')).toThrow(DomainError)
    expect(() => Emoji.create('!')).toThrow(DomainError)
  })

  it('should reject empty string', () => {
    expect(() => Emoji.create('')).toThrow(DomainError)
    expect(() => Emoji.create('  ')).toThrow(DomainError)
  })

  it('should compare emojis for equality', () => {
    const emoji1 = Emoji.create('📦')
    const emoji2 = Emoji.create('📦')
    const emoji3 = Emoji.create('🏠')

    expect(emoji1.equals(emoji2)).toBe(true)
    expect(emoji1.equals(emoji3)).toBe(false)
  })
})
