import { randomBytes } from 'node:crypto'
import { DomainError } from '../errors/domain-error'

export class LocationId {
  private constructor(private readonly value: string) {}

  static create(value: string): LocationId {
    if (!LocationId.isValid(value)) {
      throw new DomainError(`Invalid LocationId format: ${value}`)
    }
    return new LocationId(value)
  }

  static generate(): LocationId {
    const timestamp = Date.now().toString(36)
    const random = randomBytes(12).toString('base64url')
    return new LocationId(`c${timestamp}${random}`.slice(0, 25))
  }

  private static isValid(value: string): boolean {
    return typeof value === 'string' && value.length > 0 && value.length <= 50
  }

  toString(): string {
    return this.value
  }

  equals(other: LocationId): boolean {
    return this.value === other.value
  }
}
