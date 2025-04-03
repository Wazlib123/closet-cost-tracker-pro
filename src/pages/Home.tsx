
import React, { useState } from 'react';
import { useCloset } from '@/context/ClosetContext';
import { Category } from '@/types';
import CategoryFilter from '@/components/CategoryFilter';
import ItemCard from '@/components/ItemCard';
import EmptyState from '@/components/EmptyState';
import { formatCurrency } from '@/lib/formatters';
import { Bell, Sparkles } from 'lucide-react';

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
    <div className="pb-20 relative">
      {/* Y2K decorative elements */}
      <div className="absolute -z-10 w-40 h-40 rounded-full bg-pink-200/40 blur-3xl top-10 -left-20"></div>
      <div className="absolute -z-10 w-40 h-40 rounded-full bg-purple-200/30 blur-3xl bottom-40 -right-20"></div>
      
      <header className="py-6 mt-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2 y2k-shadow">
          <Sparkles className="w-5 h-5 text-pink-400" />
          Your Closet
          <Sparkles className="w-5 h-5 text-pink-400" />
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground font-medium">
            {items.length} items · {formatCurrency(totalValue)}
          </p>
        </div>
      </header>
      
      {/* Nudges for unworn items */}
      {unwornItems.length > 0 && (
        <div className="bg-gradient-to-r from-accent/80 to-pink-100 rounded-lg p-4 mb-6 animate-scale-in border-2 border-white/50 shadow-md">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-accent-foreground">
                {unwornItems.length} {unwornItems.length === 1 ? 'item' : 'items'} haven't been worn recently
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
          <p className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-xl border border-primary/20 shadow-sm">
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
