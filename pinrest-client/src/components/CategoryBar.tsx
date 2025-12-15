interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryBar({ categories, selectedCategory, onSelectCategory }: CategoryBarProps) {
  return (
    <div className="mb-8 w-full overflow-hidden">
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap flex h-10 px-6 items-center justify-center rounded-full text-sm transition-all active:scale-95 ${
              selectedCategory === category
                ? 'bg-gray-900 text-white font-bold shadow-md'
                : 'bg-gray-100 text-gray-900 font-medium hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;
