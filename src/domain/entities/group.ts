import { DomainError } from '../errors/domain-error'
import type { Emoji } from '../value-objects/emoji'
import { GroupId } from '../value-objects/group-id'

export class Group {
  private constructor(
    public readonly id: GroupId,
    private _name: string,
    private _emoji: Emoji,
    public readonly createdAt: Date,
  ) {}

  static create(props: { name: string; emoji: Emoji }): Group {
    Group.validateName(props.name)

    return new Group(GroupId.generate(), props.name, props.emoji, new Date())
  }

  static reconstitute(props: {
    id: string
    name: string
    emoji: Emoji
    createdAt: Date
  }): Group {
    return new Group(GroupId.create(props.id), props.name, props.emoji, props.createdAt)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError('Group name cannot be empty')
    }

    if (name.length > 255) {
      throw new DomainError('Group name must not exceed 255 characters')
    }
  }

  get name(): string {
    return this._name
  }

  get emoji(): Emoji {
    return this._emoji
  }

  updateDetails(props: { name?: string; emoji?: Emoji }): void {
    if (props.name !== undefined) {
      Group.validateName(props.name)
      this._name = props.name
    }

    if (props.emoji !== undefined) {
      this._emoji = props.emoji
    }
  }
}
