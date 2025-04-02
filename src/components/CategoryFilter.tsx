
import React from 'react';
import { CATEGORIES, Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: Category | 'All';
  onChange: (category: Category | 'All') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onChange }) => {
  const allCategories: (Category | 'All')[] = ['All', ...CATEGORIES];
  
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              "px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors",
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
