import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateLocationUseCase } from '@/src/application/use-cases/locations/create-location'
import type { LocationRepository } from '@/src/application/ports/location-repository'
import type { GroupRepository } from '@/src/application/ports/group-repository'
import { DomainError } from '@/src/domain/errors/domain-error'

describe('CreateLocationUseCase', () => {
  let useCase: CreateLocationUseCase
  let mockLocationRepository: LocationRepository
  let mockGroupRepository: GroupRepository

  beforeEach(() => {
    mockLocationRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByGroupId: vi.fn(),
      findByGroupIdWithItemCounts: vi.fn(),
      delete: vi.fn(),
      getItemCount: vi.fn(),
    }

    mockGroupRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByUserIdWithCounts: vi.fn(),
      delete: vi.fn(),
      addMember: vi.fn(),
      removeMember: vi.fn(),
      getMemberCount: vi.fn(),
      getMembers: vi.fn(),
      getMemberRole: vi.fn(),
      isMember: vi.fn(),
    }

    useCase = new CreateLocationUseCase(mockLocationRepository, mockGroupRepository)
  })

  it('should create a location when user is a member of the group', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)

    const result = await useCase.execute({
      userId: 'user-123',
      groupId: 'group-123',
      name: 'Kitchen',
      emoji: '🍳',
    })

    expect(result.locationId).toBeDefined()
    expect(mockGroupRepository.isMember).toHaveBeenCalledOnce()
    expect(mockLocationRepository.save).toHaveBeenCalledOnce()

    const savedLocation = vi.mocked(mockLocationRepository.save).mock.calls[0][0]
    expect(savedLocation.name).toBe('Kitchen')
    expect(savedLocation.emoji.toString()).toBe('🍳')
  })

  it('should reject when user is not a member of the group', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(false)

    await expect(
      useCase.execute({
        userId: 'user-123',
        groupId: 'group-123',
        name: 'Kitchen',
        emoji: '🍳',
      }),
    ).rejects.toThrow('You are not a member of this group')
  })

  it('should reject empty location name', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)

    await expect(
      useCase.execute({
        userId: 'user-123',
        groupId: 'group-123',
        name: '',
        emoji: '🍳',
      }),
    ).rejects.toThrow(DomainError)
  })

  it('should reject invalid emoji', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)

    await expect(
      useCase.execute({
        userId: 'user-123',
        groupId: 'group-123',
        name: 'Kitchen',
        emoji: 'not-an-emoji',
      }),
    ).rejects.toThrow(DomainError)
  })

  it('should reject name exceeding 255 characters', async () => {
    vi.mocked(mockGroupRepository.isMember).mockResolvedValue(true)
    const longName = 'a'.repeat(256)

    await expect(
      useCase.execute({
        userId: 'user-123',
        groupId: 'group-123',
        name: longName,
        emoji: '🍳',
      }),
    ).rejects.toThrow(DomainError)
  })
})
