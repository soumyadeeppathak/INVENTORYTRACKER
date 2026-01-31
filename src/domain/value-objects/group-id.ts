import { randomBytes } from 'node:crypto'
import { DomainError } from '../errors/domain-error'

export class GroupId {
  private constructor(private readonly value: string) {}

  static create(value: string): GroupId {
    if (!GroupId.isValid(value)) {
      throw new DomainError(`Invalid GroupId format: ${value}`)
    }
    return new GroupId(value)
  }

  static generate(): GroupId {
    const timestamp = Date.now().toString(36)
    const random = randomBytes(12).toString('base64url')
    return new GroupId(`c${timestamp}${random}`.slice(0, 25))
  }

  private static isValid(value: string): boolean {
    return typeof value === 'string' && value.length > 0 && value.length <= 50
  }

  toString(): string {
    return this.value
  }

  equals(other: GroupId): boolean {
    return this.value === other.value
  }
}
