import { DomainError } from '../errors/domain-error'
import type { CategoryId } from '../value-objects/category-id'
import type { Emoji } from '../value-objects/emoji'
import { ItemId } from '../value-objects/item-id'
import type { LocationId } from '../value-objects/location-id'

export class Item {
  private constructor(
    public readonly id: ItemId,
    private _name: string,
    private _emoji: Emoji,
    private _quantity: number,
    private _locationId: LocationId,
    private _categoryId: CategoryId | null,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: {
    name: string
    emoji: Emoji
    quantity?: number
    locationId: LocationId
    categoryId?: CategoryId | null
  }): Item {
    Item.validateName(props.name)
    const quantity = props.quantity ?? 1
    Item.validateQuantity(quantity)

    const now = new Date()
    return new Item(
      ItemId.generate(),
      props.name,
      props.emoji,
      quantity,
      props.locationId,
      props.categoryId ?? null,
      now,
      now,
    )
  }

  static reconstitute(props: {
    id: string
    name: string
    emoji: Emoji
    quantity: number
    locationId: LocationId
    categoryId: CategoryId | null
    createdAt: Date
    updatedAt: Date
  }): Item {
    return new Item(
      ItemId.create(props.id),
      props.name,
      props.emoji,
      props.quantity,
      props.locationId,
      props.categoryId,
      props.createdAt,
      props.updatedAt,
    )
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError('Item name cannot be empty')
    }

    if (name.length > 255) {
      throw new DomainError('Item name must not exceed 255 characters')
    }
  }

  private static validateQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new DomainError('Item quantity must be at least 1')
    }
  }

  get name(): string {
    return this._name
  }

  get emoji(): Emoji {
    return this._emoji
  }

  get quantity(): number {
    return this._quantity
  }

  get locationId(): LocationId {
    return this._locationId
  }

  get categoryId(): CategoryId | null {
    return this._categoryId
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  updateDetails(props: { name?: string; emoji?: Emoji; quantity?: number }): void {
    if (props.name !== undefined) {
      Item.validateName(props.name)
      this._name = props.name
      this._updatedAt = new Date()
    }

    if (props.emoji !== undefined) {
      this._emoji = props.emoji
      this._updatedAt = new Date()
    }

    if (props.quantity !== undefined) {
      Item.validateQuantity(props.quantity)
      this._quantity = props.quantity
      this._updatedAt = new Date()
    }
  }

  moveTo(newLocationId: LocationId): void {
    if (this._locationId.equals(newLocationId)) {
      // No-op if moving to same location
      return
    }

    this._locationId = newLocationId
    this._updatedAt = new Date()
  }

  assignCategory(categoryId: CategoryId | null): void {
    this._categoryId = categoryId
    this._updatedAt = new Date()
  }
}
