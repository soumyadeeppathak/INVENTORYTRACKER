export interface GroupDTO {
  id: string
  name: string
  emoji: string
  locationCount: number
  itemCount: number
  memberCount: number
  role: 'owner' | 'member'
}

export interface LocationDTO {
  id: string
  name: string
  emoji: string
  itemCount: number
}

export interface MemberDTO {
  id: string
  name: string
  email: string
  role: 'owner' | 'member'
  joinedAt: Date
}

export interface GroupDetailDTO extends GroupDTO {
  locations: LocationDTO[]
  members: MemberDTO[]
}
