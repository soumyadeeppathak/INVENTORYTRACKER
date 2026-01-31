import { randomBytes } from 'node:crypto'
import { DomainError } from '../errors/domain-error'

export class UserId {
  private constructor(private readonly value: string) {}

  static create(value: string): UserId {
    if (!UserId.isValid(value)) {
      throw new DomainError(`Invalid UserId format: ${value}`)
    }
    return new UserId(value)
  }

  static generate(): UserId {
    // Generate cuid-like ID (similar to Prisma's default)
    const timestamp = Date.now().toString(36)
    const random = randomBytes(12).toString('base64url')
    return new UserId(`c${timestamp}${random}`.slice(0, 25))
  }

  private static isValid(value: string): boolean {
    // Basic validation: non-empty string, reasonable length
    return typeof value === 'string' && value.length > 0 && value.length <= 50
  }

  toString(): string {
    return this.value
  }

  equals(other: UserId): boolean {
    return this.value === other.value
  }
}
