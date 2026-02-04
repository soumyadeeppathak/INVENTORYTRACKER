import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { RemoveMemberUseCase } from '@/src/application/use-cases/groups/remove-member'
import { PrismaGroupRepository } from '@/src/infrastructure/persistence/repositories/prisma-group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

/**
 * DELETE /api/groups/[groupId]/members/[userId] - Remove a member from group
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ groupId: string; userId: string }> },
) {
  try {
    const user = await requireAuth()
    const { groupId, userId: targetUserId } = await params

    if (!groupId || !targetUserId) {
      return NextResponse.json({ error: 'Group ID and User ID are required' }, { status: 400 })
    }

    const groupRepository = new PrismaGroupRepository(db)
    const useCase = new RemoveMemberUseCase(groupRepository)

    const result = await useCase.execute({
      requesterId: user.id.toString(),
      groupId,
      targetUserId,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    console.error('Error removing member:', error)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}
