import { DomainError } from '../errors/domain-error'
import { CategoryId } from '../value-objects/category-id'
import type { Emoji } from '../value-objects/emoji'
import type { GroupId } from '../value-objects/group-id'

export class Category {
  private constructor(
    public readonly id: CategoryId,
    private _name: string,
    private _emoji: Emoji,
    public readonly isSystem: boolean,
    public readonly groupId: GroupId | null,
  ) {}

  static create(props: {
    name: string
    emoji: Emoji
    isSystem: boolean
    groupId?: GroupId | null
  }): Category {
    Category.validateName(props.name)

    return new Category(
      CategoryId.generate(),
      props.name,
      props.emoji,
      props.isSystem,
      props.groupId ?? null,
    )
  }

  static reconstitute(props: {
    id: string
    name: string
    emoji: Emoji
    isSystem: boolean
    groupId: GroupId | null
  }): Category {
    return new Category(
      CategoryId.create(props.id),
      props.name,
      props.emoji,
      props.isSystem,
      props.groupId,
    )
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError('Category name cannot be empty')
    }

    if (name.length > 255) {
      throw new DomainError('Category name must not exceed 255 characters')
    }
  }

  get name(): string {
    return this._name
  }

  get emoji(): Emoji {
    return this._emoji
  }

  updateDetails(props: { name?: string; emoji?: Emoji }): void {
    if (this.isSystem) {
      throw new DomainError('System categories cannot be modified')
    }

    if (props.name !== undefined) {
      Category.validateName(props.name)
      this._name = props.name
    }

    if (props.emoji !== undefined) {
      this._emoji = props.emoji
    }
  }
}
