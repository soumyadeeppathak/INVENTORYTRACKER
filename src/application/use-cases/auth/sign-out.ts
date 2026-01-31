import type { SessionRepository } from '@/src/application/ports/session-repository'

export interface SignOutInput {
  sessionId: string
}

export interface SignOutOutput {
  success: boolean
}

export class SignOutUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(input: SignOutInput): Promise<SignOutOutput> {
    // Delete session from database
    await this.sessionRepository.delete(input.sessionId)

    return { success: true }
  }
}
