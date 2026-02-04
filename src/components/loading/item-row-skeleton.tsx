export function ItemRowSkeleton() {
    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                <div className="w-10 h-6 bg-gray-200 rounded" />
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
            </div>
            <div className="w-6 h-6 bg-gray-100 rounded" />
        </div>
    )
}

export function ItemListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <ItemRowSkeleton key={i} />
            ))}
        </div>
    )
}
