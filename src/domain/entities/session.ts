import { randomBytes } from 'node:crypto'
import type { UserId } from '../value-objects/user-id'

export class Session {
  private constructor(
    public readonly id: string,
    public readonly userId: UserId,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
  ) {}

  static create(props: { userId: UserId; expiresInDays?: number }): Session {
    const expiresInDays = props.expiresInDays ?? 30
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)

    return new Session(Session.generateId(), props.userId, expiresAt, new Date())
  }

  static reconstitute(props: {
    id: string
    userId: UserId
    expiresAt: Date
    createdAt: Date
  }): Session {
    return new Session(props.id, props.userId, props.expiresAt, props.createdAt)
  }

  private static generateId(): string {
    const timestamp = Date.now().toString(36)
    const random = randomBytes(12).toString('base64url')
    return `c${timestamp}${random}`.slice(0, 25)
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt
  }

  get isValid(): boolean {
    return !this.isExpired
  }
}
