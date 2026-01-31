import { DomainError } from '../errors/domain-error'
import type { Email } from '../value-objects/email'
import { UserId } from '../value-objects/user-id'

export class User {
  private constructor(
    public readonly id: UserId,
    private _email: Email,
    private _name: string,
    public readonly createdAt: Date,
  ) {}

  static create(props: { email: Email; name: string }): User {
    User.validateName(props.name)

    return new User(UserId.generate(), props.email, props.name, new Date())
  }

  static reconstitute(props: {
    id: string
    email: Email
    name: string
    createdAt: Date
  }): User {
    return new User(UserId.create(props.id), props.email, props.name, props.createdAt)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError('User name cannot be empty')
    }

    if (name.length > 255) {
      throw new DomainError('User name must not exceed 255 characters')
    }
  }

  get email(): Email {
    return this._email
  }

  get name(): string {
    return this._name
  }

  changeName(newName: string): void {
    User.validateName(newName)
    this._name = newName
  }
}
