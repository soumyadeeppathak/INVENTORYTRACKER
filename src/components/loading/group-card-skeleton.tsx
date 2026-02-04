export function GroupCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="w-6 h-6 bg-gray-100 rounded" />
            </div>
        </div>
    )
}

export function GroupListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <GroupCardSkeleton key={i} />
            ))}
        </div>
    )
}
