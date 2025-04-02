
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Calendar, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Add Item',
      path: '/add',
      icon: PlusCircle
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: Calendar
    },
    {
      name: 'Insights',
      path: '/insights',
      icon: BarChart2
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              isActive(item.path) ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn(
              "w-6 h-6 mb-1",
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
            )} />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
