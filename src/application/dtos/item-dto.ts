export interface CategoryDTO {
  id: string
  name: string
  emoji: string
  isSystem: boolean
}

export interface ItemDTO {
  id: string
  name: string
  emoji: string
  quantity: number
  category: CategoryDTO | null
  locationId: string
  createdAt: string
  updatedAt: string
}
