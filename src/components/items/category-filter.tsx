'use client'

interface Category {
    id: string
    name: string
    emoji: string
}

interface CategoryFilterProps {
    categories: Category[]
    selectedCategoryId: string | null
    onSelectCategory: (categoryId: string | null) => void
}

export function CategoryFilter({ categories, selectedCategoryId, onSelectCategory }: CategoryFilterProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
                type="button"
                onClick={() => onSelectCategory(null)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategoryId === null
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                All
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategoryId === category.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <span role="img" aria-label={category.name}>
                        {category.emoji}
                    </span>
                    {category.name}
                </button>
            ))}
        </div>
    )
}
