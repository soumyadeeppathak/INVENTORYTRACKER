'use client'

import { useState } from 'react'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
  label?: string
}

const EMOJI_OPTIONS = [
  // People & Groups
  '💑', '👨‍👩‍👧', '👥', '🧑‍🤝‍🧑', '👋', '🙋',
  // Places
  '🏠', '🏡', '🏢', '🏬', '🏨', '🏕️', '🏖️', '🏔️',
  // Transport
  '🚗', '✈️', '🚌', '🚂', '🚢', '🚲',
  // Objects
  '📦', '🎒', '🧳', '🗂️', '📋', '🗃️',
  // Activities
  '🎮', '⚽', '🎯', '🏋️', '🎨', '🎵',
  // Nature
  '🌲', '🌴', '🌊', '⛰️', '🌸', '🌻',
]

export function EmojiPicker({ value, onChange, label }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (emoji: string) => {
    onChange(emoji)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 flex items-center justify-center text-4xl bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={value ? `Selected emoji: ${value}` : 'Pick an emoji'}
        aria-expanded={isOpen}
      >
        {value || '➕'}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute z-20 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-72">
            <div className="grid grid-cols-6 gap-1">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSelect(emoji)}
                  className={`w-10 h-10 flex items-center justify-center text-2xl rounded-lg hover:bg-gray-100 transition-colors ${
                    value === emoji ? 'bg-indigo-100' : ''
                  }`}
                  aria-label={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
