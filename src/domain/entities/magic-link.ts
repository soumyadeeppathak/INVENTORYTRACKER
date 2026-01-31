import { randomBytes } from 'node:crypto'
import { DomainError } from '../errors/domain-error'
import type { Email } from '../value-objects/email'
import type { UserId } from '../value-objects/user-id'

export class MagicLink {
  private constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly email: Email,
    public readonly userId: UserId | null,
    public readonly expiresAt: Date,
    private _usedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    email: Email
    userId?: UserId | null
    expiresInMinutes?: number
  }): MagicLink {
    const token = MagicLink.generateToken()
    const expiresInMinutes = props.expiresInMinutes ?? 15
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000)

    return new MagicLink(
      MagicLink.generateId(),
      token,
      props.email,
      props.userId ?? null,
      expiresAt,
      null,
      new Date(),
    )
  }

  static reconstitute(props: {
    id: string
    token: string
    email: Email
    userId: UserId | null
    expiresAt: Date
    usedAt: Date | null
    createdAt: Date
  }): MagicLink {
    return new MagicLink(
      props.id,
      props.token,
      props.email,
      props.userId,
      props.expiresAt,
      props.usedAt,
      props.createdAt,
    )
  }

  private static generateId(): string {
    const timestamp = Date.now().toString(36)
    const random = randomBytes(12).toString('base64url')
    return `c${timestamp}${random}`.slice(0, 25)
  }

  private static generateToken(): string {
    return randomBytes(32).toString('base64url')
  }

  get usedAt(): Date | null {
    return this._usedAt
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt
  }

  get isUsed(): boolean {
    return this._usedAt !== null
  }

  get isValid(): boolean {
    return !this.isExpired && !this.isUsed
  }

  markAsUsed(): void {
    if (this.isUsed) {
      throw new DomainError('Magic link has already been used')
    }

    if (this.isExpired) {
      throw new DomainError('Magic link has expired')
    }

    this._usedAt = new Date()
  }
}
