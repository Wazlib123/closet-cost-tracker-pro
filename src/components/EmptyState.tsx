
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, PlusCircle, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    to: string;
    icon?: React.ReactNode;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh] animate-fade-in">
      <div className="rounded-full p-6 mb-6 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 border-2 border-white shadow-lg">
        <ShoppingBag className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-xl font-bold mb-2 y2k-shadow">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-xs">{description}</p>
      
      {action && (
        <Button asChild className="bubble-button px-6 py-2 font-medium">
          <Link to={action.to} className="flex items-center gap-2">
            {action.icon || <PlusCircle className="w-4 h-4" />}
            {action.label}
          </Link>
        </Button>
      )}
      
      <div className="absolute -z-10 w-32 h-32 rounded-full bg-pink-200/50 blur-2xl top-1/4 -left-10"></div>
      <div className="absolute -z-10 w-32 h-32 rounded-full bg-purple-200/50 blur-2xl bottom-1/3 -right-10"></div>
    </div>
  );
};

export default EmptyState;
