import { randomBytes } from 'node:crypto'
import { DomainError } from '../errors/domain-error'
import type { GroupId } from '../value-objects/group-id'
import type { UserId } from '../value-objects/user-id'

export class GroupInvite {
  private constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly email: string,
    public readonly groupId: GroupId,
    public readonly invitedBy: UserId,
    public readonly expiresAt: Date,
    private _acceptedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    email: string
    groupId: GroupId
    invitedBy: UserId
    expiresInDays?: number
  }): GroupInvite {
    const token = GroupInvite.generateToken()
    const expiresInDays = props.expiresInDays ?? 7
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)

    return new GroupInvite(
      GroupInvite.generateId(),
      token,
      props.email,
      props.groupId,
      props.invitedBy,
      expiresAt,
      null,
      new Date(),
    )
  }

  static reconstitute(props: {
    id: string
    token: string
    email: string
    groupId: GroupId
    invitedBy: UserId
    expiresAt: Date
    acceptedAt: Date | null
    createdAt: Date
  }): GroupInvite {
    return new GroupInvite(
      props.id,
      props.token,
      props.email,
      props.groupId,
      props.invitedBy,
      props.expiresAt,
      props.acceptedAt,
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

  get acceptedAt(): Date | null {
    return this._acceptedAt
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt
  }

  get isAccepted(): boolean {
    return this._acceptedAt !== null
  }

  get isValid(): boolean {
    return !this.isExpired && !this.isAccepted
  }

  markAsAccepted(): void {
    if (this.isAccepted) {
      throw new DomainError('Invite has already been accepted')
    }

    if (this.isExpired) {
      throw new DomainError('Invite has expired')
    }

    this._acceptedAt = new Date()
  }
}
