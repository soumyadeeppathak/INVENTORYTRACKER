export function LocationCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="w-5 h-5 bg-gray-100 rounded" />
            </div>
        </div>
    )
}

export function LocationListSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: count }).map((_, i) => (
                <LocationCardSkeleton key={i} />
            ))}
        </div>
    )
}
