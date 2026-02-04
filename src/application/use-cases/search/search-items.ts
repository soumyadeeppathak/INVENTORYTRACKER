import type { ItemRepository, SearchResultItem } from '@/src/application/ports/item-repository'
import { UserId } from '@/src/domain/value-objects/user-id'
import { DomainError } from '@/src/domain/errors/domain-error'

export interface SearchItemsInput {
    userId: string
    query: string
    limit?: number
}

export interface SearchItemsOutput {
    results: SearchResultItem[]
    query: string
}

export class SearchItemsUseCase {
    constructor(private readonly itemRepository: ItemRepository) { }

    async execute(input: SearchItemsInput): Promise<SearchItemsOutput> {
        const { userId, query, limit = 20 } = input

        // Validate query length
        const trimmedQuery = query.trim()
        if (trimmedQuery.length < 2) {
            throw new DomainError('Search query must be at least 2 characters')
        }

        const userIdVo = UserId.create(userId)

        const results = await this.itemRepository.searchWithContext(
            userIdVo,
            trimmedQuery,
            limit
        )

        return {
            results,
            query: trimmedQuery,
        }
    }
}
