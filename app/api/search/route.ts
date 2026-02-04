import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { SearchItemsUseCase } from '@/src/application/use-cases/search/search-items'
import { PrismaItemRepository } from '@/src/infrastructure/persistence/repositories/prisma-item-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

const SearchQuerySchema = z.object({
    q: z.string().min(2, 'Search query must be at least 2 characters'),
    limit: z.coerce.number().int().min(1).max(50).optional().default(20),
})

/**
 * GET /api/search?q=query&limit=20 - Search items across all user's groups
 */
export async function GET(request: Request) {
    try {
        const user = await requireAuth()

        const { searchParams } = new URL(request.url)
        const parsed = SearchQuerySchema.safeParse({
            q: searchParams.get('q'),
            limit: searchParams.get('limit'),
        })

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
        }

        const itemRepository = new PrismaItemRepository(db)
        const useCase = new SearchItemsUseCase(itemRepository)

        const result = await useCase.execute({
            userId: user.id.toString(),
            query: parsed.data.q,
            limit: parsed.data.limit,
        })

        return NextResponse.json(result)
    } catch (error) {
        if (error instanceof DomainError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        console.error('Error searching items:', error)
        return NextResponse.json({ error: 'Failed to search items' }, { status: 500 })
    }
}
