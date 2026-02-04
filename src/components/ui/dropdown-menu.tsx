'use client'

import type { ReactNode } from 'react'
import { useState, useRef, useEffect } from 'react'

interface DropdownMenuProps {
    trigger: ReactNode
    children: ReactNode
    align?: 'left' | 'right'
}

export function DropdownMenu({ trigger, children, align = 'right' }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const alignmentClasses = {
        left: 'left-0',
        right: 'right-0',
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && (
                <div
                    className={`absolute ${alignmentClasses[align]} mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10`}
                >
                    <div className="py-1" onClick={() => setIsOpen(false)}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}

interface DropdownMenuItemProps {
    onClick: () => void
    children: ReactNode
    variant?: 'default' | 'danger'
}

export function DropdownMenuItem({ onClick, children, variant = 'default' }: DropdownMenuItemProps) {
    const variantClasses = {
        default: 'text-gray-700 hover:bg-gray-100',
        danger: 'text-red-600 hover:bg-red-50',
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left px-4 py-2 text-sm ${variantClasses[variant]} transition-colors`}
        >
            {children}
        </button>
    )
}
