
import React from 'react';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { ChevronsUp, TrendingUp, Shirt, ArrowRight } from 'lucide-react';
import { useCloset } from '@/context/ClosetContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import EmptyState from '@/components/EmptyState';
import { Link } from 'react-router-dom';

const Insights = () => {
  const { 
    items, 
    wearEvents, 
    getCostPerWear, 
    getMostWorn, 
    getBestValue,
    filterItemsByCategory 
  } = useCloset();

  if (items.length === 0) {
    return (
      <EmptyState
        title="No items to analyze"
        description="Add items to your closet to see insights and analytics."
        action={{
          label: "Add your first item",
          to: "/add",
        }}
      />
    );
  }
  
  // Get most worn items
  const mostWorn = getMostWorn(5);
  
  // Get best value items
  const bestValue = getBestValue(5);
  
  // Calculate category breakdown
  const categoryData = CATEGORIES.map(category => {
    const itemsInCategory = filterItemsByCategory(category);
    const totalValue = itemsInCategory.reduce((sum, item) => sum + item.price, 0);
    const totalWears = itemsInCategory.reduce(
      (sum, item) => sum + wearEvents.filter(wear => wear.itemId === item.id).length, 
      0
    );
    
    return {
      name: category,
      count: itemsInCategory.length,
      value: totalValue,
      wears: totalWears,
      averageCostPerWear: totalWears === 0 ? 0 : totalValue / totalWears
    };
  }).filter(category => category.count > 0);
  
  // Prepare data for charts
  const mostWornData = mostWorn.map(item => ({
    name: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
    wears: wearEvents.filter(wear => wear.itemId === item.id).length
  }));
  
  const bestValueData = bestValue.map(({ item, costPerWear }) => ({
    name: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
    costPerWear: costPerWear
  }));
  
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#E5DEFF', '#D6BCFA'];
  
  return (
    <div className="pb-20">
      <header className="py-6">
        <h1 className="text-2xl font-bold mb-2">Insights</h1>
        <p className="text-muted-foreground">
          Analytics about your closet
        </p>
      </header>
      
      <div className="grid gap-6">
        {/* Quick stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Closet Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(items.reduce((sum, item) => sum + item.price, 0))}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Wears</p>
                <p className="text-2xl font-bold">{wearEvents.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg. Cost/Wear</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    wearEvents.length === 0 
                      ? 0 
                      : items.reduce((sum, item) => sum + item.price, 0) / wearEvents.length
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Most worn items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ChevronsUp className="w-5 h-5 mr-2 text-primary" />
              Most Worn Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {mostWorn.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mostWornData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip 
                      formatter={(value) => [`${value} wears`, 'Wears']}
                      cursor={{ fill: 'rgba(155, 135, 245, 0.1)' }}
                    />
                    <Bar dataKey="wears" fill="#9b87f5">
                      {mostWornData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                No wear data yet. Start logging wears!
              </p>
            )}
          </CardContent>
          {mostWorn.length > 0 && (
            <CardFooter>
              <Link to="/" className="text-sm text-primary flex items-center hover:underline">
                See all items <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </CardFooter>
          )}
        </Card>
        
        {/* Best value (lowest cost per wear) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Best Value Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {bestValue.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bestValueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${value.toFixed(0)}`} />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), 'Cost per Wear']}
                      cursor={{ fill: 'rgba(155, 135, 245, 0.1)' }}
                    />
                    <Bar dataKey="costPerWear" fill="#9b87f5">
                      {bestValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                No wear data yet. Start logging wears!
              </p>
            )}
          </CardContent>
          {bestValue.length > 0 && (
            <CardFooter>
              <Link to="/" className="text-sm text-primary flex items-center hover:underline">
                See all items <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </CardFooter>
          )}
        </Card>
        
        {/* Category breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shirt className="w-5 h-5 mr-2 text-primary" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {categoryData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#9b87f5"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => {
                        return [`${value} items`, props.payload.name];
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                No categories with items yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
