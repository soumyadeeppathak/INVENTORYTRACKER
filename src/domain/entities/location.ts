import { DomainError } from '../errors/domain-error'
import type { Emoji } from '../value-objects/emoji'
import type { GroupId } from '../value-objects/group-id'
import { LocationId } from '../value-objects/location-id'

export class Location {
  private constructor(
    public readonly id: LocationId,
    private _name: string,
    private _emoji: Emoji,
    public readonly groupId: GroupId,
    public readonly createdAt: Date,
  ) {}

  static create(props: { name: string; emoji: Emoji; groupId: GroupId }): Location {
    Location.validateName(props.name)

    return new Location(LocationId.generate(), props.name, props.emoji, props.groupId, new Date())
  }

  static reconstitute(props: {
    id: string
    name: string
    emoji: Emoji
    groupId: GroupId
    createdAt: Date
  }): Location {
    return new Location(
      LocationId.create(props.id),
      props.name,
      props.emoji,
      props.groupId,
      props.createdAt,
    )
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError('Location name cannot be empty')
    }

    if (name.length > 255) {
      throw new DomainError('Location name must not exceed 255 characters')
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
      Location.validateName(props.name)
      this._name = props.name
    }

    if (props.emoji !== undefined) {
      this._emoji = props.emoji
    }
  }
}
