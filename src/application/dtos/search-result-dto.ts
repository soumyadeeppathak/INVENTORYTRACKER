export interface SearchResultDTO {
    item: {
        id: string
        name: string
        emoji: string
        quantity: number
    }
    location: {
        id: string
        name: string
        emoji: string
    }
    group: {
        id: string
        name: string
        emoji: string
    }
}

export interface SearchResultGroup {
    group: {
        id: string
        name: string
        emoji: string
    }
    locations: {
        location: {
            id: string
            name: string
            emoji: string
        }
        items: {
            id: string
            name: string
            emoji: string
            quantity: number
        }[]
    }[]
}
