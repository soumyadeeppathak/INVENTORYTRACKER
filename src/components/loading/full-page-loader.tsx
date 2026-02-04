export function FullPageLoader() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
            <div className="text-5xl mb-4">📦</div>
            <div className="flex items-center gap-2">
                <svg
                    className="animate-spin h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                <span className="text-gray-600 font-medium">Loading...</span>
            </div>
        </div>
    )
}
