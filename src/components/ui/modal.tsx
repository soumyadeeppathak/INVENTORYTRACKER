'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
    size?: 'default' | 'full'
}

export function Modal({ open, onClose, title, children, size = 'default' }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (open) {
            dialog.showModal()
        } else {
            dialog.close()
        }
    }, [open])

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        const handleCancel = (e: Event) => {
            e.preventDefault()
            onClose()
        }

        dialog.addEventListener('cancel', handleCancel)
        return () => dialog.removeEventListener('cancel', handleCancel)
    }, [onClose])

    const handleBackdropClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        const dialog = dialogRef.current
        if (dialog && e.target === dialog) {
            onClose()
        }
    }

    const sizeClasses = {
        default: 'max-w-md w-full mx-4 sm:mx-auto',
        full: 'w-full h-full m-0 max-w-none',
    }

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    handleBackdropClick(e)
                }
            }}
            className="backdrop:bg-black/50 bg-transparent p-0"
        >
            <div className={`bg-white ${size === 'full' ? 'h-full' : 'rounded-lg shadow-xl'} ${sizeClasses[size]}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className={size === 'full' ? 'p-4 overflow-y-auto h-[calc(100%-64px)]' : 'p-4'}>{children}</div>
            </div>
        </dialog>
    )
}
