interface Props {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export const CategoryFilters = ({ categories, activeCategory, onCategoryChange }: Props) => {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};