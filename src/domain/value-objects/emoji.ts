import { DomainError } from '../errors/domain-error'

export class Emoji {
  private constructor(private readonly value: string) {}

  static create(value: string): Emoji {
    const trimmed = value.trim()

    if (!Emoji.isValid(trimmed)) {
      throw new DomainError(`Invalid emoji: ${value}`)
    }

    return new Emoji(trimmed)
  }

  private static isValid(value: string): boolean {
    if (!value || value.length === 0) {
      return false
    }

    // Check if string contains only emoji characters
    // Matches emoji presentation characters including compound emojis with ZWJ
    const emojiRegex =
      /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})(\u200D?(\p{Emoji_Presentation}|\p{Extended_Pictographic})|\uFE0F|\p{Emoji_Modifier})*$/u

    // Also check that it's not just numbers or letters
    const nonEmojiRegex = /^[a-zA-Z0-9\s!@#$%^&*()]+$/

    return emojiRegex.test(value) && !nonEmojiRegex.test(value)
  }

  toString(): string {
    return this.value
  }

  equals(other: Emoji): boolean {
    return this.value === other.value
  }
}
