
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClothingItem, WearEvent, Category } from '@/types';
import { toast } from "@/components/ui/sonner";

// Initialize a unique ID generator
const generateId = () => Math.random().toString(36).substring(2, 11);

// Define the context shape
interface ClosetContextProps {
  items: ClothingItem[];
  wearEvents: WearEvent[];
  addItem: (item: Omit<ClothingItem, 'id'>) => void;
  updateItem: (item: ClothingItem) => void;
  deleteItem: (id: string) => void;
  logWear: (itemId: string, date?: string, notes?: string) => void;
  deleteWear: (wearId: string) => void;
  getItemWears: (itemId: string) => WearEvent[];
  getCostPerWear: (itemId: string) => number;
  getMostWorn: (limit?: number) => ClothingItem[];
  getBestValue: (limit?: number) => { item: ClothingItem; costPerWear: number }[];
  getUnwornItems: (daysThreshold?: number) => ClothingItem[];
  getWearGoalProgress: (itemId: string) => number;
  filterItemsByCategory: (category: Category) => ClothingItem[];
}

// Create the context
const ClosetContext = createContext<ClosetContextProps | undefined>(undefined);

// Storage keys for persistence
const ITEMS_STORAGE_KEY = 'closet-cost-tracker-items';
const WEARS_STORAGE_KEY = 'closet-cost-tracker-wears';

export const ClosetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [items, setItems] = useState<ClothingItem[]>(() => {
    try {
      const storedItems = localStorage.getItem(ITEMS_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Error loading items from localStorage:', error);
      return [];
    }
  });

  const [wearEvents, setWearEvents] = useState<WearEvent[]>(() => {
    try {
      const storedWears = localStorage.getItem(WEARS_STORAGE_KEY);
      return storedWears ? JSON.parse(storedWears) : [];
    } catch (error) {
      console.error('Error loading wear events from localStorage:', error);
      return [];
    }
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(WEARS_STORAGE_KEY, JSON.stringify(wearEvents));
  }, [wearEvents]);

  // CRUD operations for items
  const addItem = (itemData: Omit<ClothingItem, 'id'>) => {
    const newItem: ClothingItem = {
      ...itemData,
      id: generateId(),
    };
    setItems(prevItems => [...prevItems, newItem]);
    toast.success(`Added ${newItem.name} to your closet!`);
  };

  const updateItem = (updatedItem: ClothingItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    toast.success(`Updated ${updatedItem.name}`);
  };

  const deleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    // Also delete all associated wear events
    setWearEvents(prevWears => prevWears.filter(wear => wear.itemId !== id));
    if (itemToDelete) {
      toast.success(`Removed ${itemToDelete.name} from your closet`);
    }
  };

  // Wear event operations
  const logWear = (itemId: string, date = new Date().toISOString(), notes?: string) => {
    const newWear: WearEvent = {
      id: generateId(),
      itemId,
      date,
      notes
    };
    setWearEvents(prevWears => [...prevWears, newWear]);
    const item = items.find(i => i.id === itemId);
    if (item) {
      toast.success(`Logged wear for ${item.name}`);
    }
  };

  const deleteWear = (wearId: string) => {
    setWearEvents(prevWears => prevWears.filter(wear => wear.id !== wearId));
  };

  // Helper functions
  const getItemWears = (itemId: string) => {
    return wearEvents.filter(wear => wear.itemId === itemId);
  };

  const getCostPerWear = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    const wearCount = getItemWears(itemId).length;
    
    if (!item || wearCount === 0) return item?.price || 0;
    
    return item.price / wearCount;
  };

  const getMostWorn = (limit = 5) => {
    // Create a map of item IDs to wear counts
    const wearCounts = new Map<string, number>();
    items.forEach(item => {
      wearCounts.set(item.id, getItemWears(item.id).length);
    });
    
    // Sort items by wear count (descending)
    return [...items]
      .sort((a, b) => (wearCounts.get(b.id) || 0) - (wearCounts.get(a.id) || 0))
      .slice(0, limit);
  };

  const getBestValue = (limit = 5) => {
    // Calculate cost per wear for all items
    const itemsWithCPW = items
      .map(item => ({
        item,
        costPerWear: getCostPerWear(item.id)
      }))
      .filter(({ costPerWear }) => costPerWear > 0 && isFinite(costPerWear));
    
    // Sort by cost per wear (ascending = better value)
    return itemsWithCPW
      .sort((a, b) => a.costPerWear - b.costPerWear)
      .slice(0, limit);
  };

  const getUnwornItems = (daysThreshold = 30) => {
    const now = new Date();
    const threshold = new Date(now.setDate(now.getDate() - daysThreshold));
    
    return items.filter(item => {
      const wears = getItemWears(item.id);
      if (wears.length === 0) return true; // Never worn
      
      // Get the date of most recent wear
      const dates = wears.map(wear => new Date(wear.date));
      const mostRecent = new Date(Math.max(...dates.map(d => d.getTime())));
      
      return mostRecent < threshold;
    });
  };

  const getWearGoalProgress = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || !item.wearGoal) return 0;
    
    const wearCount = getItemWears(itemId).length;
    return Math.min(wearCount / item.wearGoal, 1); // Cap at 100%
  };

  const filterItemsByCategory = (category: Category) => {
    return items.filter(item => item.category === category);
  };

  const value = {
    items,
    wearEvents,
    addItem,
    updateItem,
    deleteItem,
    logWear,
    deleteWear,
    getItemWears,
    getCostPerWear,
    getMostWorn,
    getBestValue,
    getUnwornItems,
    getWearGoalProgress,
    filterItemsByCategory
  };

  return <ClosetContext.Provider value={value}>{children}</ClosetContext.Provider>;
};

export const useCloset = () => {
  const context = useContext(ClosetContext);
  if (context === undefined) {
    throw new Error('useCloset must be used within a ClosetProvider');
  }
  return context;
};
