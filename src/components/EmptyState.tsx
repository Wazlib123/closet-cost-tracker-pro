
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Hanger, PlusCircle } from 'lucide-react';

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
      <div className="bg-muted rounded-full p-6 mb-6">
        <Hanger className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-xs">{description}</p>
      
      {action && (
        <Button asChild>
          <Link to={action.to} className="flex items-center gap-2">
            {action.icon || <PlusCircle className="w-4 h-4" />}
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
