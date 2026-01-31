import { randomBytes } from 'node:crypto'
import { DomainError } from '../errors/domain-error'

export class CategoryId {
  private constructor(private readonly value: string) {}

  static create(value: string): CategoryId {
    if (!CategoryId.isValid(value)) {
      throw new DomainError(`Invalid CategoryId format: ${value}`)
    }
    return new CategoryId(value)
  }

  static generate(): CategoryId {
    const timestamp = Date.now().toString(36)
    const random = randomBytes(12).toString('base64url')
    return new CategoryId(`c${timestamp}${random}`.slice(0, 25))
  }

  private static isValid(value: string): boolean {
    return typeof value === 'string' && value.length > 0 && value.length <= 50
  }

  toString(): string {
    return this.value
  }

  equals(other: CategoryId): boolean {
    return this.value === other.value
  }
}
