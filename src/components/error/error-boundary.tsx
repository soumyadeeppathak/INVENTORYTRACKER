'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/src/components/ui/button'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <span className="text-5xl mb-4" role="img" aria-hidden="true">
                        😵
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm">
                        An unexpected error occurred. Please try again or go back to the home page.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="primary" onClick={this.handleRetry}>
                            Try Again
                        </Button>
                        <Button variant="secondary" onClick={() => (window.location.href = '/')}>
                            Go Home
                        </Button>
                    </div>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre className="mt-6 p-4 bg-red-50 text-red-800 text-xs text-left rounded-lg max-w-lg overflow-auto">
                            {this.state.error.message}
                            {'\n'}
                            {this.state.error.stack}
                        </pre>
                    )}
                </div>
            )
        }

        return this.props.children
    }
}
