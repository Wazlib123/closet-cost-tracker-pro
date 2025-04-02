
import React from 'react';
import { Link } from 'react-router-dom';
import { ClothingItem } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCloset } from '@/context/ClosetContext';
import { formatCurrency } from '@/lib/formatters';
import { Star } from 'lucide-react';

interface ItemCardProps {
  item: ClothingItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { getItemWears, getCostPerWear, getWearGoalProgress } = useCloset();
  
  const wearCount = getItemWears(item.id).length;
  const costPerWear = getCostPerWear(item.id);
  const progress = getWearGoalProgress(item.id);
  
  return (
    <Link to={`/item/${item.id}`}>
      <Card className="h-full overflow-hidden hover:-translate-y-1 transition-all animate-fade-in y2k-card">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-secondary to-accent/30 relative">
          {item.photoUrl ? (
            <img 
              src={item.photoUrl} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow-md border border-pink-200">
            <Star className="w-3 h-3 text-pink-400" />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-base line-clamp-1">{item.name}</h3>
          <p className="text-sm text-primary mb-1 font-medium">{item.category}</p>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Worn: {wearCount}x</span>
            <span className="font-medium">{formatCurrency(item.price)}</span>
          </div>
          <p className="text-sm font-medium">
            Cost per wear: {formatCurrency(costPerWear)}
          </p>
        </CardContent>
        {item.wearGoal && (
          <CardFooter className="p-4 pt-0">
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span>Goal: {wearCount}/{item.wearGoal} wears</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <Progress value={progress * 100} className="h-1 bg-secondary" />
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default ItemCard;
