import { DomainError } from '../errors/domain-error'

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase()

    if (!Email.isValid(trimmed)) {
      throw new DomainError(`Invalid email format: ${value}`)
    }

    if (trimmed.length > 255) {
      throw new DomainError('Email must not exceed 255 characters')
    }

    return new Email(trimmed)
  }

  private static isValid(value: string): boolean {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}
