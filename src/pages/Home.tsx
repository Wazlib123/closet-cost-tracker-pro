
import React, { useState } from 'react';
import { useCloset } from '@/context/ClosetContext';
import { Category } from '@/types';
import CategoryFilter from '@/components/CategoryFilter';
import ItemCard from '@/components/ItemCard';
import EmptyState from '@/components/EmptyState';
import { formatCurrency } from '@/lib/formatters';
import { Bell } from 'lucide-react';

const Home = () => {
  const { items, getCostPerWear, getUnwornItems } = useCloset();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  // Filter items by selected category
  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);
  
  // Calculate total closet value
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);
  
  // Get unworn items in the last 30 days
  const unwornItems = getUnwornItems(30);
  
  return (
    <div className="pb-20">
      <header className="py-6">
        <h1 className="text-2xl font-bold mb-2">Your Closet</h1>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {items.length} items · {formatCurrency(totalValue)}
          </p>
        </div>
      </header>
      
      {/* Nudges for unworn items */}
      {unwornItems.length > 0 && (
        <div className="bg-accent/50 rounded-lg p-4 mb-6 animate-scale-in">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-accent-foreground">
                {unwornItems.length} items haven't been worn recently
              </p>
              <p className="text-sm text-accent-foreground/80">
                Consider wearing {unwornItems[0].name} soon to get more value.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Category filter */}
      <div className="mb-6">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>
      
      {/* Items grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        items.length > 0 ? (
          <p className="text-center py-12 text-muted-foreground">
            No items in this category yet.
          </p>
        ) : (
          <EmptyState
            title="Your closet is empty"
            description="Start by adding your first clothing item to track your wardrobe value."
            action={{
              label: "Add your first item",
              to: "/add",
            }}
          />
        )
      )}
    </div>
  );
};

export default Home;
