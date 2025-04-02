
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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-t-2 border-primary/30 shadow-md z-10">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              isActive(item.path) 
                ? "text-primary font-bold y2k-shadow" 
                : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "p-2 rounded-full mb-1",
              isActive(item.path) 
                ? "bg-gradient-to-r from-pink-200 to-purple-200 shadow-sm" 
                : ""
            )}>
              <item.icon className={cn(
                "w-5 h-5",
                isActive(item.path) ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
