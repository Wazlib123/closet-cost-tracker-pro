
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useCloset } from '@/context/ClosetContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EmptyState from '@/components/EmptyState';

const Calendar = () => {
  const { items, wearEvents } = useCloset();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Group wear events by date
  const wearsByDate = wearEvents.reduce((acc, wear) => {
    const date = wear.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(wear);
    return acc;
  }, {} as Record<string, typeof wearEvents>);
  
  // Navigate to previous/next month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  // Handle clicking on a day with wear events
  const handleDayClick = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    if (wearsByDate[dateString]?.length > 0) {
      // For now, just navigate to the first item
      const firstWear = wearsByDate[dateString][0];
      navigate(`/item/${firstWear.itemId}`);
    }
  };
  
  // Render each day cell
  const renderDay = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    const wearsForDay = wearsByDate[dateString] || [];
    const hasWears = wearsForDay.length > 0;
    
    return (
      <div
        key={dateString}
        className={`aspect-square flex flex-col p-1 border rounded-md ${
          hasWears ? 'cursor-pointer hover:bg-primary/10' : ''
        }`}
        onClick={() => hasWears && handleDayClick(day)}
      >
        <div className="text-xs mb-1">{format(day, 'd')}</div>
        {hasWears && (
          <div className="flex-grow flex flex-col gap-1 overflow-hidden">
            {wearsForDay.slice(0, 3).map((wear) => {
              const item = items.find(i => i.id === wear.itemId);
              return (
                <div
                  key={wear.id}
                  className="bg-primary/20 rounded text-xs p-1 truncate"
                  title={item?.name}
                >
                  {item?.name?.slice(0, 10)}
                  {item?.name && item.name.length > 10 ? '...' : ''}
                </div>
              );
            })}
            {wearsForDay.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{wearsForDay.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="pb-20">
      <header className="py-6">
        <h1 className="text-2xl font-bold mb-2">Calendar</h1>
        <p className="text-muted-foreground">
          Track when you wear your items
        </p>
      </header>
      
      {wearEvents.length > 0 ? (
        <>
          {/* Month navigation */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousMonth}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before the start of the month */}
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="aspect-square" />
            ))}
            
            {/* Days of the month */}
            {daysInMonth.map(renderDay)}
            
            {/* Empty cells for days after the end of the month */}
            {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
              <div key={`empty-end-${index}`} className="aspect-square" />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No wear history yet"
          description="Start tracking when you wear your items to see them on the calendar."
          action={{
            label: "Go to your closet",
            to: "/",
            icon: <CalendarIcon className="w-4 h-4 mr-2" />,
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
